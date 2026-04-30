## Project Scope: Browser Games Collection

### Core Pages
1. **index.html** - Landing page with navigation to three games
2. **snake.html** - Snake game interface
3. **tictactoe.html** - Tic Tac Toe game interface
4. **memory.html** - Memory Match game interface

### Snake Game Features
- Canvas-based game board (400x400px minimum)
- Snake drawn as connected rounded segments with gradient coloring
- Three fruit types (apple, pear, orange) as emoji or simple SVG
- Random fruit type selection on spawn
- Arrow key event listeners with `preventDefault()` during gameplay
- Score display and game over screen

### Tic Tac Toe Features
- 3x3 grid with X/O markers
- AI opponent with three difficulty algorithms:
  - Easy: Random moves with occasional mistakes
  - Medium: Minimax with depth limit (default)
  - Hard: Full minimax optimization
- Tutorial panel with:
  - Static text explaining common patterns (fork, block, center control)
  - Interactive "Show Example" buttons that highlight board positions

### Memory Match Features
- Card grid with configurable sizes: 4x3 (12), 4x6 (24), 6x8 (48)
- Two card sets:
  - Fruits: 12 fruit emojis (🍎🍌🍒🍇🍊🍓🍋🍉🍑🥭🍍🥝)
  - Animals: 12 animal emojis (🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮)
- Set selection toggle (locked after game starts)
- Timer and move counter
- High score display (best time/moves) per grid size in localStorage

### Styling
- **styles.css**: Global styles, navigation, responsive layout
- Game-specific CSS files for each game's unique styling
- Consistent color scheme and typography
- Mobile-friendly responsive design

### Validation Requirements
- All HTML files exist and have proper structure
- CSS files are linked correctly
- JavaScript files contain required functions and event listeners
- Snake game prevents arrow key scrolling
- Tic Tac Toe has three difficulty settings
- Memory game has localStorage high score functionality
- No external image file dependencies
