# Browser Games Hub - Ticket Backlog

## Ticket 1: Site Shell & Shared Styling
**Owner:** Worker B  
**Dependencies:** None

**Scope Boundaries:**
- **In Scope:** Create `index.html` as the landing page with three game selection cards. Create `styles.css` with a cohesive color palette, typography, and layout structures (cards, grids, buttons, navigation) to be used across all pages.
- **Out of Scope:** Game logic, game-specific HTML/JS files, validation scripting, documentation.

**Acceptance Criteria:**
- `index.html` exists and links to `styles.css`.
- `index.html` renders three game selection cards/buttons with valid navigation links to `snake.html`, `tictactoe.html`, and `memory.html`.
- `styles.css` defines shared styles for cohesive theming (colors, typography, cards, grids, buttons, navigation).
- Both files function correctly via the `file://` protocol without a server.
- No frameworks, libraries, or npm packages are used.

**Definition of Done:**
- `index.html` and `styles.css` are implemented and pass manual visual verification.
- HTML and CSS validate without syntax errors.
- Navigation links correctly point to the three game HTML files.

---

## Ticket 2: Snake Game Implementation
**Owner:** Worker A  
**Dependencies:** Ticket 1 (for `styles.css` integration)

**Scope Boundaries:**
- **In Scope:** Create `snake.html` and `snake.js`. Render the game on a canvas/grid. Handle keyboard input for movement, food consumption/growth, wall/self-collision detection, score display, and restart capability. Include a "Back to Hub" link.
- **Out of Scope:** Mobile/touch controls, AI opponents, persistent high scores (`localStorage`), sound effects, imports from other game files.

**Acceptance Criteria:**
- `snake.html` links to `styles.css` and `snake.js`.
- `snake.html` includes a "Back to Hub" link pointing to `index.html`.
- `snake.js` is entirely self-contained (no cross-game imports).
- Game renders on a canvas/grid and responds to keyboard-only controls.
- Snake grows upon eating food; score updates accordingly.
- Game ends on wall or self-collision, displaying the outcome.
- Restart capability resets the game state.
- Functions correctly via the `file://` protocol.

**Definition of Done:**
- `snake.html` and `snake.js` are implemented.
- Game is fully playable meeting all acceptance criteria.
- No ES modules or `fetch` requests for local files are used.

---

## Ticket 3: Tic Tac Toe Game Implementation
**Owner:** Worker A  
**Dependencies:** Ticket 1 (for `styles.css` integration)

**Scope Boundaries:**
- **In Scope:** Create `tictactoe.html` and `tictactoe.js`. Render a 3×3 DOM grid. Manage two-player turn alternation (X/O), win/draw state detection, and reset functionality. Include a "Back to Hub" link.
- **Out of Scope:** Single-player AI opponents, persistent state, animations beyond basic CSS transitions, imports from other game files.

**Acceptance Criteria:**
- `tictactoe.html` links to `styles.css` and `tictactoe.js`.
- `tictactoe.html` includes a "Back to Hub" link pointing to `index.html`.
- `tictactoe.js` is entirely self-contained.
- Game renders a 3×3 DOM grid.
- Turns alternate strictly between X and O for two local players.
- Win and draw states are correctly detected and displayed.
- Reset functionality reinitializes the game state.
- Functions correctly via the `file://` protocol.

**Definition of Done:**
- `tictactoe.html` and `tictactoe.js` are implemented.
- Game is fully playable meeting all acceptance criteria.
- No ES modules or `fetch` requests for local files are used.

---

## Ticket 4: Memory Match Game Implementation
**Owner:** Worker A  
**Dependencies:** Ticket 1 (for `styles.css` integration)

**Scope Boundaries:**
- **In Scope:** Create `memory.html` and `memory.js`. Render a 4×4 grid (8 pairs). Manage card flip logic (max 2 at a time), match persistence, move counting, and win state upon matching all pairs. Include a "Back to Hub" link.
- **Out of Scope:** Grid sizes other than 4×4, persistent state, animations beyond basic CSS transitions, imports from other game files.

**Acceptance Criteria:**
- `memory.html` links to `styles.css` and `memory.js`.
- `memory.html` includes a "Back to Hub" link pointing to `index.html`.
- `memory.js` is entirely self-contained.
- Game renders exactly a 4×4 grid (8 pairs).
- Card flip logic restricts flipping to a maximum of 2 cards at a time.
- Matched cards persist on the board; unmatched cards flip back.
- Move counter increments appropriately.
- Win state is triggered and displayed when all pairs are matched.
- Functions correctly via the `file://` protocol.

**Definition of Done:**
- `memory.html` and `memory.js` are implemented.
- Game is fully playable meeting all acceptance criteria.
- No ES modules or `fetch` requests for local files are used.

---

## Ticket 5: Node.js Validation Script
**Owner:** Worker B  
**Dependencies:** Tickets 2, 3, 4 (requires all 9 project files to exist for full validation pass)

**Scope Boundaries:**
- **In Scope:** Create `validate_site.js`. Validate project integrity by checking the existence of all 9 required files. Verify JS syntax for `snake.js`, `tictactoe.js`, `memory.js`, and `validate_site.js` using `vm.createScript`. Output results to `site_validation_output.txt` and set appropriate exit codes.
- **Out of Scope:** Validating HTML/CSS syntax, running automated UI tests, installing npm packages.

**Acceptance Criteria:**
- `validate_site.js` exists and uses strictly Node.js built-in modules (`fs`, `path`, `vm`).
- Script checks for the existence of all 9 project files (`index.html`, `styles.css`, `snake.html`, `snake.js`, `tictactoe.html`, `tictactoe.js`, `memory.html`, `memory.js`, `validate_site.js`).
- Script uses `vm.createScript` to parse the 4 JS files without executing them.
- Script writes pass/fail results to `site_validation_output.txt`.
- Script exits with code `0` on success and non-zero on failure.
- Script is designed to be run from inside the `browser-games/` directory (`node validate_site.js`).

**Definition of Done:**
- `validate_site.js` is implemented.
- Running `node validate_site.js` successfully creates `site_validation_output.txt`.
- Script accurately reports missing files or syntax errors and exits with a non-zero code when failures are intentionally introduced.

---

## Ticket 6: Project Documentation
**Owner:** Unassigned (Collaborative / Lead)  
**Dependencies:** Tickets 1, 2, 3, 4, 5 (requires complete project overview)

**Scope Boundaries:**
- **In Scope:** Create `README.md` with setup and usage instructions. Create `docs/runbook.md` with troubleshooting guidance. Create `docs/deployment_checklist.md` with a checklist for static hosting deployment.
- **Out of Scope:** API documentation, CI/CD pipeline documentation, automated test documentation.

**Acceptance Criteria:**
- `README.md` exists and contains clear setup and usage instructions for both the games and the validation script.
- `docs/runbook.md` exists and provides troubleshooting guidance for common issues (e.g., `file://` protocol restrictions, Node.js version requirements).
- `docs/deployment_checklist.md` exists and outlines the necessary steps/checks for deploying the static site to a static host.
- All documentation is formatted in clear Markdown.

**Definition of Done:**
- All three documentation files are created in their specified paths.
- Documentation accurately reflects the final state of the project, constraints, and validation tooling.
