# Project Architecture

## File Structure

```
browser-games/
├── index.html
├── styles.css
├── validate_site.js
├── package.json
├── README.md
├── docs/
│   ├── architecture.md
│   └── deployment_checklist.md
├── snake.html
├── snake.css
├── snake.js
├── tic-tac-toe.html
├── tic-tac-toe.css
├── tic-tac-toe.js
├── memory.html
├── memory.css
└── memory.js
```

## Game Architecture Overview

Each game follows a consistent pattern:

1. An HTML file defines the structure and includes:
   - A link to `styles.css` for shared theming
   - A link to its own CSS file for game-specific styling
   - A script tag referencing its JS file at the end of the body
   - A home link to `index.html`

2. A CSS file provides game-specific styles layered on top of the shared theme.

3. A JavaScript file implements all game logic and interactions.

### Data Flow Examples

#### Snake
- User presses arrow key → `snake.js` updates direction
- Game loop runs → `snake.js` calculates new positions
- Canvas redrawn with updated state

#### Tic Tac Toe
- User clicks cell → `tic-tac-toe.js` places X
- AI evaluates board → `tic-tac-toe.js` places O
- Status display updated accordingly

#### Memory Match
- User clicks card → `memory.js` adds `.flipped` class
- Second click triggers comparison → Match/mismatch logic runs
- Move counter updates after each pair attempt
