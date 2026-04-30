# Browser Games Hub — Ticket Backlog

---

## TICKET-001: Shared Stylesheet (`styles.css`)

**Type:** Implementation  
**Owner:** Worker A  
**Priority:** P0 — Blocking foundation

### Scope Boundaries
- **In Scope:** Define all shared CSS classes required by the cross-worker DOM contract: `.game-container`, `.game-header`, `.game-title`, `.btn-back`, `.game-card`. Establish global theming (color palette, typography, spacing conventions). Style the `.btn-back` navigation element.
- **Out of Scope:** Game-specific styling (canvas sizing, grid layouts, card-flip animations). Responsive breakpoints. Any CSS class redefinitions that belong to Worker B.

### Acceptance Criteria
1. File `styles.css` exists in the project root directory.
2. Contains class definitions for `.game-container`, `.game-header`, `.game-title`, `.btn-back`, and `.game-card`.
3. `.game-card` includes hover/interaction styling suitable for the landing page navigation cards.
4. `.btn-back` is styled as a clickable navigation element.
5. Global theming is consistent (shared color variables or consistent palette usage across all classes).
6. File is valid CSS with no syntax errors.

### Definition of Done
- `styles.css` committed with all five required class definitions.
- File passes CSS syntax validation (no parser errors).
- No game-specific styles are present.
- Line count is reasonable within the 500-line total project budget.

### Dependencies
- None — this is the foundational asset.

---

## TICKET-002: Landing Page (`index.html` + `game-select.js`)

**Type:** Implementation  
**Owner:** Worker A  
**Priority:** P0 — Entry point

### Scope Boundaries
- **In Scope:** Create `index.html` as the project entry point. Render three `.game-card` navigation elements linking to `snake.html`, `tictactoe.html`, and `memory.html`. Link `styles.css` and `game-select.js`. Create `game-select.js` with hover effects and navigation event wiring.
- **Out of Scope:** Any game logic. Any state persistence. Any routing beyond simple `<a>` navigation.

### Acceptance Criteria
1. `index.html` exists and is valid HTML5.
2. Links `styles.css` via `<link>` and `game-select.js` via `<script>`.
3. Contains exactly three `.game-card` elements.
4. Each `.game-card` links to the correct game filename: `snake.html`, `tictactoe.html`, `memory.html`.
5. `game-select.js` loads without errors and contains no game logic.
6. `game-select.js` provides hover/interaction effects on `.game-card` elements.
7. Page renders correctly in a modern browser with all three cards visible and clickable.

### Definition of Done
- Both files committed and syntactically valid.
- Clicking any game card navigates to the corresponding game HTML file.
- `game-select.js` contains zero game-logic functions (no `init()`, no game state).
- HTML validates with no missing required elements.

### Dependencies
- **TICKET-001** — `styles.css` must exist with `.game-card` class definition for proper rendering.

---

## TICKET-003: Snake Game (`snake.html` + `snake.js`)

**Type:** Implementation  
**Owner:** Worker B  
**Priority:** P1 — Core game

### Scope Boundaries
- **In Scope:** Create `snake.html` with a `<canvas id="game-canvas">` element. Link `styles.css` and `snake.js`. Include a `.btn-back` link to `index.html`. Include a `.game-header` with `.game-title`. Create `snake.js` with an exported `init()` function that bootstraps a `requestAnimationFrame` game loop. Handle arrow-key input, snake movement, apple spawning, score tracking, collision detection, and game-over state.
- **Out of Scope:** Persistent high scores. Sound effects. Mobile/touch controls. Difficulty settings. Any redefinition of `.game-card`.

### Acceptance Criteria
1. `snake.html` exists, is valid HTML5, links `styles.css` and `snake.js`.
2. Contains `<canvas id="game-canvas">`.
3. Contains an element with class `btn-back` linking to `index.html`.
4. Contains elements with classes `.game-container`, `.game-header`, `.game-title`.
5. `snake.js` defines an `init()` function callable on `DOMContentLoaded`.
6. Arrow keys control snake direction (up/down/left/right).
7. Snake grows when eating an apple; score increments.
8. Game-over occurs on wall or self-collision.
9. Game state resets on page reload (no persistence).
10. Does **not** redefine `.game-card` class.

### Definition of Done
- Both files committed and syntactically valid.
- Game is playable end-to-end: start → move → eat → score → collide → game-over.
- `init()` is the sole entry point; no auto-executing game logic outside `init()`.
- Canvas renders the snake, apple, and score visibly.
- Back button navigates to `index.html`.

### Dependencies
- **TICKET-001** — `styles.css` must define `.game-container`, `.game-header`, `.game-title`, `.btn-back`.

---

## TICKET-004: Tic Tac Toe Game (`tictactoe.html` + `tictactoe.js`)

**Type:** Implementation  
**Owner:** Worker B  
**Priority:** P1 — Core game

### Scope Boundaries
- **In Scope:** Create `tictactoe.html` with a `<div id="board">` containing a 3×3 grid. Link `styles.css` and `tictactoe.js`. Include `.btn-back` link to `index.html`. Include `.game-header` with `.game-title`. Create `tictactoe.js` with an `init()` function. Implement alternating X/O turns, click-to-place, win detection (rows, columns, diagonals), draw detection, and a reset button.
- **Out of Scope:** AI opponent. Online multiplayer. Persistent score history. Any redefinition of `.game-card`.

### Acceptance Criteria
1. `tictactoe.html` exists, is valid HTML5, links `styles.css` and `tictactoe.js`.
2. Contains `<div id="board">` with a 3×3 grid of clickable cells.
3. Contains an element with class `btn-back` linking to `index.html`.
4. Contains elements with classes `.game-container`, `.game-header`, `.game-title`.
5. `tictactoe.js` defines an `init()` function callable on `DOMContentLoaded`.
6. Players alternate between X and O on cell click.
7. Win condition is detected for all rows, columns, and both diagonals.
8. Draw condition is detected when all cells are filled with no winner.
9. A reset button clears the board and restarts the game.
10. Does **not** redefine `.game-card` class.

### Definition of Done
- Both files committed and syntactically valid.
- Game is playable end-to-end: place marks → detect win/draw → display result → reset.
- `init()` is the sole entry point.
- Win/draw states are visually indicated to the player.
- Back button navigates to `index.html`.

### Dependencies
- **TICKET-001** — `styles.css` must define `.game-container`, `.game-header`, `.game-title`, `.btn-back`.

---

## TICKET-005: Memory Match Game (`memory.html` + `memory.js`)

**Type:** Implementation  
**Owner:** Worker B  
**Priority:** P1 — Core game

### Scope Boundaries
- **In Scope:** Create `memory.html` with a `<div id="card-grid">` containing a 4×4 grid (8 pairs). Link `styles.css` and `memory.js`. Include `.btn-back` link to `index.html`. Include `.game-header` with `.game-title`. Create `memory.js` with an `init()` function. Implement card flip animation (CSS class toggle), match detection for two flipped cards, mismatched card flip-back, matched card persistence, and a move counter.
- **Out of Scope:** Card images (use symbols/emoji/letters). Timer. Persistent best scores. Any redefinition of `.game-card`.

### Acceptance Criteria
1. `memory.html` exists, is valid HTML5, links `styles.css` and `memory.js`.
2. Contains `<div id="card-grid">` with a 4×4 grid (16 cards, 8 matching pairs).
3. Contains an element with class `btn-back` linking to `index.html`.
4. Contains elements with classes `.game-container`, `.game-header`, `.game-title`.
5. `memory.js` defines an `init()` function callable on `DOMContentLoaded`.
6. Clicking a card flips it face-up (CSS class toggle).
7. When two cards are flipped, they are compared for a match.
8. Matched pairs remain face-up; unmatched pairs flip back after a brief delay.
9. A move counter increments each time two cards are compared.
10. Game detects completion when all pairs are matched.
11. Does **not** redefine `.game-card` class.

### Definition of Done
- Both files committed and syntactically valid.
- Game is playable end-to-end: flip → compare → match/mismatch → complete.
- `init()` is the sole entry point.
- Move counter is visible and accurate.
- All 8 pairs can be successfully matched.
- Back button navigates to `index.html`.

### Dependencies
- **TICKET-001** — `styles.css` must define `.game-container`, `.game-header`, `.game-title`, `.btn-back`.

---

## TICKET-006: Validation Script (`validate_site.js`)

**Type:** Implementation  
**Owner:** Utility  
**Priority:** P0 — Quality gate

### Scope Boundaries
- **In Scope:** Create a Node.js CLI script `validate_site.js` runnable via `node validate_site.js`. Check: (1) all required files exist, (2) JS files have valid syntax, (3) HTML files link their expected CSS and JS files, (4) required DOM IDs are present (`game-canvas`, `board`, `card-grid`), (5) required CSS classes are defined in `styles.css` (`.game-container`, `.game-header`, `.btn-back`, `.game-title`, `.game-card`), (6) each game JS file exposes an `init` function. Write results to `site_validation_output.txt`.
- **Out of Scope:** Runtime browser testing. Performance benchmarking. Accessibility auditing. Auto-fixing errors.

### Acceptance Criteria
1. `validate_site.js` exists and runs via `node validate_site.js` with exit code 0 on success, non-zero on failure.
2. Checks file existence for all 9 project files: `index.html`, `styles.css`, `game-select.js`, `snake.html`, `snake.js`, `tictactoe.html`, `tictactoe.js`, `memory.html`, `memory.js`.
3. Validates JS syntax of `game-select.js`, `snake.js`, `tictactoe.js`, `memory.js` using `--check` or AST parsing.
4. Verifies `index.html` links `styles.css` and `game-select.js`.
5. Verifies each game HTML links `styles.css` and its respective JS file.
6. Verifies `snake.html` contains `id="game-canvas"`, `tictactoe.html` contains `id="board"`, `memory.html` contains `id="card-grid"`.
7. Verifies `styles.css` defines all five required classes.
8. Verifies `snake.js`, `tictactoe.js`, `memory.js` each define an `init` function/export.
9. Writes all check results (pass/fail per check) to `site_validation_output.txt`.
10. Outputs zero errors when all checks pass.

### Definition of Done
- Script committed and executable with Node.js >= 18.
- Running against a correctly built project produces `site_validation_output.txt` with zero errors.
- Running against a project with intentional defects correctly reports each defect.
- Script does not require any npm packages.

### Dependencies
- **TICKET-002** — `index.html`, `game-select.js` must exist for validation.
- **TICKET-003** — `snake.html`, `snake.js` must exist for validation.
- **TICKET-004** — `tictactoe.html`, `tictactoe.js` must exist for validation.
- **TICKET-005** — `memory.html`, `memory.js` must exist for validation.
- **TICKET-001** — `styles.css` must exist for validation.

---

## TICKET-007: Project Documentation (`README.md`, `docs/architecture.md`, `docs/deployment_checklist.md`)

**Type:** Documentation  
**Owner:** Cross-team  
**Priority:** P2 — Final deliverable

### Scope Boundaries
- **In Scope:** Create `README.md` with project overview, how to run locally (open `index.html`), and how to run validation (`node validate_site.js`). Create `docs/architecture.md` documenting the component decomposition, dataflow, and cross-worker contracts. Create `docs/deployment_checklist.md` with steps to verify the static site is deployable (file integrity, validation pass, browser smoke test).
- **Out of Scope:** API documentation. Contribution guidelines. CI/CD pipeline configuration. Hosting provider specifics.

### Acceptance Criteria
1. `README.md` exists at project root with: project name, brief description, "How to Run" section, "Validation" section, and tech stack summary.
2. `docs/architecture.md` exists and documents: component decomposition (Worker A/B/Utility), navigation dataflow, game state dataflow, and cross-worker DOM contracts.
3. `docs/deployment_checklist.md` exists and lists: validation script pass, all files present, manual browser smoke test steps for each game.
4. All documentation is in valid Markdown.

### Definition of Done
- All three documentation files committed.
- README instructions are reproducible — a new developer can run the project and validation by following the README.
- Architecture doc matches the actual implemented architecture.
- Deployment checklist is actionable and complete.

### Dependencies
- **TICKET-006** — Validation script must be finalized so documentation accurately references it.
- **TICKET-002** through **TICKET-005** — Implementation must be complete so architecture doc reflects reality.

---

## TICKET-008: Line Budget & Cross-Worker Contract Audit

**Type:** Quality Assurance  
**Owner:** Tech Lead  
**Priority:** P0 — Must pass before release

### Scope Boundaries
- **In Scope:** Audit all committed files to verify: (1) total line count across all files is under 500, (2) Worker B files do not redefine `.game-card`, (3) all cross-worker DOM contracts are satisfied, (4) no npm packages or framework imports exist, (5) each game JS file exposes only `init()` as the public API.
- **Out of Scope:** Code style enforcement. Performance optimization. Feature additions.

### Acceptance Criteria
1. Total line count across all `.html`, `.css`, `.js` files is < 500.
2. `grep -r "\.game-card" snake.html tictactoe.html memory.html snake.js tictactoe.js memory.js` returns zero results (no redefinition).
3. All required DOM IDs (`game-canvas`, `board`, `card-grid`) are present in their respective HTML files.
4. All required CSS classes (`.game-container`, `.game-header`, `.btn-back`, `.game-title`, `.game-card`) are defined in `styles.css` only.
5. No `import` or `require` statements exist in browser JS files.
6. Each game JS file has exactly one `init` function as the public entry point.
7. `node validate_site.js` exits with code 0 and `site_validation_output.txt` shows zero errors.

### Definition of Done
- All seven acceptance criteria pass.
- Audit results are documented in `workflow_review.md`.
- Any failures result in tickets filed back to the responsible worker.

### Dependencies
- **TICKET-001** through **TICKET-006** — All implementation and validation must be complete.

---

## Dependency Graph

```
TICKET-001 (styles.css)
  ├── TICKET-002 (index.html + game-select.js)
  ├── TICKET-003 (snake.html + snake.js)
  ├── TICKET-004 (tictactoe.html + tictactoe.js)
  └── TICKET-005 (memory.html + memory.js)

TICKET-002 ─┐
TICKET-003 ─┤
TICKET-004 ─┼── TICKET-006 (validate_site.js)
TICKET-005 ─┘

TICKET-006 ────── TICKET-007 (documentation)
TICKET-002..005 ─ TICKET-007

TICKET-001..006 ─ TICKET-008 (audit)
```

## Execution Order

| Phase | Tickets | Rationale |
|-------|---------|-----------|
| 1 | TICKET-001 | Foundation — no other work can render correctly without shared styles |
| 2 | TICKET-002, TICKET-003, TICKET-004, TICKET-005 | Parallel — Worker A landing page + Worker B all three games |
| 3 | TICKET-006 | Validation requires all implementation files to exist |
| 4 | TICKET-007 | Documentation reflects final implementation |
| 5 | TICKET-008 | Final quality gate before release |
