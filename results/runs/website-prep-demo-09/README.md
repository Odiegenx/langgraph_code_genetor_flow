# Browser Games Hub

A lightweight, static-site browser games collection featuring Snake, Tic Tac Toe, and Memory Match — all built with vanilla HTML, CSS, and JavaScript.

## Tech Stack

- **HTML5**
- **CSS3**
- **ES6+ JavaScript**
- **Node.js** (for validation only)

No frameworks, bundlers, or npm packages.

## How to Run

1. Clone or download the project.
2. Open `index.html` in a modern web browser.

That's it! All games are accessible from the landing page.

## Validation

To ensure project integrity, run the validation script:

```bash
node validate_site.js
```

This will generate a `site_validation_output.txt` file indicating whether all files, links, and contracts are correctly implemented.

## Project Structure

- `index.html`: Landing page
- `styles.css`: Shared styles
- `game-select.js`: Landing page interactivity
- `snake.html` / `snake.js`: Snake game
- `tictactoe.html` / `tictactoe.js`: Tic Tac Toe game
- `memory.html` / `memory.js`: Memory Match game
- `validate_site.js`: Validation script

## License

MIT License
