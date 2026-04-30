# Architecture: Browser Games Hub

## Overview
A static, client-side website serving as a hub for three vanilla JS browser games (Snake, Tic Tac Toe, Memory Match). The project includes a shared stylesheet for cohesive theming and a Node.js validation script for integrity checks. It operates entirely from the file system without a backend.

## Component Decomposition & Responsibilities

### Site Shell & Styling (Worker B)
- **`index.html`**: Landing page. Links to `styles.css`. Renders three game selection cards/buttons with navigation links to the respective game pages.
- **`styles.css`**: Shared stylesheet. Defines a cohesive color palette, typography, and layout structures (e.g., cards, grids, buttons, navigation) used across all pages.
- **`validate_site.js`**: Node.js CLI tool. Validates project integrity by checking the existence of all 9 required files and verifying JS syntax for `snake.js`, `tictactoe.js`, `memory.js`, and `validate_site.js` using `vm.createScript`. Outputs results to `site_validation_output.txt` and sets appropriate exit codes.

### Game Implementations (Worker A)
- **`snake.html` + `snake.js`**: Classic Snake game. Renders on a canvas/grid. Handles keyboard input for movement, food consumption/growth, wall/self-collision detection, score display, and restart capability. Includes "Back to Hub" link.
- **`tictactoe.html` + `tictactoe.js`**: Two-player Tic Tac Toe. Renders a 3×3 DOM grid. Manages turn alternation (X/O), win/draw state detection, and reset functionality. Includes "Back to Hub" link.
- **`memory.html` + `memory.js`**: Card-matching game. Renders a 4×4 grid (8 pairs). Manages card flip logic (max 2 at a time), match persistence, move counting, and win state upon matching all pairs. Includes "Back to Hub" link.

### Documentation
- **`README.md`**: Setup and usage instructions.
- **`docs/runbook.md`**: Troubleshooting guidance.
- **`docs/deployment_checklist.md`**: Checklist for static hosting deployment.

## Dataflow & Interactions

### User Navigation Flow
1. User opens `index.html` (file system or static host).
2. Clicks a game card → Browser navigates to the corresponding game HTML (`snake.html`, `tictactoe.html`, or `memory.html`).
3. Clicks "Back to Hub" → Browser navigates back to `index.html`.

### Game Runtime Flow
1. Game HTML loads → Browser fetches `styles.css` and the specific `game.js`.
2. JS executes → Initializes game state and renders the board/canvas.
3. User interacts (keyboard clicks for Snake, DOM clicks for Tic Tac Toe/Memory) → JS updates state and re-renders.
4. End state reached (Game Over/Win/Draw) → JS displays outcome; user clicks Restart/Reset to reinitialize state.

### Validation Flow
1. Developer runs `node validate_site.js` from the `browser-games/` directory.
2. Script uses `fs` to check file existence for all 9 project files.
3. Script uses `vm.createScript` to parse the 4 JS files without executing them.
4. Script writes pass/fail results to `site_validation_output.txt`.
5. Script exits with code `0` (success) or non-zero (failure).

## Constraints
- **Technology**: Vanilla HTML, CSS, and JavaScript only. No frameworks, libraries, or npm packages.
- **File System Compatibility**: All pages must function correctly via the `file://` protocol (no server required, meaning no ES modules or fetch requests for local files).
- **Isolation**: Game JS files must be entirely self-contained; no cross-game imports or shared JS modules.
- **Validation Tooling**: `validate_site.js` must strictly use Node.js built-in modules (`fs`, `path`, `vm`).
- **Game Specifications**:
  - Snake: Keyboard-only controls.
  - Tic Tac Toe: Two-player local only (no AI).
  - Memory Match: Exactly 4×4 grid (8 pairs).
- **State Persistence**: No `localStorage` or persistent leaderboards; games reset on page refresh.
