-- The community board. One row per piece that anyone has snapped into place.
-- A placed piece is never un-placed: the board only fills up, so nobody can
-- undo anybody else's work. The PRIMARY KEY makes "two people placed the same
-- piece at once" harmless: the second INSERT is ignored.
CREATE TABLE IF NOT EXISTS placed (
  piece     INTEGER PRIMARY KEY,               -- 0..PIECES-1, row-major on the community grid
  who       TEXT NOT NULL DEFAULT 'a guest',   -- optional name from the register
  placed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
