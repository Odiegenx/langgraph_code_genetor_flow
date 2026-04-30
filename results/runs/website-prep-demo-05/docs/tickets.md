# Browser Games Hub — Ticket Backlog

## Ticket 1: Project Scaffolding & Validation Utility
**Owner:** Shared/Scaffold  
**Dependencies:** None

**Scope Boundaries:**
- Create the `browser-games/` directory structure including `css/` and `js/` subdirectories.
- Implement `validate_site.js` to verify the existence of all 11 required files and perform a JavaScript syntax check on all `.js` files using `new Function()` wrapper (no external parsers like `acorn`).
- Write validation results to `site_validation_output.txt`.
- **Out of Scope:** No runtime application logic, no browser testing, no npm package installation.

**Acceptance Criteria:**
- Running `node validate_site.js` from inside `browser-games/` executes without throwing an error.
- The script accurately reports pass/fail for the existence of: `index.html`, `snake.html`, `tictactoe.html`, `memory.html`, `css/main.css`, `css/tictactoe.css`, `css/memory.css`, `js/snake.js`, `js/tictactoe.js`, `js/memory.js`, `validate_site.js`.
- The script accurately reports pass/fail for JS syntax validity of all 4 `.js` files.
- Output file `site_validation_output.txt` is generated and contains the complete test results.

**Definition of Done:**
- Directory structure matches the architecture document exactly.
- `validate_site.js` is complete and functional using Node.js v18+ APIs (`fs.existsSync`, `fs.readFileSync`).
- `site_validation_output.txt` is successfully generated upon execution.

---

## Ticket 2: Hub Page Implementation
**Owner:** Worker A  
**Dependencies:** None

**Scope Boundaries:**
- Implement `index.html` and `css/main.css`.
- Render a navigation menu with three distinct cards/links pointing to `snake.html`, `tictactoe.html`, and `memory.html`.
- Apply shared hub-page styling (layout, card styles, typography) via `css/main.css`.
- **Out of Scope:** No game-specific styles in `main.css`, no JavaScript logic for the hub, no SPA routing, no external dependencies/CDNs.

**Acceptance Criteria:**
- `index.html` contains three `<a href>` links to the respective game pages.
- `css/main.css` is linked in `index.html` and styles the navigation cards.
- Page functions independently with no console errors.
- No external frameworks or CDN links are used.

**Definition of Done:**
- `index.html` and `css/main.css` are created in the correct directories.
- Navigation links correctly route to the three game HTML files.
- Styling is isolated to `css/main.css` (no game CSS present here).

---

## Ticket 3: Snake Game Implementation
**Owner:** Worker A  
**Dependencies:** None

**Scope Boundaries:**
- Implement `snake.html` and `js/snake.js`.
- Create a classic grid-based snake game using a canvas or DOM grid.
- Implement tick-based game loop (`setInterval`), arrow-key-only input, collision detection (wall/self), food consumption, score tracking, and game-over state.
- Include a visible link back to `index.html`.
- **Out of Scope:** No touch controls, no difficulty settings, no persistent scores, no sound, no CSS file creation (inline styles or shared CSS only, per file ownership constraints).

**Acceptance Criteria:**
- Snake moves via arrow keys only; opposite direction input does not cause instant self-collision.
- Game loop moves the snake at a steady interval.
- Eating food increases score and snake length; new food generates randomly.
- Wall or self-collision triggers a game-over overlay with a restart option.
- Current score is visibly rendered.
- A link back to `index.html` is visible and functional.

**Definition of Done:**
- `snake.html` and `js/snake.js` are created in the correct directories.
- Game is fully playable end-to-end without browser console errors.
- JS passes syntax validation in `validate_site.js`.
- Worker A has not modified any Worker B files.

---

## Ticket 4: Tic Tac Toe Game Implementation
**Owner:** Worker B  
**Dependencies:** None

**Scope Boundaries:**
- Implement `tictactoe.html`, `css/tictactoe.css`, and `js/tictactoe.js`.
- Create a 3×3 two-player turn-based game.
- Implement mouse-click input on empty cells, X/O alternation, win line detection (8 lines), draw condition (9 moves, no winner), and a reset button.
- Include a visible link back to `index.html`.
- **Out of Scope:** No AI opponent, no touch controls, no persistent scores, no sound.

**Acceptance Criteria:**
- Clicking an empty cell places the current player's mark (X or O) and toggles the player.
- Clicking an occupied cell is ignored.
- Game correctly detects and highlights all 8 possible winning lines.
- Game detects a draw after 9 moves with no winner.
- Result message (winner or draw) is displayed; board is disabled on win/draw.
- Reset button clears the board and resets state.
- CSS is isolated to `css/tictactoe.css`.
- A link back to `index.html` is visible and functional.

**Definition of Done:**
- `tictactoe.html`, `css/tictactoe.css`, and `js/tictactoe.js` are created in the correct directories.
- Game is fully playable end-to-end without browser console errors.
- JS passes syntax validation in `validate_site.js`.
- Worker B has not modified any Worker A files.

---

## Ticket 5: Memory Match Game Implementation
**Owner:** Worker B  
**Dependencies:** None

**Scope Boundaries:**
- Implement `memory.html`, `css/memory.css`, and `js/memory.js`.
- Create a 4×4 card grid (8 matching pairs).
- Implement mouse-click card flipping, CSS flip animation, match/mismatch logic, move counter, and win state.
- Include a visible link back to `index.html`.
- **Out of Scope:** No touch controls, no difficulty levels, no sound, no timer.

**Acceptance Criteria:**
- 16 cards are rendered in a 4×4 grid, shuffled per game start.
- Clicking a card triggers a CSS flip animation to reveal the symbol.
- First click stores the selection; second click increments the move counter.
- If the second card matches the first, both stay face-up (matched state).
- If the second card does not match, both flip back face-down after a short delay (board is locked during this delay).
- Win message is displayed when all 8 pairs are matched.
- CSS is isolated to `css/memory.css`.
- A link back to `index.html` is visible and functional.

**Definition of Done:**
- `memory.html`, `css/memory.css`, and `js/memory.js` are created in the correct directories.
- Game is fully playable end-to-end without browser console errors.
- JS passes syntax validation in `validate_site.js`.
- Worker B has not modified any Worker A files.

---

## Ticket 6: Final Integration & Validation
**Owner:** Shared/Scaffold  
**Dependencies:** Ticket 1, Ticket 2, Ticket 3, Ticket 4, Ticket 5

**Scope Boundaries:**
- Execute the validation script to ensure all files are present and syntactically valid.
- Verify cross-navigation flow between the hub and all three game pages.
- **Out of Scope:** No code modifications (issues found must be routed back to Worker A or Worker B for resolution).

**Acceptance Criteria:**
- `node validate_site.js` runs successfully and `site_validation_output.txt` shows 11/11 files exist and 4/4 JS files pass syntax checks.
- Clicking links on `index.html` navigates to `snake.html`, `tictactoe.html`, and `memory.html`.
- Clicking the "back to hub" link on each game page navigates to `index.html`.
- All pages load without 404 errors or console errors.

**Definition of Done:**
- Validation output file confirms 100% pass rate for file existence and JS syntax.
- Full navigation flow operates correctly via standard `<a href>` tags.
- Project meets all acceptance criteria defined in `generation_contract.md`.
