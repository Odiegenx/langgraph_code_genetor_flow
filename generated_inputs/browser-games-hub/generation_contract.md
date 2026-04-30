# Generation Contract

## Project: browser-games-hub

### Dependencies
- **Runtime:** Node.js (for validation script only)
- **Browser:** Any modern browser (Chrome, Firefox, Edge, Safari)
- **No npm packages required** – the validation script uses only Node built-ins (`fs`, `path`, `vm`).

### File Ownership

| Worker | Files |
|--------|-------|
| Worker A | `browser-games/index.html`, `browser-games/css/main.css`, `browser-games/js/snake.js`, `browser-games/validate_site.js` |
| Worker B | `browser-games/js/tictactoe.js`, `browser-games/js/memory.js` |

Workers A and B must not modify each other's files.

### Integration Contract
- `index.html` loads `css/main.css` and all four game JS files via `<script>` tags in this order: `snake.js`, `tictactoe.js`, `memory.js`.
- Each game JS file must expose a single init function on the `window` object:
  - `window.initSnake(containerId)`
  - `window.initTicTacToe(containerId)`
  - `window.initMemoryMatch(containerId)`
- Each init function receives the ID of a DOM container element and renders the game inside it.
- `index.html` provides three hidden `<div>` containers (one per game) and shows/hides them based on user selection.
- `validate_site.js` must exit with code 0 on success and non-zero on failure, writing results to `site_validation_output.txt`.

### Validation
Run: `node browser-games/validate_site.js`

The script must:
1. Check that every required file exists under `browser-games/`.
2. Read each `.js` file and attempt to parse it using `new Function()` wrapped in try/catch to detect syntax errors.
3. Write a pass/fail summary to `site_validation_output.txt`.
4. Exit with code 0 if all checks pass, code 1 otherwise.
