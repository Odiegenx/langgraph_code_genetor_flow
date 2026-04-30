# Demo Scope

## In Scope
- Single `index.html` landing page with game-selection UI (three buttons/cards).
- Shared `main.css` stylesheet for layout, theming, and responsive design.
- `snake.js` – Full playable Snake game with arrow-key controls, scoring, and game-over state.
- `tictactoe.js` – Two-player local Tic Tac Toe with turn indicator, win/draw detection, and reset.
- `memory.js` – Memory Match with a grid of face-down cards, flip animation, match detection, and win state.
- `validate_site.js` – Node script that verifies file existence and JS syntax validity.

## Out of Scope
- Online multiplayer or leaderboards.
- Persistent high-score storage (localStorage optional but not required).
- Animations beyond basic CSS transitions.
- Backend server or API calls.
- Build tools, bundlers, or npm dependencies.

## Constraints
- Vanilla HTML, CSS, and JavaScript only.
- All games render within the same `index.html` (view swapping via JS).
- Must run by opening `index.html` directly in a browser.
- Validation must pass with only Node.js installed (no extra packages).
