# Browser Games Hub — Ticket Backlog

---

## TICKET-001: Project Scaffolding & Package Configuration

**Scope:** Initialize the `browser-games/` directory structure and `package.json` with the correct metadata and devDependency.

**Scope Boundaries:**
- IN: Creating the directory tree, `package.json`, and `docs/` directory
- OUT: Any file content beyond `package.json`; no game code, no CSS, no HTML

**Acceptance Criteria:**
- AC-1: `browser-games/` directory exists with subdirectories `docs/`
- AC-2: `package.json` exists with project name `browser-games`
- AC-3: `package.json` lists `puppeteer` ^22.0.0 as a devDependency
- AC-4: `package.json` contains a `validate` script that runs `node validate_site.js`
- AC-5: Running `npm install` in `browser-games/` completes without error

**Definition of Done:**
- Directory structure matches the file tree in architecture.md
- `package.json` is valid JSON and installable
- `node_modules/` is gitignored

**Dependencies:** None (foundation ticket)

---

## TICKET-002: Shared Retro/Arcade Theme (`styles.css`)

**Scope:** Create the shared stylesheet that defines the cohesive retro/arcade visual language consumed by all four HTML pages.

**Scope Boundaries:**
- IN: Color palette, typography (monospace/pixel-style), button styles, card styles, link styles, layout primitives (centering, grid/flex containers), heading styles, body defaults
- OUT: Game-specific styles (canvas sizing, grid layouts for tic-tac-toe board, memory card grid, snake canvas wrapper)

**Acceptance Criteria:**
- AC-1: `styles.css` defines CSS custom properties for at least: primary color, secondary color, background color, text color, accent color
- AC-2: Body defaults set: background color, text color, font-family (monospace or retro-style stack)
- AC-3: Button styles defined: padding, border, background, hover state, cursor pointer
- AC-4: Card/link styles defined for the index page game-selection cards
- AC-5: Layout primitives exist: `.container` or equivalent centering class
- AC-6: Heading styles (`h1`, `h2`, etc.) are styled consistently with the retro theme
- AC-7: Link styles override defaults to match the theme palette
- AC-8: No external font CDN references (per constraint)

**Definition of Done:**
- `styles.css` is loadable by all pages without errors
- Visual theme is cohesive and retro/arcade in feel
- No game-specific selectors leak into this file

**Dependencies:** TICKET-001 (directory must exist)

---

## TICKET-003: Start Page (`index.html`)

**Scope:** Create the landing page that presents three game cards linking to each game.

**Scope Boundaries:**
- IN: `index.html` with `<h1>` heading, three `<a>` elements linking to game pages, `<link>` to `styles.css`
- OUT: Any game logic, any JavaScript, game-specific CSS

**Acceptance Criteria:**
- AC-1: Page loads without JavaScript errors (verifiable by Puppeteer `pageerror` listener)
- AC-2: Contains exactly one `<h1>` element with a descriptive heading (e.g., "Browser Games Hub")
- AC-3: Contains three `<a>` elements with `href` values: `snake.html`, `tic-tac-toe.html`, `memory.html`
- AC-4: Links to `styles.css` via `<link rel="stylesheet" href="styles.css">`
- AC-5: Uses semantic HTML5 elements (`<main>`, `<nav>`, `<section>`, etc.)
- AC-6: No `<script>` tags present
- AC-7: No inline styles or game-specific CSS references
- AC-8: Each link/card has descriptive text identifying the game

**Definition of Done:**
- `index.html` is valid HTML5
- All three game links are navigable
- Page renders with the shared retro theme
- Puppeteer validation passes for AC-02a through AC-02d

**Dependencies:** TICKET-002 (needs `styles.css`)

---

## TICKET-004: Snake Game — HTML Structure (`snake.html`)

**Scope:** Create the Snake game HTML page with all required DOM elements and resource links.

**Scope Boundaries:**
- IN: `snake.html` with canvas, controls, score displays, home link, stylesheet links, script reference
- OUT: Game logic (belongs in `snake.js`), visual styling beyond structural HTML (belongs in `snake.css`)

**Acceptance Criteria:**
- AC-1: Contains `<canvas id="snake-canvas">` element
- AC-2: Contains `<button id="start-btn">` element
- AC-3: Contains an element with `id="score-display"`
- AC-4: Contains an element with `id="high-score"`
- AC-5: Contains a home link: `<a href="index.html">Home</a>`
- AC-6: Links `styles.css` via `<link rel="stylesheet" href="styles.css">`
- AC-7: Links `snake.css` via `<link rel="stylesheet" href="snake.css">`
- AC-8: Includes `<script src="snake.js"></script>` at end of body
- AC-9: Uses semantic HTML5 elements
- AC-10: Page loads without JavaScript errors (before game logic is interacted with)

**Definition of Done:**
- `snake.html` is valid HTML5
- All required IDs and elements are present and queryable by Puppeteer
- No inline scripts

**Dependencies:** TICKET-001 (directory), TICKET-002 (shared theme reference)

---

## TICKET-005: Snake Game — Styling (`snake.css`)

**Scope:** Create Snake-specific styles that layer on top of the shared theme.

**Scope Boundaries:**
- IN: Canvas container sizing, score/high-score layout, button positioning, game-over overlay styles, page-specific layout
- OUT: Shared theme styles (in `styles.css`), game logic

**Acceptance Criteria:**
- AC-1: `#snake-canvas` has defined dimensions (width/height) or a responsive container
- AC-2: `#score-display` and `#high-score` are visually distinct and readable
- AC-3: `#start-btn` is clearly styled as a call-to-action button
- AC-4: Game layout is centered and visually consistent with the retro theme
- AC-5: No `!important` overrides of shared theme properties (use specificity naturally)
- AC-6: No external CDN references

**Definition of Done:**
- Snake page renders with cohesive retro theme
- Canvas is visible and appropriately sized
- Score displays are legible

**Dependencies:** TICKET-002 (shared theme), TICKET-004 (HTML structure)

---

## TICKET-006: Snake Game — Logic (`snake.js`)

**Scope:** Implement the fully playable Snake game with arrow key controls, scoring, and localStorage high score persistence.

**Scope Boundaries:**
- IN: Game loop (requestAnimationFrame/setInterval), snake movement, food spawning, collision detection (wall + self), score tracking, high score persistence via `localStorage.snakeHighScore`, start/restart via `#start-btn`, arrow key input handling with 180° reversal prevention
- OUT: Touch/mouse controls, sound effects, difficulty settings, responsive layout adjustments

**Acceptance Criteria:**
- AC-1: Clicking `#start-btn` starts the game loop
- AC-2: Arrow keys control snake direction (up/down/left/right)
- AC-3: Snake cannot reverse 180° (e.g., going right cannot immediately go left)
- AC-4: Snake grows when consuming food; score increments by 1 per food
- AC-5: `#score-display` updates in real-time as score changes
- AC-6: Wall collision and self-collision trigger game over state
- AC-7: On game over, score is compared to `localStorage.snakeHighScore`; if higher, localStorage is updated
- AC-8: `#high-score` displays the persisted high score on page load
- AC-9: Clicking `#start-btn` after game over restarts the game
- AC-10: No diagonal movement is possible
- AC-11: No external dependencies or CDN references
- AC-12: All code is in `snake.js` (no inline scripts)

**Definition of Done:**
- Snake game is fully playable from start to game over
- High score persists across page reloads
- Arrow key controls are responsive and correct
- Puppeteer validation passes for AC-03a through AC-03g

**Dependencies:** TICKET-004 (HTML), TICKET-005 (CSS)

---

## TICKET-007: Tic Tac Toe — HTML Structure (`tic-tac-toe.html`)

**Scope:** Create the Tic Tac Toe game HTML page with all required DOM elements.

**Scope Boundaries:**
- IN: `tic-tac-toe.html` with 9 `.cell` elements, status display, restart button, home link, stylesheet links, script reference
- OUT: AI logic (belongs in `tic-tac-toe.js`), game-specific styles (belongs in `tic-tac-toe.css`)

**Acceptance Criteria:**
- AC-1: Contains exactly 9 elements with class `cell` and `data-index` attributes (0–8)
- AC-2: Contains an element with `id="status"`
- AC-3: Contains `<button id="restart-btn">`
- AC-4: Contains a home link: `<a href="index.html">Home</a>`
- AC-5: Links `styles.css` via `<link rel="stylesheet" href="styles.css">`
- AC-6: Links `tic-tac-toe.css` via `<link rel="stylesheet" href="tic-tac-toe.css">`
- AC-7: Includes `<script src="tic-tac-toe.js"></script>` at end of body
- AC-8: Uses semantic HTML5 elements
- AC-9: Page loads without JavaScript errors

**Definition of Done:**
- `tic-tac-toe.html` is valid HTML5
- All 9 cells are queryable by Puppeteer with `.cell[data-index]`
- No inline scripts

**Dependencies:** TICKET-001 (directory), TICKET-002 (shared theme reference)

---

## TICKET-008: Tic Tac Toe — Styling (`tic-tac-toe.css`)

**Scope:** Create Tic Tac Toe-specific styles for the 3×3 grid and game UI.

**Scope Boundaries:**
- IN: 3×3 grid layout for `.cell` elements, X/O mark styling, status text styling, restart button positioning, win-line highlight (optional), page-specific layout
- OUT: Shared theme styles, AI logic

**Acceptance Criteria:**
- AC-1: `.cell` elements are arranged in a 3×3 grid (CSS Grid or Flexbox)
- AC-2: Each cell has visible borders or spacing to delineate the board
- AC-3: X and O marks are visually distinct (color, weight, or style)
- AC-4: `#status` text is prominently displayed
- AC-5: `#restart-btn` is accessible and themed
- AC-6: No external CDN references

**Definition of Done:**
- Tic Tac Toe page renders as a clear 3×3 board
- X and O are visually distinguishable
- Layout is consistent with the retro theme

**Dependencies:** TICKET-002 (shared theme), TICKET-007 (HTML structure)

---

## TICKET-009: Tic Tac Toe — Logic & AI (`tic-tac-toe.js`)

**Scope:** Implement the Tic Tac Toe game with player-vs-AI gameplay using minimax algorithm for an unbeatable opponent.

**Scope Boundaries:**
- IN: Click handling on `.cell` elements, X placement for player, O placement for AI, win/draw detection, status text updates, restart functionality, minimax AI (or at minimum: take winning move, block opponent winning move, then optimal play)
- OUT: Two-player mode, difficulty settings, score persistence, animations

**Acceptance Criteria:**
- AC-1: Clicking an empty `.cell` places an "X" text/mark in that cell
- AC-2: After player places X, AI responds by placing "O" in an empty cell
- AC-3: AI takes an immediate winning move if available
- AC-4: AI blocks an immediate opponent winning move if no winning move exists
- AC-5: AI uses minimax for optimal play (unbeatable preferred)
- AC-6: `#status` updates to indicate whose turn it is, winner, or draw
- AC-7: Game prevents clicks on already-occupied cells
- AC-8: Game prevents clicks after a win or draw
- AC-9: Clicking `#restart-btn` clears the board and resets `#status`
- AC-10: No external dependencies or CDN references
- AC-11: All code is in `tic-tac-toe.js` (no inline scripts)

**Definition of Done:**
- Tic Tac Toe is fully playable: player places X, AI responds with O
- AI is unbeatable (minimax) or at minimum blocks wins and takes wins
- Puppeteer validation passes for AC-04a through AC-04h

**Dependencies:** TICKET-007 (HTML), TICKET-008 (CSS)

---

## TICKET-010: Memory Match — HTML Structure (`memory.html`)

**Scope:** Create the Memory Match game HTML page with all required DOM elements for 16 cards (8 pairs).

**Scope Boundaries:**
- IN: `memory.html` with 16 `.memory-card` elements each having a `data-card` attribute, move counter, restart button, home link, stylesheet links, script reference
- OUT: Card shuffle logic (belongs in `memory.js`), game-specific styles (belongs in `memory.css`)

**Acceptance Criteria:**
- AC-1: Contains at least 16 elements with class `memory-card`
- AC-2: Each `.memory-card` has a `data-card` attribute identifying its pair identity
- AC-3: Contains an element with `id="moves"`
- AC-4: Contains `<button id="restart-btn">`
- AC-5: Contains a home link: `<a href="index.html">Home</a>`
- AC-6: Links `styles.css` via `<link rel="stylesheet" href="styles.css">`
- AC-7: Links `memory.css` via `<link rel="stylesheet" href="memory.css">`
- AC-8: Includes `<script src="memory.js"></script>` at end of body
- AC-9: Uses semantic HTML5 elements
- AC-10: Page loads without JavaScript errors
- AC-11: Exactly 8 unique `data-card` values, each appearing exactly twice (8 pairs)

**Definition of Done:**
- `memory.html` is valid HTML5
- All 16 cards are queryable by Puppeteer with `.memory-card[data-card]`
- No inline scripts

**Dependencies:** TICKET-001 (directory), TICKET-002 (shared theme reference)

---

## TICKET-011: Memory Match — Styling (`memory.css`)

**Scope:** Create Memory Match-specific styles for the card grid and flip animation.

**Scope Boundaries:**
- IN: Card grid layout (4×4 or similar), `.memory-card` face-down/face-up styles, `.flipped` class styling, CSS transition for card flip effect, move counter styling, page-specific layout
- OUT: Shared theme styles, card shuffle/match logic

**Acceptance Criteria:**
- AC-1: `.memory-card` elements are arranged in a grid (4×4 recommended)
- AC-2: `.memory-card` has a default (face-down) visual state
- AC-3: `.memory-card.flipped` has a distinct (face-up) visual state showing the card identity
- AC-4: CSS transition is applied for the flip effect (transform or opacity)
- AC-5: `#moves` counter is clearly visible
- AC-6: `#restart-btn` is accessible and themed
- AC-7: No external CDN references

**Definition of Done:**
- Memory page renders as a clear 4×4 card grid
- Cards have visible face-down state
- `.flipped` class visually reveals card content
- Flip transition is smooth

**Dependencies:** TICKET-002 (shared theme), TICKET-010 (HTML structure)

---

## TICKET-012: Memory Match — Logic (`memory.js`)

**Scope:** Implement the Memory Match card game with pair matching, move counting, and restart functionality.

**Scope Boundaries:**
- IN: Click handling on `.memory-card` elements, `.flipped` class toggling, pair comparison via `data-card`, match/mismatch logic with 1s delay for mismatches, move counter increment, win state detection (all 16 flipped), restart/shuffle functionality
- OUT: Score persistence, timer, difficulty levels, sound effects

**Acceptance Criteria:**
- AC-1: Clicking a `.memory-card` adds the `.flipped` class to that card
- AC-2: Clicking a second `.memory-card` adds `.flipped` and increments `#moves` by 1
- AC-3: If two flipped cards have matching `data-card` values, they remain `.flipped` and are marked as matched
- AC-4: If two flipped cards do not match, after ~1 second delay, `.flipped` class is removed from both
- AC-5: Player cannot flip more than 2 cards at a time (clicks are locked during comparison)
- AC-6: Already-matched cards cannot be un-flipped
- AC-7: When all 16 cards have `.flipped` class, a win state message is displayed
- AC-8: Clicking `#restart-btn` shuffles card positions, removes all `.flipped` classes, and resets `#moves` to 0
- AC-9: No external dependencies or CDN references
- AC-10: All code is in `memory.js` (no inline scripts)

**Definition of Done:**
- Memory Match is fully playable: flip, match, mismatch, win
- Move counter accurately tracks pairs of flips
- Restart fully resets the game state
- Puppeteer validation passes for AC-05a through AC-05g

**Dependencies:** TICKET-010 (HTML), TICKET-011 (CSS)

---

## TICKET-013: Validation Script (`validate_site.js`)

**Scope:** Create the Puppeteer-based automated validation script that verifies all pages load correctly, contain required DOM elements, and exhibit expected interactive behavior.

**Scope Boundaries:**
- IN: Puppeteer launch and page navigation via `file://` protocol, `pageerror` listener for JS errors, DOM selector queries for all required IDs/classes, interactive tests (click cells, click cards, verify canvas/controls), result aggregation, writing `site_validation_output.txt`, auto-install of npm dependencies if `node_modules` missing, exit code 0/1
- OUT: Unit tests for game logic, performance testing, visual regression testing

**Acceptance Criteria:**
- AC-1: Script launches Puppeteer headless browser
- AC-2: Navigates to each page (`index.html`, `snake.html`, `tic-tac-toe.html`, `memory.html`) via `file://` protocol using `__dirname`-relative paths
- AC-3: Listens for `pageerror` events on each page and reports JS errors
- AC-4: Verifies `index.html` contains `<h1>`, three `<a>` links to game pages, and loads `styles.css`
- AC-5: Verifies `snake.html` contains `#snake-canvas`, `#start-btn`, `#score-display`, `#high-score`, home link, and loads both CSS files
- AC-6: Verifies `tic-tac-toe.html` contains 9 `.cell[data-index]` elements, `#status`, `#restart-btn`, home link, and loads both CSS files
- AC-7: Verifies `memory.html` contains at least 16 `.memory-card[data-card]` elements, `#moves`, `#restart-btn`, home link, and loads both CSS files
- AC-8: Tests interactive behavior: clicking a `.cell` places an X mark; AI responds with O; clicking a `.memory-card` adds `.flipped` class
- AC-9: Aggregates all pass/fail results and writes to `site_validation_output.txt`
- AC-10: Auto-installs npm dependencies if `node_modules/` is missing
- AC-11: Exits with code 0 if all checks pass, code 1 if any check fails
- AC-12: Uses `__dirname`-relative paths (no hardcoded absolute paths)

**Definition of Done:**
- `node validate_site.js` runs without crashing
- `site_validation_output.txt` is generated with clear pass/fail for each check
- Exit code is 0 when all pages pass, 1 when any fail
- Script handles missing `node_modules` gracefully by running `npm install`

**Dependencies:** TICKET-003 (index.html), TICKET-004 (snake.html), TICKET-006 (snake.js), TICKET-007 (tic-tac-toe.html), TICKET-009 (tic-tac-toe.js), TICKET-010 (memory.html), TICKET-012 (memory.js), TICKET-001 (package.json)

---

## TICKET-014: README & Project Documentation

**Scope:** Create `README.md`, `docs/architecture.md`, and `docs/deployment_checklist.md`.

**Scope Boundaries:**
- IN: Project overview, local run instructions, file structure description, game architecture overview, deployment steps for static hosting
- OUT: API documentation (no server), contribution guidelines, changelog

**Acceptance Criteria:**
- AC-1: `README.md` contains project title "Browser Games Hub" and a brief description
- AC-2: `README.md` contains instructions for local setup (`npm install`, open HTML files in browser)
- AC-3: `README.md` contains instructions for running validation (`node validate_site.js`)
- AC-4: `README.md` lists the three games and their controls
- AC-5: `docs/architecture.md` describes the file structure and game architecture
- AC-6: `docs/architecture.md` documents the dataflow for each game
- AC-7: `docs/deployment_checklist.md` lists steps for deploying to a static host (e.g., GitHub Pages, Netlify, S3)
- AC-8: `docs/deployment_checklist.md` includes a pre-deploy verification step (run validation script)
- AC-9: `docs/` directory exists and contains both files

**Definition of Done:**
- All three documentation files exist and are comprehensive
- A new developer could clone the repo, run `npm install`, open `index.html`, and play all three games
- Deployment steps are clear and actionable

**Dependencies:** TICKET-001 (directory structure), all game tickets (for accurate documentation)

---

## TICKET-015: End-to-End Integration Validation

**Scope:** Run the full validation suite, fix any integration issues, and confirm all acceptance criteria from the generation contract are met.

**Scope Boundaries:**
- IN: Running `node validate_site.js`, reviewing `site_validation_output.txt`, fixing any cross-page issues (broken links, missing selectors, theme inconsistencies), verifying localStorage high score persistence, verifying all navigation links work
- OUT: New features, performance optimization, accessibility improvements

**Acceptance Criteria:**
- AC-1: `node validate_site.js` completes with exit code 0
- AC-2: `site_validation_output.txt` shows all checks passing
- AC-3: All three game links on `index.html` navigate to correct pages
- AC-4: All three game pages have a home link back to `index.html`
- AC-5: Snake high score persists across page reloads (manual verification)
- AC-6: Tic Tac Toe AI is unbeatable (manual spot-check)
- AC-7: Memory Match win state triggers correctly (manual spot-check)
- AC-8: Shared theme is visually consistent across all four pages
- AC-9: No console errors on any page

**Definition of Done:**
- Validation script passes with exit code 0
- All manual spot-checks pass
- No integration issues remain
- Project is ready for deployment

**Dependencies:** TICKET-003, TICKET-004, TICKET-005, TICKET-006, TICKET-007, TICKET-008, TICKET-009, TICKET-010, TICKET-011, TICKET-012, TICKET-013, TICKET-014

---

## Dependency Graph

```
TICKET-001 (Scaffolding)
├── TICKET-002 (styles.css)
│   ├── TICKET-003 (index.html)
│   ├── TICKET-004 (snake.html) ──→ TICKET-005 (snake.css) ──→ TICKET-006 (snake.js)
│   ├── TICKET-007 (ttt.html) ──→ TICKET-008 (ttt.css) ──→ TICKET-009 (ttt.js)
│   └── TICKET-010 (memory.html) ──→ TICKET-011 (memory.css) ──→ TICKET-012 (memory.js)
├── TICKET-013 (validate_site.js) ← depends on all game tickets
├── TICKET-014 (Documentation) ← depends on all game tickets
└── TICKET-015 (Integration) ← depends on everything
```

## Priority Order

| Priority | Tickets | Rationale |
|----------|---------|-----------|
| P0 (Critical Path) | 001, 002, 003, 004, 007, 010 | Scaffolding, shared theme, and all HTML shells must exist first |
| P1 (Core Gameplay) | 005, 006, 008, 009, 011, 012 | CSS and JS for each game — makes games playable |
| P2 (Verification) | 013, 014 | Validation and documentation — confirms everything works |
| P3 (Hardening) | 015 | Integration testing and final polish |
