# Browser Games Hub

A static, client-side website serving as a hub for three classic browser games: Snake, Tic Tac Toe, and Memory Match. Built with vanilla HTML, CSS, and JavaScript—no frameworks, libraries, or backend required.

## 🎮 Games Included

1. **Snake** – Classic snake game with keyboard controls, score tracking, and restart functionality.
2. **Tic Tac Toe** – Local two-player turn-based gameplay with win/draw detection and reset.
3. **Memory Match** – Card-matching game on a 4×4 grid (8 pairs) with move counting and win detection.

## 📁 Project Structure

```
browser-games/
├── index.html           # Landing page with game selection
├── styles.css           # Shared stylesheet for theming
├── snake.html           # Snake game page
├── snake.js             # Snake game logic
├── tictactoe.html       # Tic Tac Toe game page
├── tictactoe.js         # Tic Tac Toe game logic
├── memory.html          # Memory Match game page
├── memory.js            # Memory Match game logic
├── validate_site.js     # Node.js validation script
├── site_validation_output.txt  # Output from validation script
├── README.md            # This file
└── docs/
    ├── runbook.md       # Troubleshooting guide
    └── deployment_checklist.md  # Deployment checklist
```

## ▶️ Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- Node.js v18+ (only for running the validation script)

### Usage

1. Clone or download the repository.
2. Open `index.html` in your browser to access the game hub.
3. Click on any game card to navigate to its page.
4. Use the "Back to Hub" link on any game page to return to the main menu.

> 💡 Tip: All pages work directly from the file system (`file://` protocol) – no server required!

## 🔍 Validation Script

To verify project integrity:

```bash
node validate_site.js
```

This script checks:
- Presence of all 9 required files
- Syntax validity of `snake.js`, `tictactoe.js`, `memory.js`, and `validate_site.js`

Results are written to `site_validation_output.txt`.

Exit codes:
- `0`: Success
- Non-zero: Failure (missing files or invalid JS syntax)

## 🧾 Documentation

- [`docs/runbook.md`](docs/runbook.md) – Troubleshooting guide
- [`docs/deployment_checklist.md`](docs/deployment_checklist.md) – Steps for deploying the site

## ✅ Constraints

- No frameworks or external libraries
- No build tools or bundlers
- No backend or API dependencies
- No `localStorage` or persistent data
- Each game’s JavaScript must be self-contained

---

_Built as a lightweight showcase of vanilla browser game development._
