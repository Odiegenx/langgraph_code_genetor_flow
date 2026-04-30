# Ticket Backlog: browser-games

## Ticket 1: Landing Page & Shared Theme
**Owner:** Worker A  
**Scope:** Create the main entry point of the application and the global stylesheet that ensures a consistent look and feel across all pages.  
- **In Scope:** `index.html`, `styles.css`
- **Out of Scope:** Game-specific logic, game-specific CSS, validation script.

**Acceptance Criteria:**
1. `index.html` renders a clean landing page displaying three clickable game cards (Snake, Tic Tac Toe, Memory Match).
2. Each game card contains a title and a brief description.
3. `index.html` contains `<link rel="stylesheet" href="styles.css">`.
4. `index.html` contains `<a>` elements with `href="snake.html"`, `href="tictactoe.html"`, and `href="memory.html"`.
5. `styles.css` defines shared theming (colors, fonts, spacing, layout) consumed by all pages.

**Definition of Done:**
- `index.html` and `styles.css` are created and non-empty.
- The landing page renders correctly in a desktop browser.
- Navigation links correctly point to the three game HTML files.
- Shared theme is visually consistent and ready to be consumed by game pages.

**Dependencies:** None

---

## Ticket 2: Snake Game
**Owner:** Worker A  
**Scope:** Implement the Snake game with canvas rendering, keyboard controls, scoring, and state management.  
- **In Scope:** `snake.html`, `snake.css`, `snake.js`
- **Out of Scope:** AI opponents, persistent high scores (`localStorage`), sound effects, responsive/mobile layouts.

**Acceptance Criteria:**
1. `snake.html` provides `<canvas id="game-canvas">` and overlay `<div>`s for start and game-over states.
2. `snake.html` includes `<link>` tags for `styles.css` and `snake.css`, and a `<script>` tag for `snake.js`.
3. `snake.css` styles the canvas and overlay screens.
4. `snake.js` implements a game loop via `requestAnimationFrame` or `setInterval`.
5. `snake.js` handles `keydown` events for arrow keys to change snake direction.
6. `snake.js` manages snake position, food generation, and collision detection (walls and self).
7. Score is displayed during gameplay.
8. Game toggles between start, active, and game-over states.
9. Provides restart capability from the game-over state.
10. JS files only query DOM elements defined in `snake.html`.

**Definition of Done:**
- `snake.html`, `snake.css`, and `snake.js` are created and non-empty.
- Game is fully playable in a desktop browser using arrow keys.
- All three game states (start, active, game-over) function correctly.
- Score updates accurately during play.

**Dependencies:** Ticket 1 (requires `styles.css` to exist for linking and shared theme variables).

---

## Ticket 3: Tic Tac Toe Game
**Owner:** Worker B  
**Scope:** Implement a two-player local Tic Tac Toe game with win/draw detection and reset functionality.  
- **In Scope:** `tictactoe.html`, `tictactoe.css`, `tictactoe.js`
- **Out of Scope:** AI opponents, persistent scores, responsive layouts.

**Acceptance Criteria:**
1. `tictactoe.html` renders a 3x3 grid of clickable cells (e.g., `<div class="cell">`), a turn indicator, result display, and a reset button.
2. `tictactoe.html` includes `<link>` tags for `styles.css` and `tictactoe.css`, and a `<script>` tag for `tictactoe.js`.
3. `tictactoe.css` styles the grid, X/O markers, and interactive hover states.
4. `tictactoe.js` tracks board state in a 1D or 2D array.
5. `tictactoe.js` alternates turns between 'X' and 'O' on cell click.
6. `tictactoe.js` checks for win (3 rows, 3 cols, 2 diagonals) or draw (9 filled cells) after each move and updates DOM with result.
7. Reset button click clears board state and resets the DOM.
8. JS files only query DOM elements defined in `tictactoe.html`.

**Definition of Done:**
- `tictactoe.html`, `tictactoe.css`, and `tictactoe.js` are created and non-empty.
- Game is fully playable for two local players.
- Win and draw conditions are correctly detected and displayed.
- Reset button restores the game to its initial state.

**Dependencies:** Ticket 1 (requires `styles.css` to exist for linking and shared theme variables).

---

## Ticket 4: Memory Match Game
**Owner:** Worker B  
**Scope:** Implement the Memory Match card game with CSS flip transitions, match detection, and move counting.  
- **In Scope:** `memory.html`, `memory.css`, `memory.js`
- **Out of Scope:** Complex JS animations (must use CSS transitions), sound effects, responsive layouts.

**Acceptance Criteria:**
1. `memory.html` renders a 4x4 grid of cards (e.g., `<div class="card">`), move/match counters, and a restart button.
2. `memory.html` includes `<link>` tags for `styles.css` and `memory.css`, and a `<script>` tag for `memory.js`.
3. `memory.css` implements 3D card flip using CSS transitions (`transform: rotateY`) and styles matched/unmatched states.
4. `memory.js` initializes and shuffles 8 pairs of cards.
5. `memory.js` handles card clicks, enforcing a maximum of 2 flipped cards per turn.
6. `memory.js` checks for matches; if unmatched, flips cards back after a short `setTimeout`.
7. Move counter increments per turn (2 card flips).
8. Win condition is detected when all 8 pairs are matched.
9. Restart button resets state, reshuffles cards, and updates DOM.
10. JS files only query DOM elements defined in `memory.html`.

**Definition of Done:**
- `memory.html`, `memory.css`, and `memory.js` are created and non-empty.
- Game is fully playable with correct match/mismatch logic.
- CSS flip transitions work smoothly.
- Move counter and match counter update correctly.
- Win condition triggers properly, and restart functions correctly.

**Dependencies:** Ticket 1 (requires `styles.css` to exist for linking and shared theme variables).

---

## Ticket 5: Validation Script
**Owner:** Worker A  
**Scope:** Create a local Node.js validation script to perform static analysis and ensure structural/functional integrity across the entire project.  
- **In Scope:** `validate_site.js`, `site_validation_output.txt`
- **Out of Scope:** Web application logic, external npm packages.

**Acceptance Criteria:**
1. Script is runnable via `node validate_site.js` from the project directory.
2. Verifies all 12 required files exist and are non-empty.
3. Parses all `.js` files using Node's `vm` module to check for syntax errors.
4. Reads `index.html` to verify anchor `href`s pointing to `snake.html`, `tictactoe.html`, and `memory.html`.
5. Reads game HTML files to verify `<link>` and `<script>` references to corresponding CSS and JS files.
6. Reads CSS files to verify expected selectors exist.
7. Verifies JS files reference DOM selectors (IDs/Classes) that actually exist in their corresponding HTML files.
8. Writes structured PASS/FAIL results for each criterion to `site_validation_output.txt` in the project root directory.

**Definition of Done:**
- `validate_site.js` is created and non-empty.
- Execution of the script completes without runtime errors.
- `site_validation_output.txt` is generated upon execution.
- The output file contains clear PASS/FAIL indicators for all 8 validation criteria outlined above.

**Dependencies:** Tickets 1, 2, 3, and 4 (requires all 12 project files to be present to successfully validate the complete project, though the script itself can be developed in parallel against the defined contracts).
