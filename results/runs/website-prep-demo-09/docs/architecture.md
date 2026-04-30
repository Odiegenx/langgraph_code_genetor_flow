# Browser Games Hub — Architecture

## 1. Component Decomposition

The project is a static site decomposed into two worker domains (Shared Assets & Game Logic) plus a validation utility.

### Worker A: Landing Page & Shared Assets
| Component | Responsibility |
|---|---|
| `index.html` | Entry point. Renders 3 game navigation cards. Links `styles.css` and `game-select.js`. |
| `styles.css` | Global theming. Defines shared classes: `.game-container`, `.game-header`, `.game-title`, `.btn-back`, `.game-card`. |
| `game-select.js` | Landing page interactivity (hover effects, navigation event wiring). Contains no game logic. |

### Worker B: Game Pages & Logic
| Component | Responsibility |
|---|---|
| `snake.html` / `snake.js` | Snake game UI and logic. Renders `<canvas id="game-canvas">`. Handles arrow-key input, score, and game-over state. Exports `init()`. |
| `tictactoe.html` / `tictactoe.js` | Tic Tac Toe UI and logic. Renders `<div id="board">` (3×3 grid). Alternates X/O turns, detects win/draw. Exports `init()`. |
| `memory.html` / `memory.js` | Memory Match UI and logic. Renders `<div id="card-grid">` (4×4). Handles card flips, match detection, move counter. Exports `init()`. |

### Utility
| Component | Responsibility |
|---|---|
| `validate_site.js` | Node.js CLI script. Verifies file existence, JS syntax, HTML↔CSS/JS linkage, required DOM IDs, and class definitions. Outputs to `site_validation_output.txt`. |

---

## 2. Dataflow

### Navigation Flow
1. **User** loads `index.html` → clicks a `.game-card` link.
2. Browser navigates to target game HTML (`snake.html`, `tictactoe.html`, or `memory.html`).
3. Game HTML loads `styles.css` and its respective JS file.
4. JS `init()` executes on `DOMContentLoaded`, setting up the game loop or event listeners.
5. **User** clicks `.btn-back` → browser navigates to `index.html`.

### Game State Flow
- **Snake:** `requestAnimationFrame` loop reads arrow-key buffer → updates snake position/apple → redraws `<canvas>`.
- **Tic Tac Toe:** Click event on `#board` cells → updates internal 3×3 array → checks win/draw conditions → re-renders DOM grid.
- **Memory Match:** Click event on `#card-grid` cards → flips card (CSS class toggle) → compares 2 flipped cards → updates matched state/move counter.

*Note: No cross-page state persistence. All state is held in JS memory and resets on page reload.*

---

## 3. Constraints

### Technical
- **Stack:** Vanilla HTML5, CSS3, ES6+ JavaScript. No frameworks, bundlers, or npm packages.
- **Size:** Strict limit of < 500 lines of code total across all files.
- **Node.js:** >= 18 required *only* for running `validate_site.js`.
- **Styling:** Worker B must rely exclusively on Worker A's `styles.css` for shared classes (`.game-container`, `.game-header`, `.game-title`, `.btn-back`). Worker B must not redefine `.game-card`.

### DOM Contracts (Cross-Worker)
- **Links:** `index.html` must link to `snake.html`, `tictactoe.html`, `memory.html`. All game pages must link back to `index.html` via an element with class `btn-back`.
- **IDs:** Snake must use `id="game-canvas"`. Tic Tac Toe must use `id="board"`. Memory must use `id="card-grid"`.
- **JS API:** Each game JS file must expose an `init()` function to bootstrap the game.

### Validation
- Must pass `node validate_site.js` with zero errors.
- Checks: File existence, JS syntax validity, HTML linkage to CSS/JS, presence of required DOM IDs/classes, JS `init` function existence.
