# Ticket Backlog: Browser Games Hub

## Ticket 1: Landing Page & Global Styling
**Owner:** Worker A  
**Dependencies:** None

**Scope Boundaries:**
- **In Scope:** Create `browser-games/index.html` and `browser-games/css/main.css`. Implement the landing page UI with three game selection cards. Implement the view-swapping logic to hide the landing page and show the specific game container. Include `<script>` tags for all three games in the specified order (`snake.js`, `tictactoe.js`, `memory.js`). Include three hidden `<div>` containers for the games. Implement a "Back to Hub" mechanism.
- **Out of Scope:** Game logic, game rendering within the containers, Node.js scripting, external libraries/CDNs.

**Acceptance Criteria:**
- Landing page displays three game cards (Snake, Tic Tac Toe, Memory Match).
- Clicking a game card hides the landing page and reveals the corresponding game `<div>`.
- The "Back to Hub" button hides the active game container and restores the landing page.
- HTML loads `css/main.css` and the three JS files in the exact order specified.
- CSS uses CSS variables for theming and provides responsive layout.
- Application runs correctly via `file://` protocol without CORS errors.

**Definition of Done:**
- `index.html` and `css/main.css` are created under `browser-games/`.
- View swapping works seamlessly in the browser.
- No external dependencies are used.
- Code passes basic syntax validation.

---

## Ticket 2: Snake Game Implementation
**Owner:** Worker A  
**Dependencies:** None (Can be developed in parallel, relies on integration contract)

**Scope Boundaries:**
- **In Scope:** Create `browser-games/js/snake.js`. Implement the game loop, arrow-key controls, collision detection (walls and self), scoring, and game-over state. Expose `window.initSnake(containerId)`.
- **Out of Scope:** Modifying `index.html` or other JS files. Persistent high scores (localStorage). Touch/mobile controls.

**Acceptance Criteria:**
- `window.initSnake` is defined and accepts a `containerId` string.
- Calling `initSnake` renders a fully playable Snake game inside the specified container.
- Arrow keys control the snake's direction.
- Score increases when the snake eats food.
- Game ends on collision with walls or the snake's own body, displaying a game-over state.
- Game state is isolated to the container and does not pollute the global scope beyond `window.initSnake`.

**Definition of Done:**
- `js/snake.js` is created under `browser-games/`.
- Game is fully playable within the hub's container.
- No global scope pollution beyond the init function.
- Code is valid vanilla JavaScript.

---

## Ticket 3: Tic Tac Toe Implementation
**Owner:** Worker B  
**Dependencies:** None (Can be developed in parallel, relies on integration contract)

**Scope Boundaries:**
- **In Scope:** Create `browser-games/js/tictactoe.js`. Implement a 3x3 grid, two-player local turn switching, win/draw detection, and a reset mechanism. Expose `window.initTicTacToe(containerId)`.
- **Out of Scope:** Modifying `index.html` or other JS files. AI opponent. Online multiplayer.

**Acceptance Criteria:**
- `window.initTicTacToe` is defined and accepts a `containerId` string.
- Calling `initTicTacToe` renders a 3x3 grid inside the specified container.
- Players alternate turns (X and O) by clicking grid cells.
- UI indicates whose turn it is.
- Game correctly detects and announces a win or a draw.
- A reset button/clear mechanism allows starting a new game.
- Game state is isolated to the container and does not pollute the global scope beyond `window.initTicTacToe`.

**Definition of Done:**
- `js/tictactoe.js` is created under `browser-games/`.
- Game is fully playable within the hub's container.
- No global scope pollution beyond the init function.
- Code is valid vanilla JavaScript.

---

## Ticket 4: Memory Match Implementation
**Owner:** Worker B  
**Dependencies:** None (Can be developed in parallel, relies on integration contract)

**Scope Boundaries:**
- **In Scope:** Create `browser-games/js/memory.js`. Implement card grid generation, flip logic (using CSS transitions), match detection, and a win condition. Expose `window.initMemoryMatch(containerId)`.
- **Out of Scope:** Modifying `index.html` or other JS files. Complex animations beyond CSS transitions. Leaderboards.

**Acceptance Criteria:**
- `window.initMemoryMatch` is defined and accepts a `containerId` string.
- Calling `initMemoryMatch` renders a grid of face-down cards inside the specified container.
- Clicking a card flips it face-up using a CSS transition.
- Selecting two matching cards leaves them face-up; selecting two non-matching cards flips them back face-down.
- Game detects and announces a win condition when all pairs are matched.
- Game state is isolated to the container and does not pollute the global scope beyond `window.initMemoryMatch`.

**Definition of Done:**
- `js/memory.js` is created under `browser-games/`.
- Game is fully playable within the hub's container.
- No global scope pollution beyond the init function.
- Code is valid vanilla JavaScript.

---

## Ticket 5: Validation Script
**Owner:** Worker A  
**Dependencies:** None (Logically depends on all files existing, but can be built based on expected file list)

**Scope Boundaries:**
- **In Scope:** Create `browser-games/validate_site.js`. Implement file existence checks for all 6 required project files. Implement JS syntax validation using `new Function()`. Write results to `site_validation_output.txt` and set exit codes.
- **Out of Scope:** Runtime linting, style checking, npm packages, validating CSS/HTML syntax.

**Acceptance Criteria:**
- Script uses only Node.js built-ins (`fs`, `path`, `vm`/`Function`).
- Script verifies the existence of: `index.html`, `css/main.css`, `js/snake.js`, `js/tictactoe.js`, `js/memory.js`, `validate_site.js` under `browser-games/`.
- Script reads each `.js` file and attempts to parse it via `new Function(code)` wrapped in try/catch.
- A pass/fail summary is written to `site_validation_output.txt` in the working directory.
- Script calls `process.exit(0)` on full success and `process.exit(1)` on any failure.

**Definition of Done:**
- `validate_site.js` is created under `browser-games/`.
- Running `node browser-games/validate_site.js` executes without npm dependencies.
- Output file is generated accurately.
- Exit codes correctly reflect the validation state.

---

## Ticket 6: Integration & Final Validation
**Owner:** Tech Lead  
**Dependencies:** Ticket 1, Ticket 2, Ticket 3, Ticket 4, Ticket 5

**Scope Boundaries:**
- **In Scope:** Execute the validation script. Load `index.html` in a browser. Verify view swapping, game initialization, and game isolation. Ensure no worker has modified another worker's files.
- **Out of Scope:** Writing new code or features. Fixing bugs (creating follow-up tickets instead).

**Acceptance Criteria:**
- `node browser-games/validate_site.js` runs successfully with exit code `0`.
- `site_validation_output.txt` confirms all files exist and pass syntax checks.
- In the browser, all three games load and play correctly within their containers.
- Returning to the hub and switching between games rapidly causes no console errors or state leaks.
- Worker A and Worker B file boundaries have been respected (no cross-modifications).

**Definition of Done:**
- Validation script passes.
- All three games are fully playable from the central hub.
- Project adheres strictly to the Architecture and Generation Contract constraints.
