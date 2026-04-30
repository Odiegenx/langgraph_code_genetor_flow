# Browser Games Hub — Architecture Document

## Overview

Browser Games Hub is a static, client-only website providing three arcade-style games accessible from a central landing page. No server, no build step, no external dependencies in game code. The only tooling dependency is Puppeteer (dev) for automated validation.

---

## Component Decomposition

### 1. Start Page (`index.html`)
- **Responsibility:** Entry point; presents three game cards linking to `snake.html`, `tic-tac-toe.html`, `memory.html`.
- **Dependencies:** `styles.css` only. No game logic.
- **Key elements:** `<h1>` heading, three `<a>` elements with hrefs to each game file.

### 2. Shared Theme (`styles.css`)
- **Responsibility:** Defines the cohesive retro/arcade visual language — color palette, typography, button styles, card styles, link styles, layout primitives.
- **Consumers:** All four HTML pages link this stylesheet first; game-specific CSS layers on top.

### 3. Snake Game (`snake.html` + `snake.css` + `snake.js`)
- **Responsibility:** Fully playable canvas-based snake game.
- **Key DOM elements:**
  - `#snake-canvas` — `<canvas>` rendering surface
  - `#start-btn` — start/restart trigger
  - `#score-display` — current score
  - `#high-score` — persisted high score (localStorage key: `snakeHighScore`)
  - Home link → `index.html`
- **Dataflow:**
  1. User clicks **Start** → game loop begins via `requestAnimationFrame`/`setInterval`.
  2. Arrow keys update snake direction (queued to prevent 180° reversal).
  3. Each tick: move head, check food collision → grow snake + increment score; check wall/self collision → game over.
  4. On game over: compare score to `localStorage.snakeHighScore`, update if higher.
- **Constraints:** Arrow-key controls only; no diagonal movement; game pauses/stops on game over until Start is pressed again.

### 4. Tic Tac Toe (`tic-tac-toe.html` + `tic-tac-toe.css` + `tic-tac-toe.js`)
- **Responsibility:** Player-vs-AI tic-tac-toe with intelligent opponent.
- **Key DOM elements:**
  - 9 `.cell` elements with `data-index` (0–8)
  - `#status` — turn / winner / draw text
  - `#restart-btn` — reset board
  - Home link → `index.html`
- **AI Strategy (minimax):**
  1. Check for immediate winning move → take it.
  2. Check for opponent immediate win → block it.
  3. Otherwise, minimax with optimal play (unbeatable).
- **Dataflow:**
  1. Player clicks empty `.cell` → place "X", check win/draw.
  2. If game continues → AI computes move, places "O", check win/draw.
  3. `#status` updates after each move.
  4. **Restart** clears board state and resets `#status`.

### 5. Memory Match (`memory.html` + `memory.css` + `memory.js`)
- **Responsibility:** Card-matching game with 8 pairs (16 cards).
- **Key DOM elements:**
  - 16 `.memory-card` elements with `data-card` attribute (identifies pair identity)
  - `.flipped` class toggled on face-up cards
  - `#moves` — move counter
  - `#restart-btn` — reshuffle and reset
  - Home link → `index.html`
- **Dataflow:**
  1. Click card → add `.flipped` class (first selection).
  2. Click second card → add `.flipped`, increment `#moves`.
  3. Compare `data-card` values:
     - **Match** → both stay `.flipped`, mark as matched.
     - **No match** → after 1s delay, remove `.flipped` from both.
  4. When all 16 cards have `.flipped` → win state displayed.
  5. **Restart** → shuffle card positions, reset all state.

### 6. Validation Script (`validate_site.js`)
- **Responsibility:** Automated headless-browser verification of all pages and interactive behavior.
- **Dependencies:** `puppeteer` (devDependency).
- **Dataflow:**
  1. Launch headless Chromium via Puppeteer.
  2. For each page (`index.html`, `snake.html`, `tic-tac-toe.html`, `memory.html`):
     - Navigate via `file://` + `__dirname`-relative path.
     - Listen for `pageerror` events (JS errors).
     - Query DOM for required selectors and IDs.
     - Test interactivity: click cells, click cards, verify canvas/controls exist.
  3. Aggregate pass/fail results.
  4. Write `site_validation_output.txt`.
  5. `process.exit(0)` on all-pass, `1` on any failure.
- **Auto-install:** If `node_modules` absent, runs `npm install` before validation.

---

## Dataflow Summary

```
index.html
  ├── snake.html ──→ snake.js ──→ localStorage (high score)
  ├── tic-tac-toe.html ──→ tic-tac-toe.js (AI logic, no persistence)
  └── memory.html ──→ memory.js (no persistence)

validate_site.js ──→ Puppeteer ──→ file:// pages ──→ site_validation_output.txt
```

No network calls occur at runtime. The only cross-page communication is the `localStorage` high score in Snake and the shared `styles.css` theme.

---

## Constraints

| Category | Constraint |
|----------|-----------|
| **Dependencies** | Puppeteer ^22.0.0 as devDependency only; zero runtime dependencies |
| **Styling** | Shared `styles.css` loaded first; game CSS overrides/augments |
| **JS** | Vanilla JS only; no inline scripts; each game in its own `.js` file |
| **Persistence** | `localStorage` for Snake high score only; no other storage |
| **Navigation** | All inter-page links are relative paths (`snake.html`, `index.html`, etc.) |
| **AI** | Tic Tac Toe AI must at minimum block wins and take wins (minimax preferred) |
| **Cards** | Memory Match must have ≥ 8 pairs (16 cards minimum) |
| **Controls** | Snake uses arrow keys; no mouse/touch direction control required |
| **Audio** | No sound effects or audio |
| **CDNs** | No external CDN references in any game code |
| **Validation** | Puppeteer-based; `file://` protocol; relative paths from `__dirname` |

---

## File Structure

```
browser-games/
├── index.html
├── styles.css
├── snake.html
├── snake.css
├── snake.js
├── tic-tac-toe.html
├── tic-tac-toe.css
├── tic-tac-toe.js
├── memory.html
├── memory.css
├── memory.js
├── validate_site.js
├── package.json
├── README.md
└── docs/
    ├── architecture.md
    └── deployment_checklist.md
```
