# Generation Contract

## Technical Constraints

### General
- Vanilla HTML5, CSS3, and ES6+ JavaScript only
- No external libraries, frameworks, or CDN dependencies
- All code must run in modern browsers without transpilation
- Use semantic HTML5 elements where appropriate

### Visual Assets
- **NO** external image files (.png, .jpg, .webp, etc.)
- **NO** audio/video files
- **Allowed visual techniques**:
  - CSS styling (colors, gradients, borders, shadows)
  - Emoji characters
  - Inline SVG strings in HTML or JS
  - Canvas 2D drawing
  - Unicode symbols
  - Text-based placeholders

### File Structure
```
browser-games/
├── index.html          # Start page
├── styles.css          # Common styles
├── script.js           # Common scripts
├── snake.html          # Snake game page
├── snake.css           # Snake game styles
├── snake.js            # Snake game logic
├── tictactoe.html      # Tic Tac Toe page
├── tictactoe.css       # Tic Tac Toe styles
├── tictactoe.js        # Tic Tac Toe logic
├── memory.html         # Memory game page
├── memory.css          # Memory game styles
├── memory.js           # Memory game logic
├── validate_site.js    # Validation script
├── README.md           # Project documentation
├── docs/
│   ├── runbook.md      # Development guide
│   └── deployment_checklist.md  # Deployment steps
└── site_validation_output.txt   # Validation results
```

### Implementation Details

#### Snake Game
- Use `event.preventDefault()` on arrow key events to prevent page scrolling
- Snake can be implemented with canvas or positioned div elements
- Fruit types should cycle randomly using `Math.random()`
- Game area should have fixed dimensions

#### Tic Tac Toe AI
- Easy: Random moves with occasional intentional losses
- Medium: Minimax algorithm with limited depth or heuristic evaluation
- Hard: Full minimax or optimal algorithm
- Tutorial highlights should use CSS classes/animations

#### Memory Game
- Picture sets as arrays of emoji or SVG strings
- `localStorage` keys: `memory_highscore_12`, `memory_highscore_24`, `memory_highscore_48`
- Card state management with data attributes or JS objects

#### Validation Script
- Must run with Node.js (no browser dependencies)
- Check file existence with `fs.existsSync`
- Parse HTML files for required structure
- Search JS files for key patterns (event listeners, localStorage usage, etc.)
- Output success/failure messages to site_validation_output.txt

### Browser Compatibility
- Target modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Use feature detection for newer APIs
- No polyfills required

### Performance
- Games should load within 2 seconds on local filesystem
- Memory game should handle 48 cards without noticeable lag
- No memory leaks in game state management
