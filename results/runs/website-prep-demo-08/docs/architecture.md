# Browser Games Hub – Architecture

## Overview

A static website serving as a hub for three browser games. No backend, no frameworks, no build tools. Each game is a fully self-contained page with its own CSS and JS. A Node.js validation script verifies structural integrity.

---

## Component Decomposition

```
browser-games/
├── index.html          # Hub/landing page with game selection cards
├── styles.css          # Shared styles for hub layout and card UI
├── snake.html          # Snake game page
├── snake.css           # Snake-specific styles
├── snake.js            # Snake game logic (canvas rendering, input, scoring)
├── tictactoe.html      # Tic Tac Toe game page
├── tictactoe.css       # Tic Tac Toe-specific styles
├── tictactoe.js        # Tic Tac Toe logic (turns, win/draw detection)
├── memory.html         # Memory Match game page
├── memory.css          # Memory Match-specific styles
├── memory.js           # Memory Match logic (flip, match, move counter)
└── validate_site.js    # Node.js validation script
```

---

## Component Responsibilities

### Hub Layer

| File | Responsibility |
|---|---|
| `index.html` | Renders three game-selection cards. Each card links to its game page via relative `href`. Links to `styles.css`. |
| `styles.css` | Provides shared layout (card grid, typography, hover states, `.back-link` base styling). Consumed by `index.html` only; game pages have their own CSS. |

### Snake Game

| File | Responsibility |
|---|---|
| `snake.html` | Hosts a `<canvas>` element, score display, game-over overlay, back link (`.back-link`). Links `snake.css` + `snake.js`. |
| `snake.css` | Canvas sizing, score/overlay positioning, `.game-container` wrapper. |
| `snake.js` | Game loop via `requestAnimationFrame` or `setInterval`. Arrow-key `keydown` listener for direction. Snake as coordinate array; food as random cell. Collision detection (walls + self). Score increments on food eat. Game-over state halts loop; restart resets all state. |

### Tic Tac Toe Game

| File | Responsibility |
|---|---|
| `tictactoe.html` | 3×3 grid container (9 child elements), turn indicator, status text, reset button, back link. Links `tictactoe.css` + `tictactoe.js`. |
| `tictactoe.css` | Grid layout (`display: grid; grid-template-columns: repeat(3,1fr)`), cell styling, X/O visual differentiation, `.game-container` wrapper. |
| `tictactoe.js` | Click handlers on cells. Alternating X/O placement. Win detection (8 lines: 3 rows, 3 cols, 2 diags). Draw detection (9 filled, no win). Reset button clears board state. No shared JS state with other games. |

### Memory Match Game

| File | Responsibility |
|---|---|
| `memory.html` | Card-grid container (4×4 = 16 cards), move counter display, win message, back link. Links `memory.css` + `memory.js`. |
| `memory.css` | Card flip animation (`transform: rotateY` via CSS transition), grid layout, matched/unmatched states, `.game-container` wrapper. |
| `memory.js` | 8 pairs shuffled into 16-card array. Click-to-flip: max 2 cards face-up at once. Match logic: same symbol → stay face-up; mismatch → flip back after short delay. Move counter increments per pair attempt. Win detection: all 16 face-up. |

### Validation Script

| File | Responsibility |
|---|---|
| `validate_site.js` | Node.js script using only `fs` and `path` (and `vm` for JS parsing). Runs 10 checks, writes pass/fail results to `site_validation_output.txt`, exits 0 on all-pass, non-zero otherwise. |

---

## Dataflow

```
┌─────────────┐
│  index.html │◄──────────────────────────────────┐
│  (hub)      │                                   │
└──┬──┬──┬────┘                                   │
   │  │  │  user clicks card                      │ back
   ▼  ▼  ▼                                        │
```

---

## Ticket Backlog

(See original ticket breakdown in full architecture document.)

---

## Quality Report Summary

Initial validation failed due to incorrect file path assumptions in `validate_site.js`. Once corrected, all components passed validation and the system functions as intended.
