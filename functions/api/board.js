// The community board for Postcard Puzzle.
// By Grey Donovan, with Erin. MIT licensed.
//   GET  /api/board              -> which pieces are placed, and who helped
//   POST /api/board {pieces, who} -> place pieces (never removes any)
// Its own D1 database (binding DB).
//
// PIECES comes from wrangler.toml [vars] and must equal community.cols × community.rows
// in site/puzzle.config.js. Agents can play too: GET to see the board, POST piece numbers
// (row-major, 0-based) with a name. Placing is append-only, so nobody can undo anyone.

const piecesOf = env => Number(env.PIECES) || 294;

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
});

function cleanName(v) {
  if (typeof v !== 'string') return 'a guest';
  const s = v.replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 30);
  return s || 'a guest';
}

async function snapshot(db, PIECES) {
  const [pieces, helpers, last] = await db.batch([
    db.prepare('SELECT piece FROM placed'),
    // Names only, in the order people first joined in. No counts are shown:
    // it's a party, not a leaderboard.
    db.prepare('SELECT who FROM placed GROUP BY who ORDER BY MIN(placed_at) LIMIT 60'),
    db.prepare('SELECT who, placed_at FROM placed ORDER BY placed_at DESC, piece DESC LIMIT 1'),
  ]);
  return {
    total: PIECES,
    placed: pieces.results.map(r => r.piece),
    helpers: helpers.results.map(r => r.who),
    last: last.results[0] || null,
  };
}

export async function onRequestGet({ env }) {
  return json(await snapshot(env.DB, piecesOf(env)));
}

export async function onRequestPost({ request, env }) {
  const PIECES = piecesOf(env);
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reason: 'Not JSON.' }, 400); }

  const raw = Array.isArray(body.pieces) ? body.pieces : [body.piece];
  const valid = [...new Set(raw.map(Number).filter(n => Number.isInteger(n) && n >= 0 && n < PIECES))].slice(0, 50);
  if (!valid.length) return json({ ok: false, reason: 'No valid piece numbers.' }, 400);

  const who = cleanName(body.who);
  const results = await env.DB.batch(
    valid.map(p => env.DB.prepare('INSERT OR IGNORE INTO placed (piece, who) VALUES (?, ?)').bind(p, who)),
  );
  const added = results.reduce((s, r) => s + Number(r.meta?.changes || 0), 0);
  return json({ ok: true, added, ...(await snapshot(env.DB, PIECES)) });
}
