# Browser Games

A collection of classic browser-based games built with vanilla HTML, CSS, and JavaScript.

## Games

### Snake
Control a snake to eat fruit and grow longer. Avoid hitting walls or yourself!

- **Controls**: Arrow keys
- **Features**: Three fruit types, score tracking, game over modal

### Tic Tac Toe
Classic 3x3 Tic Tac Toe with three AI difficulty levels:

- **Easy**: Makes random moves with occasional mistakes
- **Medium**: Uses minimax algorithm with limited depth
- **Hard**: Full minimax for optimal play
- **Tutorial**: Interactive strategy explanations

### Memory Match
Match pairs of cards in this memory challenge game:

- **Picture Sets**: Fruits (🍎🍌🍒) or Animals (🐶🐱🐭)
- **Difficulties**: 6, 12, or 24 pairs
- **Features**: Timer, move counter, high scores

## Technical Details

- **No external assets**: All visuals created with CSS, emoji, or canvas
- **Pure client-side**: Runs entirely in the browser with localStorage
- **Modern JS**: Uses ES6+ features like modules, arrow functions, and template literals

## Setup

1. Clone or download this repository
2. Open `index.html` in a modern browser
3. Navigate to your desired game

No build process or server required - everything works directly from the file system.

## Validation

Run the validation script to check project integrity:

```bash
node validate_site.js
```

This will verify:
- All required files exist
- HTML structure is correct
- Key implementation patterns are present
- No prohibited assets are used

Results are saved to `site_validation_output.txt`.

## Development

See `docs/runbook.md` for development guidelines and contribution instructions.
