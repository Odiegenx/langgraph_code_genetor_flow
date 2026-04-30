# Browser Games Hub — Architecture

## 1. Component Decomposition

```
browser-games/
├── index.html              # Start page / game selector
├── styles.css              # Shared stylesheet (all pages)
├── snake.html              # Snake game shell
├── snake.js                # Snake game logic
├── tictactoe.html          # Tic Tac Toe game shell
├── tictactoe.js            # Tic Tac Toe game logic
├── memory.html             # Memory Match game shell
├── memory.js               # Memory Match game logic
├── validate_site.js        # Node.js validation script
├── README.md               # Project overview
└── docs/
    ├── architecture.md      # This document
    └── deployment_checklist.md
```

### Ownership Boundaries

| Worker | Owns |
|--------|------|
| **A** | `index.html`, `styles.css`, `validate_site.js`, `README.md`, `docs/*` |
| **B** | `snake.html`, `snake.js`, `tictactoe.html`, `tictactoe.js`, `memory.html`, `memory.js` |

Workers must not cross-modify files owned by the other.

---

## 2. Component Responsibilities

### 2.1 Start Page (`index.html`)
- Renders three game-selection cards (Snake, Tic Tac Toe, Memory Match)
- Each card is an anchor linking to its respective `.html` page
- Provides project title and brief description
- References `styles.css` only

### 2.2 Shared Stylesheet (`styles.css`)
- Defines global design tokens: fonts, colour palette, spacing, button styles
- Provides card-layout styles for the start page
- Provides game-page layout: canvas centering, grid layouts, card-flip transitions
- Every HTML page links this file via `<link rel="stylesheet" href="styles.css">`

### 2.3 Snake Game (`snake.html` + `snake.js`)

| Element | ID | Purpose |
|---------|----|---------|
| `<canvas>` | `snake-canvas` | 20×20 grid render target |

- **Rendering**: Canvas-based; each cell drawn as a filled rectangle
- **Input**: `keydown` listener for Arrow keys → direction queue (prevents 180° reversal)
- **Game loop**: `setInterval` or `requestAnimationFrame` tick at fixed interval
- **State**: snake body (array of `{x,y}`), food position, direction, score, game-over flag
- **Collision**: wall boundary check + self-intersection check each tick
- **Scoring**: +1 per food eaten; displayed in DOM
- **End condition**: collision → "Game Over" overlay with restart option
- `snake.html` includes `<script src="snake.js">` and links `styles.css`

### 2.4 Tic Tac Toe (`tictactoe.html` + `tictactoe.js`)

| Element | ID | Purpose |
|---------|----|---------|
| Container | `ttt-board` | 3×3 cell grid |
| Button | `ttt-reset` | New game reset |

- **Board**: 9 clickable cells inside `#ttt-board`; each cell is a `<div>` or `<button>`
- **Turn logic**: alternates X / O; current player shown in DOM
- **Win detection**: check all 8 lines (3 rows, 3 cols, 2 diags) after each move
- **Draw detection**: 9 moves with no winner
- **Result display**: win/draw message rendered in DOM
- **Reset**: `#ttt-reset` clears board state and UI
- `tictactoe.html` includes `<script src="tictactoe.js">` and links `styles.css`

### 2.5 Memory Match (`memory.html` + `memory.js`)

| Element | ID | Purpose |
|---------|----|---------|
| Container | `memory-board` | 4×4 card grid |
| Button | `memory-reset` | New game reset |

- **Cards**: 16 elements (8 symbol pairs) shuffled each game
- **Flip logic**: click reveals card; max 2 revealed at once
- **Match**: if two revealed cards share a symbol → stay face-up
- **Mismatch**: both flip back after 1-second `setTimeout`
- **Move counter**: incremented each time a pair is checked; displayed in DOM
- **Win condition**: all 8 pairs revealed → win message
- **Reset**: `#memory-reset` re-shuffles and resets state/UI
- `memory.html` includes `<script src="memory.js">` and links `styles.css`

### 2.6 Validation Script (`validate_site.js`)

- **Runtime**: Node.js v18+; zero external packages
- **Modules used**: `fs`, `path`, `vm`
- **Checks performed**:
  1. All required files exist
  2. JS syntax validity via `vm.createScript`
  3. `index.html` links to `snake.html`, `tictactoe.html`, `memory.html`
  4. Each game HTML contains `<script src="…">` for its JS and `<link … href="styles.css">`
  5. `snake.html` contains `<canvas id="snake-canvas">`
  6. `tictactoe.html` contains `id="ttt-board"` and `id="ttt-reset"`
  7. `memory.html` contains `id="memory-board"` and `id="memory-reset"`
- **Output**: writes pass/fail per check to `site_validation_output.txt`
- **Paths**: all relative (no `project_dir` prefix)

---

## 3. Dataflow

```
┌─────────────┐
│  index.html │ ──link──▶ snake.html
│             │ ──link──▶ tictactoe.html
│             │ ──link──▶ memory.html
└──────┬──────┘
       │
  styles.css  ◀──link─── all HTML pages
```

### Snake Dataflow
```
Arrow Key ──▶ direction update ──▶ game tick
                                      │
                          ┌───────────┤
                          ▼           ▼
                    move head    collision?
                    grow?           │
                     │         ┌───┴───┐
                     ▼         │       │
                   score++   continue  game over
                                        │
                                     restart ──▶ reset state
```

### Tic Tac Toe Dataflow
```
Cell click ──▶ place mark (X/O) ──▶ check win ──▶ result?
                                              │
                                    ┌─────────┼─────────┐
                                    ▼         ▼         ▼
                                   win      draw    next turn
                                    │
                              display winner
                                    │
                              reset button ──▶ clear state
```

### Memory Match Dataflow
```
Card click ──▶ flip card ──▶ 2 revealed?
                                │
                          ┌─────┴─────┐
                          ▼           ▼
                         no         yes ──▶ match?
                                           │
                                     ┌─────┴─────┐
                                     ▼           ▼
                                   yes          no
                                     │           │
                               stay face-up  setTimeout 1s
                                             flip both back
                                     │
                               all matched? ──▶ win message

reset button ──▶ shuffle + clear state
```

### Validation Dataflow
```
validate_site.js
    │
    ├── fs.existsSync() ──▶ file existence checks
    ├── vm.createScript() ──▶ JS syntax checks
    ├── fs.readFileSync() + string match ──▶ HTML wiring checks
    │
    └──▶ write results to site_validation_output.txt
```

---

## 4. Constraints

| Category | Constraint |
|----------|-----------|
| **Dependencies** | Zero external packages; no CDN links; no network requests |
| **Browser** | Vanilla HTML/CSS/JS only; must open directly via `file://` |
| **Element IDs** | `snake-canvas`, `ttt-board`, `ttt-reset`, `memory-board`, `memory-reset` — exact matches required |
| **Script refs** | Each game HTML must contain `<script src="<game>.js">` and `<link rel="stylesheet" href="styles.css">` |
| **Validation** | `validate_site.js` uses only `fs`, `path`, `vm`; relative paths only; output to `site_validation_output.txt` |
| **Ownership** | Worker A must not edit Worker B files and vice versa |
| **Scope** | No multiplayer, no localStorage, no sound, no touch controls, no build tools |
| **Snake grid** | 20×20 cells on canvas |
| **Memory grid** | 4×4 (16 cards, 8 pairs) |
| **TTT grid** | 3×3, two-player local only |
