# Browser Games Hub — Architecture Document

## 1. Component Decomposition

The system is a static website composed of four pages and a local validation utility. Components are strictly separated by file ownership to support parallel generation by two workers.

| Component | Files | Owner |
|---|---|---|
| **Hub Page** | `index.html`, `css/main.css` | Worker A |
| **Snake Game** | `snake.html`, `js/snake.js` | Worker A |
| **Tic Tac Toe Game** | `tictactoe.html`, `css/tictactoe.css`, `js/tictactoe.js` | Worker B |
| **Memory Match Game** | `memory.html`, `css/memory.css`, `js/memory.js` | Worker B |
| **Validation Script** | `validate_site.js` | Shared/Scaffold |

### Directory Layout
```
browser-games/
├── index.html
├── snake.html
├── tictactoe.html
├── memory.html
├── css/
│   ├── main.css
│   ├── tictactoe.css
│   └── memory.css
├── js/
│   ├── snake.js
│   ├── tictactoe.js
│   └── memory.js
└── validate_site.js
```

---

## 2. Component Responsibilities

### Hub Page (`index.html` + `css/main.css`)
- Renders a navigation menu with three cards/links pointing to `snake.html`, `tictactoe.html`, and `memory.html`.
- `css/main.css` provides shared hub-page styling (layout, card styles, typography). Game-specific styles are isolated in their own CSS files.

### Snake Game (`snake.html` + `js/snake.js`)
- Implements a classic grid-based snake on a canvas or DOM grid.
- **Input:** Arrow keys only.
- **Game Loop:** Tick-based interval; moves snake, checks collisions (wall, self), checks food consumption.
- **State:** Snake body coordinates, food position, direction, score, game-over flag.
- **Rendering:** Redraws grid each tick; displays current score; shows game-over overlay with restart option.

### Tic Tac Toe (`tictactoe.html` + `css/tictactoe.css` + `js/tictactoe.js`)
- Implements a 3×3 two-player turn-based game.
- **Input:** Mouse click on empty cell.
- **Logic:** Alternates X and O; after each move checks all 8 win lines and draw condition (9 moves, no winner).
- **State:** 9-element board array, current player, game-active flag.
- **Rendering:** Updates cell text, highlights winning line, displays result message, provides reset button.
- **Navigation:** Link back to `index.html`.

### Memory Match (`memory.html` + `css/memory.css` + `js/memory.js`)
- Implements a 4×4 card grid (8 matching pairs).
- **Input:** Mouse click to flip a card.
- **Logic:** Tracks first and second flipped card per turn; if pair matches, cards stay face-up; if not, flip both back after a short delay. Increments move counter on every pair attempt.
- **State:** Card layout array (shuffled), revealed state, matched state, move count, first/second selection, lock flag (prevents clicks during flip-back delay).
- **Rendering:** CSS flip animation on cards, move counter display, win message when all pairs matched.
- **Navigation:** Link back to `index.html`.

### Validation Script (`validate_site.js`)
- Node.js script run via `node validate_site.js`.
- **File Existence Check:** Verifies all 11 required files exist in `browser-games/`.
- **JS Syntax Check:** Reads each `.js` file and validates syntax using `new Function()` wrapper (no external parser).
- **Output:** Writes pass/fail results to `site_validation_output.txt`.

---

## 3. Dataflow

### Navigation Flow
```
index.html ──link──> snake.html
           ──link──> tictactoe.html
           ──link──> memory.html

snake.html     ──link──> index.html
tictactoe.html ──link──> index.html
memory.html    ──link──> index.html
```
All navigation is standard `<a href>` — no SPA routing or JavaScript-based navigation.

### Snake Game Loop
```
Arrow Key → Direction Queue → Game Tick (setInterval)
  → Move Head → Check Collision?
      → Yes: Game Over overlay
      → No: Check Food?
          → Yes: Grow + New Food + Score++
          → No: Shift Tail
  → Render Grid
```

### Tic Tac Toe Turn Flow
```
Cell Click → Cell Empty?
  → No: Ignore
  → Yes: Place Mark → Toggle Player → Check Win?
      → Yes: Show Winner + Disable Board
      → No: Check Draw (9 moves)?
          → Yes: Show Draw
          → No: Await Next Click
```

### Memory Match Turn Flow
```
Card Click → Card Locked/Matched?
  → Yes: Ignore
  → No: Flip Card (CSS animation)
    → First Selection? → Store
    → Second Selection? → Move Counter++
        → Match? → Mark Both Matched → All Matched? → Win
        → No Match? → Delay → Flip Both Back
```

### Validation Flow
```
node validate_site.js
  → For each required file: fs.existsSync() → record result
  → For each .js file: fs.readFileSync() → new Function(src) → catch syntax error → record result
  → Write all results → site_validation_output.txt
```

---

## 4. Constraints

| Category | Constraint |
|---|---|
| **Dependencies** | Zero external dependencies; no CDN links, no npm packages, no frameworks |
| **Browser APIs** | Vanilla HTML/CSS/JS only; no ES modules (use `<script src>`), no build step |
| **Input** | Snake: keyboard arrow keys only; Tic Tac Toe & Memory: mouse click only; no touch controls |
| **Scope Exclusions** | No persistent scores, no AI opponents, no difficulty settings, no sound, no backend |
| **File Ownership** | Worker A must not modify Worker B files and vice versa; `validate_site.js` is shared scaffold |
| **CSS Isolation** | `css/main.css` contains hub styles only; game styles live in their own CSS files |
| **Validation** | Must pass `node validate_site.js` — all files present, all JS syntactically valid |
| **Node.js** | Required only for running `validate_site.js` (v18+); not used at runtime |
| **Self-Contained** | Each HTML page includes its own CSS/JS references and can function independently |
| **Back Navigation** | Every game page must include a visible link back to `index.html` |
