# Browser Games Hub

A collection of classic browser-based games implemented in vanilla HTML, CSS, and JavaScript.

## Games Included

- **Snake**: Guide the snake to eat food and grow without hitting walls or itself.
- **Tic Tac Toe**: Classic two-player game on a 3x3 grid.
- **Memory Match**: Flip cards to find matching pairs in a 4x4 grid.

## How to Run

Open `index.html` in your browser. All games are accessible from the start page.

## How to Validate

Run the validation script to check file structure and syntax:

```bash
node validate_site.js
```

This generates a `site_validation_output.txt` with pass/fail results.

## File Structure

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
    ├── architecture.md      # System design document
    └── deployment_checklist.md
```

## Workers

- **Worker A**: Project infrastructure, start page, styles, validation, documentation
- **Worker B**: Game implementations (Snake, Tic Tac Toe, Memory Match)
