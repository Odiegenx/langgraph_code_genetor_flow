# Browser Games Hub — Ticket Backlog

---

## TICKET-001: Project Scaffolding and Directory Structure

**Owner:** Worker A  
**Priority:** P0 — Blocker

### Scope Boundaries
- Create the `browser-games/` root directory and all subdirectories (`docs/`)
- Create empty stub files for every file listed in the component decomposition
- Do NOT implement any logic or content; only file existence and directory layout

### Acceptance Criteria
1. `browser-games/` directory exists
2. `browser-games/docs/` directory exists
3. All 12 files from the component decomposition exist as zero-byte stubs:
   `index.html`, `styles.css`, `snake.html`, `snake.js`, `tictactoe.html`, `tictactoe.js`, `memory.html`, `memory.js`, `validate_site.js`, `README.md`, `docs/architecture.md`, `docs/deployment_checklist.md`

### Definition of Done
- Directory tree matches the architecture document exactly
- No extra files or directories present
- All stub files are readable (zero-byte is acceptable)

### Dependencies
- None — this is the foundational ticket

---

## TICKET-002: Shared Stylesheet (`styles.css`)

**Owner:** Worker A  
**Priority:** P0 — Blocker

### Scope Boundaries
- Define global design tokens: font families, colour palette (primary, secondary, accent, backgrounds, text), spacing scale, border-radius values
- Provide card-layout styles for the start page (game-selection cards)
- Provide game-page layout utilities: canvas centering for Snake, grid layout for Tic Tac Toe, card-flip transition for Memory Match
- Provide button styles (shared reset/restart button look)
- Provide page-level layout (header, main content area, footer if any)
- Do NOT include game-specific logic or game-specific IDs beyond layout hooks
- Do NOT reference any external fonts or CDN resources

### Acceptance Criteria
1. File contains CSS custom properties or defined tokens for colours, fonts, and spacing
2. Card-layout styles exist and are usable by `index.html` game-selection cards
3. Canvas centering rule exists (e.g., a class or rule targeting a canvas container)
4. Grid layout rule exists for 3×3 and 4×4 board containers
5. Card-flip CSS transition/transform rule exists for Memory Match cards
6. Button styles are defined and reusable
7. No `@import` or `url()` referencing external resources
8. File is valid CSS (parseable by browsers)

### Definition of Done
- All acceptance criteria met
- File is linked and renders correctly when viewed with any HTML page in the project
- No external network requests triggered by this stylesheet

### Dependencies
- TICKET-001 (scaffolding must exist)

---

## TICKET-003: Start Page (`index.html`)

**Owner:** Worker A  
**Priority:** P0 — Blocker

### Scope Boundaries
- Render a project title and brief description
- Render three game-selection cards: Snake, Tic Tac Toe, Memory Match
- Each card is an `<a>` element linking to `snake.html`, `tictactoe.html`, `memory.html` respectively
- Reference `styles.css` via `<link rel="stylesheet" href="styles.css">`
- Do NOT include any `<script>` tags
- Do NOT inline game logic or game previews

### Acceptance Criteria
1. Page contains a visible project title (e.g., `<h1>` or equivalent)
2. Page contains a brief description of the project
3. Three anchor elements exist, each linking to one of: `snake.html`, `tictactoe.html`, `memory.html`
4. Each anchor/card is visually distinguishable and displays the game name
5. `<link rel="stylesheet" href="styles.css">` is present in `<head>`
6. No `<script>` tags in the file
7. No external resource references (CDN, fonts, images)
8. Page is valid HTML5 and openable via `file://` protocol

### Definition of Done
- All acceptance criteria met
- Clicking each card navigates to the correct game HTML page
- Page renders with shared styles applied
- No console errors when opened in browser

### Dependencies
- TICKET-001 (scaffolding)
- TICKET-002 (styles.css must exist for visual correctness, though link will work with missing file)

---

## TICKET-004: Validation Script (`validate_site.js`)

**Owner:** Worker A  
**Priority:** P1 — High

### Scope Boundaries
- Node.js v18+ script using only built-in modules: `fs`, `path`, `vm`
- Check all 7 categories defined in architecture §2.6:
  1. All required files exist
  2. JS syntax validity via `vm.createScript`
  3. `index.html` links to `snake.html`, `tictactoe.html`, `memory.html`
  4. Each game HTML contains `<script src="…">` for its JS and `<link … href="styles.css">`
  5. `snake.html` contains `<canvas id="snake-canvas">`
  6. `tictactoe.html` contains `id="ttt-board"` and `id="ttt-reset"`
  7. `memory.html` contains `id="memory-board"` and `id="memory-reset"`
- Write pass/fail per check to `site_validation_output.txt`
- Use relative paths only (no `project_dir` prefix)
- Do NOT attempt to start a server or open a browser
- Do NOT install or require any npm packages

### Acceptance Criteria
1. Script runs with `node validate_site.js` without errors
2. Each of the 7 check categories produces a pass or fail line in output
3. Output file `site_validation_output.txt` is created/overwritten in the working directory
4. All file paths in the script are relative (no absolute paths, no `browser-games/` prefix if run from inside that directory, or consistently use `browser-games/` if run from parent — documented clearly)
5. Only `fs`, `path`, `vm` are imported
6. `vm.createScript` is used for JS syntax validation of `snake.js`, `tictactoe.js`, `memory.js`
7. HTML checks use string matching on file contents (not DOM parsing)
8. Script exits with code 0 on completion

### Definition of Done
- All acceptance criteria met
- Running the script against a fully implemented project produces all passes
- Running the script against a project with intentional defects correctly reports failures
- Output file format is human-readable

### Dependencies
- TICKET-001 (scaffolding)
- TICKET-003 (index.html must exist for link checks)
- TICKET-005 through TICKET-010 (game files must exist for full pass, but script should handle missing files gracefully with fail results)

---

## TICKET-005: Snake Game HTML Shell (`snake.html`)

**Owner:** Worker B  
**Priority:** P0 — Blocker

### Scope Boundaries
- Create the HTML page for Snake with a `<canvas>` element
- Canvas must have `id="snake-canvas"`
- Include `<script src="snake.js"></script>` before closing `</body>`
- Include `<link rel="stylesheet" href="styles.css">` in `<head>`
- Provide a DOM element for score display (e.g., `<span id="snake-score">` or similar)
- Provide a game-over overlay or container (can be populated by JS)
- Do NOT inline game logic; all logic lives in `snake.js`
- Do NOT reference external resources

### Acceptance Criteria
1. `<canvas id="snake-canvas">` exists in the page
2. `<script src="snake.js"></script>` is present
3. `<link rel="stylesheet" href="styles.css">` is present in `<head>`
4. A score display element exists in the DOM
5. A game-over display element or container exists in the DOM
6. Page is valid HTML5 and openable via `file://`
7. No external resource references

### Definition of Done
- All acceptance criteria met
- Page loads without console errors (even if `snake.js` is a stub)
- Canvas element is visible and centered per `styles.css` layout rules

### Dependencies
- TICKET-001 (scaffolding)
- TICKET-002 (styles.css for layout, though page will load without it)

---

## TICKET-006: Snake Game Logic (`snake.js`)

**Owner:** Worker B  
**Priority:** P0 — Blocker

### Scope Boundaries
- Implement full Snake game on a 20×20 grid rendered to `#snake-canvas`
- Snake body stored as array of `{x, y}` segments
- Food spawns at random unoccupied cell
- Arrow key input via `keydown`; direction queue prevents 180° reversal
- Game loop via `setInterval` or `requestAnimationFrame` at fixed tick rate
- Collision detection: wall boundaries and self-intersection
- Scoring: +1 per food eaten; update DOM score display
- Game over: display overlay/message with restart option
- Restart: reset all state and re-render
- Do NOT use `localStorage`, sound, or network requests
- Do NOT modify any HTML or CSS files

### Acceptance Criteria
1. Snake renders on a 20×20 grid within `#snake-canvas`
2. Arrow keys change direction; 180° reversal is prevented
3. Snake moves one cell per tick at a consistent speed
4. Food appears at a random cell not occupied by the snake
5. Eating food grows the snake by one segment and increments score by 1
6. Score is displayed and updated in the DOM
7. Wall collision and self-collision trigger game over
8. Game-over state is visually indicated (overlay or message)
9. Restart option resets snake, score, food, and direction to initial state
10. No `localStorage`, sound, or external requests used

### Definition of Done
- All acceptance criteria met
- Game is playable from start to game-over to restart without page reload
- No console errors during normal gameplay
- Canvas renders correctly at the expected size

### Dependencies
- TICKET-005 (snake.html must provide canvas and DOM elements)

---

## TICKET-007: Tic Tac Toe HTML Shell (`tictactoe.html`)

**Owner:** Worker B  
**Priority:** P0 — Blocker

### Scope Boundaries
- Create the HTML page for Tic Tac Toe
- Board container must have `id="ttt-board"`
- Reset button must have `id="ttt-reset"`
- Include `<script src="tictactoe.js"></script>` before closing `</body>`
- Include `<link rel="stylesheet" href="styles.css">` in `<head>`
- Provide a DOM element for current-turn display
- Provide a DOM element for result message (win/draw)
- Board cells may be created in HTML or dynamically by JS
- Do NOT inline game logic
- Do NOT reference external resources

### Acceptance Criteria
1. An element with `id="ttt-board"` exists
2. A button with `id="ttt-reset"` exists
3. `<script src="tictactoe.js"></script>` is present
4. `<link rel="stylesheet" href="styles.css">` is present in `<head>`
5. A turn-display element exists in the DOM
6. A result-message element exists in the DOM
7. Page is valid HTML5 and openable via `file://`
8. No external resource references

### Definition of Done
- All acceptance criteria met
- Page loads without console errors
- Board container is styled as a grid per `styles.css`

### Dependencies
- TICKET-001 (scaffolding)
- TICKET-002 (styles.css for layout)

---

## TICKET-008: Tic Tac Toe Game Logic (`tictactoe.js`)

**Owner:** Worker B  
**Priority:** P0 — Blocker

### Scope Boundaries
- Implement two-player local Tic Tac Toe on a 3×3 grid inside `#ttt-board`
- Alternate turns between X and O; display current player in DOM
- Win detection: check all 8 lines (3 rows, 3 columns, 2 diagonals) after each move
- Draw detection: 9 moves with no winner
- Display win/draw message in DOM
- Reset via `#ttt-reset`: clear board state and UI
- Do NOT use AI opponents, `localStorage`, sound, or network requests
- Do NOT modify any HTML or CSS files

### Acceptance Criteria
1. 9 clickable cells render inside `#ttt-board` (created by JS or present in HTML)
2. Clicking an empty cell places the current player's mark (X or O)
3. Turns alternate correctly after each valid move
4. Current player is displayed in the DOM
5. Win is detected for all 8 possible lines and displayed as a message
6. Draw is detected when all 9 cells are filled with no winner and displayed
7. Clicking on an already-filled cell does nothing
8. Clicking `#ttt-reset` clears all marks, resets turn to X, and clears result message
9. No `localStorage`, sound, or external requests used

### Definition of Done
- All acceptance criteria met
- Game is playable for multiple rounds without page reload
- No console errors during play
- All win conditions and draw condition are correctly detected

### Dependencies
- TICKET-007 (tictactoe.html must provide board and button elements)

---

## TICKET-009: Memory Match HTML Shell (`memory.html`)

**Owner:** Worker B  
**Priority:** P0 — Blocker

### Scope Boundaries
- Create the HTML page for Memory Match
- Board container must have `id="memory-board"`
- Reset button must have `id="memory-reset"`
- Include `<script src="memory.js"></script>` before closing `</body>`
- Include `<link rel="stylesheet" href="styles.css">` in `<head>`
- Provide a DOM element for move counter display
- Provide a DOM element for win message
- Card elements may be created in HTML or dynamically by JS
- Do NOT inline game logic
- Do NOT reference external resources

### Acceptance Criteria
1. An element with `id="memory-board"` exists
2. A button with `id="memory-reset"` exists
3. `<script src="memory.js"></script>` is present
4. `<link rel="stylesheet" href="styles.css">` is present in `<head>`
5. A move-counter display element exists in the DOM
6. A win-message display element exists in the DOM
7. Page is valid HTML5 and openable via `file://`
8. No external resource references

### Definition of Done
- All acceptance criteria met
- Page loads without console errors
- Board container is styled as a 4×4 grid per `styles.css`

### Dependencies
- TICKET-001 (scaffolding)
- TICKET-002 (styles.css for layout and card-flip transitions)

---

## TICKET-010: Memory Match Game Logic (`memory.js`)

**Owner:** Worker B  
**Priority:** P0 — Blocker

### Scope Boundaries
- Implement Memory Match on a 4×4 grid (16 cards, 8 symbol pairs) inside `#memory-board`
- Shuffle card positions each game
- Click reveals a card; maximum 2 cards revealed at once
- Match: two revealed cards with the same symbol stay face-up
- Mismatch: both cards flip back face-down after 1-second `setTimeout`
- Move counter: incremented each time a pair is checked; displayed in DOM
- Win condition: all 8 pairs revealed → display win message
- Reset via `#memory-reset`: re-shuffle, reset state and UI
- Do NOT use `localStorage`, sound, or network requests
- Do NOT modify any HTML or CSS files

### Acceptance Criteria
1. 16 cards render inside `#memory-board` in a 4×4 layout
2. Cards are shuffled at game start (order differs between resets)
3. Clicking a face-down card reveals its symbol
4. A maximum of 2 cards can be revealed simultaneously; further clicks are ignored during the check period
5. Matching pairs remain face-up permanently
6. Non-matching pairs flip back after approximately 1 second
7. Move counter increments by 1 each time a pair is evaluated and is displayed in the DOM
8. When all 8 pairs are face-up, a win message is displayed
9. Clicking `#memory-reset` re-shuffles all cards, resets the move counter, and flips all cards face-down
10. No `localStorage`, sound, or external requests used

### Definition of Done
- All acceptance criteria met
- Game is playable for multiple rounds without page reload
- No console errors during play
- Card-flip transitions work as defined in `styles.css`

### Dependencies
- TICKET-009 (memory.html must provide board and button elements)

---

## TICKET-011: README Documentation (`README.md`)

**Owner:** Worker A  
**Priority:** P2 — Medium

### Scope Boundaries
- Project title and description
- List of included games with one-line descriptions
- How to run: open `index.html` in a browser
- How to validate: run `node validate_site.js`
- File structure overview
- Brief note on ownership/workers (optional)
- Do NOT include installation steps for npm packages (there are none)
- Do NOT include deployment instructions (covered in deployment checklist)

### Acceptance Criteria
1. README contains a project title
2. README lists all three games
3. README explains how to open the site in a browser
4. README explains how to run the validation script
5. README shows the file/directory structure
6. File is valid Markdown

### Definition of Done
- All acceptance criteria met
- A new developer can read the README and understand what the project is and how to run it

### Dependencies
- TICKET-001 (scaffolding)
- TICKET-004 (validation script, for accurate instructions)

---

## TICKET-012: Architecture Document (`docs/architecture.md`)

**Owner:** Worker A  
**Priority:** P2 — Medium

### Scope Boundaries
- Document the component decomposition and file listing
- Document ownership boundaries (Worker A vs Worker B)
- Document each component's responsibilities (start page, stylesheet, each game, validation)
- Document dataflow diagrams (text-based) for each game and validation
- Document constraints (dependencies, browser, element IDs, scope limits)
- This document should reflect the final implemented architecture
- Do NOT include implementation code snippets

### Acceptance Criteria
1. Architecture document contains a component decomposition section matching the project structure
2. Ownership boundaries are clearly documented
3. Each component's responsibilities are described
4. Dataflow for Snake, Tic Tac Toe, Memory Match, and validation are documented
5. All constraints from the project are listed
6. File is valid Markdown

### Definition of Done
- All acceptance criteria met
- Document accurately reflects the as-built project structure and behavior

### Dependencies
- TICKET-001 (scaffolding)
- TICKET-005 through TICKET-010 (game implementations, for accurate behavioral documentation)

---

## TICKET-013: Deployment Checklist (`docs/deployment_checklist.md`)

**Owner:** Worker A  
**Priority:** P2 — Medium

### Scope Boundaries
- Pre-deployment checks: all files present, validation script passes
- Browser compatibility note (vanilla HTML/CSS/JS, `file://` compatible)
- Steps to serve statically (any static file server)
- No build step required (confirm)
- No external dependencies required (confirm)
- Do NOT include CI/CD pipeline configurations
- Do NOT include cloud-specific deployment instructions

### Acceptance Criteria
1. Checklist includes a step to verify all required files exist
2. Checklist includes a step to run `node validate_site.js` and confirm all checks pass
3. Checklist confirms no build step is needed
4. Checklist confirms no external dependencies
5. Checklist includes instructions for serving via a static file server
6. File is valid Markdown

### Definition of Done
- All acceptance criteria met
- Following the checklist on a fresh copy of the project results in a working deployment

### Dependencies
- TICKET-001 (scaffolding)
- TICKET-004 (validation script)
- TICKET-012 (architecture document, for consistency)

---

## Dependency Graph

```
TICKET-001 (Scaffolding)
  ├── TICKET-002 (styles.css)
  │     ├── TICKET-003 (index.html)
  │     ├── TICKET-005 (snake.html)
  │     ├── TICKET-007 (tictactoe.html)
  │     └── TICKET-009 (memory.html)
  ├── TICKET-005 (snake.html) ──▶ TICKET-006 (snake.js)
  ├── TICKET-007 (tictactoe.html) ──▶ TICKET-008 (tictactoe.js)
  ├── TICKET-009 (memory.html) ──▶ TICKET-010 (memory.js)
  ├── TICKET-004 (validate_site.js)
  ├── TICKET-011 (README.md)
  ├── TICKET-012 (architecture.md)
  └── TICKET-013 (deployment_checklist.md)
```

---

## Execution Order Recommendation

| Wave | Tickets | Rationale |
|------|---------|-----------|
| **1** | TICKET-001 | Foundation; everything depends on scaffolding |
| **2** | TICKET-002, TICKET-005, TICKET-007, TICKET-009 | Stylesheet and all HTML shells can be built in parallel (Worker A does CSS, Worker B does all HTML shells) |
| **3** | TICKET-003, TICKET-006, TICKET-008, TICKET-010 | Start page (Worker A) and all game JS files (Worker B) can be built in parallel |
| **4** | TICKET-004 | Validation script depends on all files existing for meaningful pass results |
| **5** | TICKET-011, TICKET-012, TICKET-013 | Documentation can be written once implementation is stable |
