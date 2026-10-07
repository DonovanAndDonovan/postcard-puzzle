// puzzle.config.js: everything you'd change to make this puzzle yours.
// The game (index.html) reads this file and never needs editing for a new picture.
//
// Postcard Puzzle, by Grey Donovan, with Erin. MIT licensed.
// First built for a castle on flamingo legs, Oct 2026.

window.PUZZLE = {
  // ---- the picture ----
  image: 'postcard.jpg',            // put your image in site/ (about 2400 px wide or more)

  // ---- words ----
  title: 'The Postcard',
  tagline: 'A community jigsaw',    // small line under the title in the header
  welcome: {
    heading: 'Greetings!',
    sub: 'Somebody dropped the postcard and it went everywhere.',
    body: [
      "We're putting it back together <b>all together</b>: every piece anyone places stays placed for everyone.",
      "Drag pieces onto the board and they'll click into place when they're close. Scroll or pinch to zoom, and drag the empty table to move around.",
    ],
    registerLabel: 'Sign the register',
    registerPlaceholder: "Your name, or your household's",
  },
  finish: {
    heading: 'Wish you were here',
    communitySub: 'Everyone put it back together.',
    ownSub: 'You did it. The postcard is whole again.',
    helpersPrefix: 'With pieces placed by',
    unsignedGuests: "guests who didn't sign the register",
    note: 'Post a screenshot so everyone can see.',   // e.g. 'Post a screenshot in #our-channel.'
    motto: '',                                      // an optional italic line at the bottom of the finish card
  },
  messages: {
    loading: 'Unfolding the postcard…',
    oneArrived: name => `${name || 'Someone'} just placed a piece`,
    manyArrived: n => `${n} new pieces from everyone else`,
    offline: "Can't reach the board right now. Your pieces will go through when it's back.",
    online: 'Back in touch with the board.',
  },
  emoji: '🧩',                       // used on the community buttons

  // ---- the cut ----
  // Choose columns × rows so pieces come out close to square:
  //   (image width ÷ cols) ≈ (image height ÷ rows)
  // The community size must also be set as PIECES in wrangler.toml (cols × rows).
  community: { cols: 21, rows: 14, seed: 20261003 },  // everyone on the shared board gets this exact cut
  own: [                                               // private copies, saved in the visitor's browser
    { cols: 9,  rows: 6,  label: 'a cup of tea' },
    { cols: 15, rows: 10, label: 'an evening' },
    { cols: 21, rows: 14, label: 'the whole weekend' },
  ],

  // ---- storage ----
  storePrefix: 'postcard-puzzle-v1-', // change this per puzzle so two puzzles on one domain don't share saves
};
