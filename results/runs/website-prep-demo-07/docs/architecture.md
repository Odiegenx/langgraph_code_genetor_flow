# Architecture: browser-games

## 1. Overview
The **browser-games** project is a static, client-only web application serving as a hub for three classic games: Snake, Tic Tac Toe, and Memory Match. Built entirely with vanilla HTML5, CSS3, and ES6+ JavaScript, it features a shared visual theme and a local Node.js validation script to ensure structural and functional integrity across all files.

## 2. Component Decomposition

### Worker A Components
| File | Type | Role |
|---|---|---|
| `index.html` | Markup | Landing page with game cards and navigation links |
| `styles.css` | Stylesheet | Shared global theme, layout, and typography |
| `snake.html` | Markup | Snake game container and UI overlays |
| `snake.css` | Stylesheet | Snake-specific styles (canvas, overlays) |
| `snake.js` | Logic | Snake game loop, canvas rendering, and input handling |
| `validate_site.js` | Node.js Script | Static analysis and validation of the entire project |

### Worker B Components
| File | Type | Role |
|---|---|---|
| `tictactoe.html` | Markup | Tic Tac Toe grid container and status display |
| `tictactoe.css` | Stylesheet | Tic Tac Toe grid layout and marker styles |
| `tictactoe.js` | Logic | Turn management, win/draw detection, and board updates |
| `memory.html` | Markup | Memory Match card grid and status display |
| `memory.css` | Stylesheet | Card grid layout and CSS flip transitions |
| `memory.js` | Logic | Card shuffling, flip logic, match detection, and counters |

## 3. Responsibilities

### `index.html` & `styles.css`
- Render a clean, attractive landing page.
- Display three clickable game cards containing a title and brief description.
- Provide shared theming (colors, fonts, spacing) consumed by all game pages.

### Snake Game (`snake.*`)
- **HTML**: Provide a `<canvas id="game-canvas">` and overlay `<div>`s for start/game-over states.
- **CSS**: Style the canvas and overlay screens.
- **JS**: Implement a game loop via `requestAnimationFrame` or `setInterval`. Handle `keydown` events for arrow keys. Manage snake position, food generation, collision detection (walls/self), and score. Toggle game states (start, active, game-over). Provide restart capability.

### Tic Tac Toe Game (`tictactoe.*`)
- **HTML**: Render a 3x3 grid of clickable cells (e.g., `<div class="cell">`), a turn indicator, result display, and a reset button.
- **CSS**: Style the grid, X/O markers, and interactive hover states.
- **JS**: Track board state in a 1D/2D array. Alternate turns between 'X' and 'O'. On cell click, update board, check for win (3 rows, 3 cols, 2 diagonals) or draw (9 filled cells), and update DOM. Reset board state and DOM on reset button click.

### Memory Match Game (`memory.*`)
- **HTML**: Render a 4x4 grid of cards (e.g., `<div class="card">`), move/match counters, and a restart button.
- **CSS**: Implement 3D card flip using CSS transitions (`transform: rotateY`). Style matched and unmatched states.
- **JS**: Initialize and shuffle 8 pairs of cards. Handle card clicks, enforcing a maximum of 2 flipped cards per turn. Check for matches; if unmatched, flip back after a short `setTimeout`. Increment move counter per turn. Detect win condition when all 8 pairs are matched. Reset state and reshuffle on restart.

### Validation Script (`validate_site.js`)
- Run via Node.js (`node validate_site.js`).
- Verify all 12 required files exist and are non-empty.
- Parse all `.js` files using Node's `vm` module to check for syntax errors.
- Read HTML files to verify required markup, anchor `href`s, and `<link>`/`<script>` references.
- Read CSS files to verify expected selectors exist.
- Verify JS files reference DOM selectors that actually exist in their corresponding HTML files.
- Write structured PASS/FAIL results for each criterion to `site_validation_output.txt`.

## 4. Dataflow & Interactions

### Navigation Flow
1. User lands on `index.html`.
2. User clicks a game card `<a>` tag.
3. Browser navigates to the respective game HTML file (`snake.html`, `tictactoe.html`, or `memory.html`).
4. User navigates back to `index.html` via browser back button.

### Game Dataflows
- **Snake**: Keyboard Input → JS Event Listener → Update Snake Array & Score → Clear & Redraw Canvas → State Check (Game Over?).
- **Tic Tac Toe**: Click Input → JS Event Listener → Update Board Array → Check Win/Draw → Update DOM (Marker, Result Text).
- **Memory Match**: Click Input → JS Event Listener → Update Card State → Check Match → Update DOM (Flip Card via CSS class, Update Counters) → Timeout (if no match) → Update DOM (Unflip Card).

### Validation Dataflow
1. Developer executes `node validate_site.js`.
2. Script reads the `browser-games` directory.
3. Script performs file I/O to read HTML, CSS, and JS files.
4. Script performs syntax checks and string/regex matching for wiring verification.
5. Script writes final report to `site_validation_output.txt`.

## 5. Constraints & Non-Functional Requirements
- **Technology**: Vanilla HTML5, CSS3, ES6+ JavaScript only. No frameworks (React, Angular, etc.) or external libraries (jQuery, etc.).
- **Dependencies**: Zero external CDN or npm dependencies for the web application. Node.js standard library only for the validation script.
- **Scope Exclusions**: No AI opponents, no `localStorage` for high scores, no sound effects, no complex JS animations (CSS transitions are permitted), no mobile/responsive layouts required.
- **Environment**: Desktop browser environment for games; Node.js environment for validation.

## 6. Cross-File Contracts
To ensure seamless integration between Worker A and Worker B outputs:
1. **Shared Theme**: `tictactoe.html` and `memory.html` must include `<link rel="stylesheet" href="styles.css">`.
2. **Navigation**: `index.html` must contain `<a>` elements with `href="snake.html"`, `href="tictactoe.html"`, and `href="memory.html"`.
3. **Resource Wiring**: Each game HTML file must link to its corresponding game-specific `.css` and `.js` files (e.g., `<link rel="stylesheet" href="tictactoe.css">` and `<script src="tictactoe.js"></script>`).
4. **DOM Wiring**: Game-specific `.js` files must only query DOM elements (IDs/Classes) that are explicitly defined in their corresponding game HTML file.
5. **Validation Output**: `validate_site.js` must strictly write its final output to `site_validation_output.txt` in the project root directory.
