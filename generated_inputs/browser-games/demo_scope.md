# Demo Scope: Browser Games Website

## Project Boundaries
- **Size**: Small static website suitable for local demo (~10-15 files total).
- **Assets**: No external binary assets (PNG, JPG, MP3, etc.). All visuals generated via code.
- **Dependencies**: None beyond Node.js for validation.
- **Complexity**: Each game is simplified to core mechanics.

## Acceptance Criteria

### Start Page (index.html)
- [ ] Links to three game pages: snake.html, tictactoe.html, memory.html
- [ ] Consistent navigation back to start page from all games
- [ ] Basic styling with CSS

### Snake Game (snake.html, snake.css, snake.js)
- [ ] Canvas or DOM-based snake rendering with cartoon style
- [ ] Three fruit types (apple, pear, orange) with distinct visual representations
- [ ] Random fruit type selection on spawn
- [ ] Arrow key controls that don't scroll the page
- [ ] Game over condition (collision with walls/self)
- [ ] Score display

### Tic Tac Toe Game (tictactoe.html, tictactoe.css, tictactoe.js)
- [ ] 3x3 game board
- [ ] Three AI difficulty levels with clear behavioral differences
- [ ] Tutorial section with:
  - [ ] Static pattern explanations
  - [ ] Interactive move highlighting
- [ ] Win/draw detection
- [ ] Score tracking

### Memory Match Game (memory.html, memory.css, memory.js)
- [ ] Two picture sets (fruits and animals) using emoji/CSS
- [ ] Set selection before game start
- [ ] Three difficulty levels (6, 12, 24 pairs)
- [ ] Card flipping mechanics
- [ ] Match detection
- [ ] Timer and move counter
- [ ] High score storage in localStorage per difficulty level

### Validation Script (validate_site.js)
- [ ] Checks existence of all required files
- [ ] Validates HTML structure and CSS/JS links
- [ ] Checks for key implementation patterns in source code
- [ ] Outputs results to site_validation_output.txt

## Out of Scope
- User accounts or server-side storage
- Complex animations or physics
- Mobile-specific optimizations
- Cross-browser testing beyond modern Chrome/Firefox
- Accessibility compliance beyond basic keyboard navigation
