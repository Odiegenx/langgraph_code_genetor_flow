# Browser Games Hub – Ticket Backlog

## Ticket 1: Hub / Start Page Implementation
**Assignee:** Worker A

**Scope Boundaries:**
- **In Scope:** Create `index.html` and `styles.css`. Render three game-selection cards with relative links to game pages. Apply shared layout, typography, and hover states.
- **Out of Scope:** Game-specific styling, JavaScript logic, backend integrations, mobile/touch specific layouts.

**Acceptance Criteria:**
1. `index.html` contains three distinct game-selection cards.
2. Each card links to `snake.html`, `tictactoe.html`, and `memory.html` respectively via relative `href` attributes.
3. `styles.css` is linked and provides a card grid layout, typography, and hover states.
4. HTML uses semantic elements.

**Definition of Done:**
- `index.html` and `styles.css` are created and non-empty.
- Validation script check passes: "`index.html` contains href attributes referencing all three game pages".
- Code merged to main branch.

**Dependencies:**
- None.

---

## Ticket 2: Snake Game Implementation
**Assignee:** Worker A

**Scope Boundaries:**
- **In Scope:** Create `snake.html`, `snake.css`, and `snake.js`. Implement canvas-based rendering, arrow-key controls, score display, game-over detection, restart capability, and a back link.
- **Out of Scope:** Persistent high scores, sound effects, mobile/touch controls.

**Acceptance Criteria:**
1. `snake.html` contains a `<canvas>` element, a score display, a game-over overlay, and a `.back-link` targeting `index.html`.
2. Page links `snake.css` and `snake.js`.
3. Main wrapper uses the `.game-container` class.
4. `snake.js` uses `requestAnimationFrame` or `setInterval` for the game loop.
5. `snake.js` listens for `keydown` events for arrow-key direction changes.
6. Snake grows and score increments upon eating food; game halts on wall/self collision; restart resets state.

**Definition of Done:**
- `snake.html`, `snake.css`, and `snake.js` are created, non-empty, and JS parses without syntax errors.
- Validation script checks pass: "`snake.html` contains a `<canvas>` element" and "`snake.js` contains a `keydown` event listener".
- Game is fully playable in the browser.
- Code merged to main branch.

**Dependencies:**
- None (conceptual dependency on Ticket 1 for full navigation flow, but can be developed in parallel).

---

## Ticket 3: Validation Script Implementation
**Assignee:** Worker A

**Scope Boundaries:**
- **In Scope:** Create `validate_site.js` using only Node.js built-in modules (`fs`, `path`, `vm`). Implement 10 specific structural and syntax checks. Output results to `site_validation_output.txt`.
- **Out of Scope:** Runtime UI testing, performance benchmarking, external npm packages.

**Acceptance Criteria:**
1. Script uses only `fs`, `path`, and `vm` modules.
2. Checks for all 12 required files to exist and be non-empty.
3. Parses all `.js` files for syntax errors using `vm`.
4. Verifies `index.html` links to the 3 game pages.
5. Verifies each game HTML references its own `.css` and `.js`.
6. Verifies `snake.html` contains `<canvas>`.
7. Verifies `snake.js` contains `keydown`.
8. Verifies `tictactoe.html` contains a grid container with >= 9 children/pattern.
9. Verifies `tictactoe.js` contains click handling.
10. Verifies `memory.html` contains a card grid container.
11. Verifies `memory.js` contains card-flip/match logic.
12. Writes pass/fail results to `site_validation_output.txt`.
13. Exits with code `0` on all-pass, non-zero otherwise.

**Definition of Done:**
- `validate_site.js` is created and non-empty.
- Script executes successfully against the completed project directory, outputs `site_validation_output.txt`, and exits 0.
- Code merged to main branch.

**Dependencies:**
- Tickets 1, 2, 4, and 5 (must be completed to validate successfully, though the script itself can be written in parallel).

---

## Ticket 4: Tic Tac Toe Game Implementation
**Assignee:** Worker B

**Scope Boundaries:**
- **In Scope:** Create `tictactoe.html`, `tictactoe.css`, and `tictactoe.js`. Implement a 3x3 clickable grid, alternating X/O turns, win/draw detection, reset button, and a back link.
- **Out of Scope:** AI opponent, multiplayer networking, score tracking across sessions.

**Acceptance Criteria:**
1. `tictactoe.html` contains a grid container with at least 9 child elements, a turn indicator, status text, a reset button, and a `.back-link` targeting `index.html`.
2. Page links `tictactoe.css` and `tictactoe.js`.
3. Main wrapper uses the `.game-container` class.
4. `tictactoe.css` uses `display: grid; grid-template-columns: repeat(3,1fr)` for layout.
5. `tictactoe.js` implements click handlers on cells, alternating X/O placement, win detection (8 lines), draw detection, and reset functionality.
6. No shared JS state with other games.

**Definition of Done:**
- `tictactoe.html`, `tictactoe.css`, and `tictactoe.js` are created, non-empty, and JS parses without syntax errors.
- Validation script checks pass: "`tictactoe.html` contains a grid container..." and "`tictactoe.js` contains click event handling on cells".
- Game is fully playable in the browser.
- Code merged to main branch.

**Dependencies:**
- None (conceptual dependency on Ticket 1 for full navigation flow, but can be developed in parallel).

---

## Ticket 5: Memory Match Game Implementation
**Assignee:** Worker B

**Scope Boundaries:**
- **In Scope:** Create `memory.html`, `memory.css`, and `memory.js`. Implement a 4x4 grid of face-down cards (8 pairs), click-to-flip interaction, match/mismatch logic, move counter, win detection, and a back link.
- **Out of Scope:** Animations beyond CSS transitions, sound effects, dynamic grid sizing.

**Acceptance Criteria:**
1. `memory.html` contains a card-grid container, move counter display, win message, and a `.back-link` targeting `index.html`.
2. Page links `memory.css` and `memory.js`.
3. Main wrapper uses the `.game-container` class.
4. `memory.css` implements card flip animation (`transform: rotateY` via CSS transition) and matched/unmatched states.
5. `memory.js` shuffles 8 pairs into a 16-card array, enforces max 2 cards face-up at once, implements match/mismatch logic with flip-back delay, increments move counter per pair attempt, and detects win state.
6. No shared JS state with other games.

**Definition of Done:**
- `memory.html`, `memory.css`, and `memory.js` are created, non-empty, and JS parses without syntax errors.
- Validation script checks pass: "`memory.html` contains a card grid container" and "`memory.js` contains card-flip/match logic".
- Game is fully playable in the browser.
- Code merged to main branch.

**Dependencies:**
- None (conceptual dependency on Ticket 1 for full navigation flow, but can be developed in parallel).

---

## Ticket 6: Final Integration & Validation
**Assignee:** Tech Lead

**Scope Boundaries:**
- **In Scope:** Execute `validate_site.js` against the fully merged codebase. Verify cross-worker contracts (consistent class naming, relative links, no shared state). Generate final documentation (`README.md`, `docs/architecture.md`, `docs/deployment_checklist.md`).
- **Out of Scope:** Feature development, UI changes.

**Acceptance Criteria:**
1. `node validate_site.js` exits with code `0`.
2. `site_validation_output.txt` confirms all 10 checks pass.
3. Navigation from `index.html` to all games and back via `.back-link` works seamlessly in the browser.
4. All game containers correctly utilize the `.game-container` class.
5. `README.md`, `docs/architecture.md`, and `docs/deployment_checklist.md` are created and accurately reflect the final state of the project.

**Definition of Done:**
- All validation checks pass.
- All required documentation files are committed.
- Project is deemed complete and deployable as a static site.

**Dependencies:**
- Tickets 1, 2, 3, 4, and 5 must be completed and merged.
