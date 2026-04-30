# Architecture: Browser Games Hub

## 1. Overview
Browser Games Hub is a static, single-page web application serving as a hub for three vanilla JS games (Snake, Tic Tac Toe, Memory Match). It uses a view-swapping pattern to navigate between a central landing page and individual game containers. A local Node.js script validates project integrity and syntax without external dependencies.

## 2. Component Decomposition

| Component | Owner | Responsibility |
|---|---|---|
| `index.html` | Worker A | Entry point. Renders landing page UI (3 game cards). Holds 3 hidden `<div>` game containers. Loads CSS and JS. Handles view swapping logic (show/hide containers, trigger game init). |
| `css/main.css` | Worker A | Global layout, theming (CSS variables), responsive design, basic CSS transitions for UI and card flips. |
| `js/snake.js` | Worker A | Snake game loop, arrow-key controls, collision detection, scoring, game-over state. Exposes `window.initSnake(containerId)`. |
| `js/tictactoe.js` | Worker B | 3x3 grid, two-player local turns, win/draw detection, reset mechanism. Exposes `window.initTicTacToe(containerId)`. |
| `js/memory.js` | Worker B | Card grid generation, flip logic, match detection, win condition. Exposes `window.initMemoryMatch(containerId)`. |
| `validate_site.js` | Worker A | Node.js CLI script. Verifies file existence, validates JS syntax via `new Function()`, writes `site_validation_output.txt`, sets exit code. |

## 3. Dataflow & Integration

### Application Flow
1. **Load:** Browser opens `index.html`, applying `main.css` and loading the three game scripts in order: `snake.js`, `tictactoe.js`, `memory.js`.
2. **Select:** User clicks a game card on the landing page.
3. **Transition:** `index.html` JS hides the landing page and reveals the corresponding game `<div>` container.
4. **Initialize:** `index.html` JS calls the game's init function (e.g., `window.initSnake('snake-container')`), passing the ID of the now-visible container.
5. **Play:** The game script takes exclusive control of the container, handling rendering, state, and input.
6. **Return:** User clicks a "Back to Hub" button (rendered by the game or the shell). The game container is hidden, the landing page is shown, and the game state is reset/destroyed.

### Integration Contract
- **Script Loading Order:** `snake.js` -> `tictactoe.js` -> `memory.js`.
- **API:** Each game must attach a function to `window`: `initSnake`, `initTicTacToe`, `initMemoryMatch`.
- **Input:** Each init function receives a `containerId` (string) and must render the entire game inside that element.
- **Isolation:** Games must not pollute the global scope beyond their init function and must not interfere with other game containers.

### Validation Flow
1. Execute `node browser-games/validate_site.js`.
2. Script uses `fs.existsSync()` to verify all 6 required files exist under `browser-games/`.
3. Script uses `fs.readFileSync()` and `new Function(code)` wrapped in `try/catch` to syntax-check `.js` files.
4. Script writes a pass/fail summary to `site_validation_output.txt` (in the working directory).
5. Script calls `process.exit(0)` on full success, `process.exit(1)` on any failure.

## 4. Constraints & Boundaries

- **Tech Stack:** Vanilla HTML, CSS, and JS only. No frameworks, libraries, or external CSS/JS CDNs.
- **Worker Boundaries:** Worker A must not modify Worker B files, and vice versa. Integration happens strictly via the defined `window` API and HTML containers.
- **Runtime:** 
  - Browser: Must run by opening `index.html` directly (file:// protocol compatible, no CORS issues).
  - Node.js: Used strictly for the validation script; no npm packages allowed, only built-ins (`fs`, `path`, `vm`/`Function`).
- **Out of Scope:** No backend, no API calls, no persistent storage (localStorage), no complex animations beyond CSS transitions, no multiplayer/leaderboards.
