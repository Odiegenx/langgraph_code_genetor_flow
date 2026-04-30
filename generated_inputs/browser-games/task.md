# Browser Games Website

Create a small static website with a start page where users can choose between three browser games: Snake, Tic Tac Toe, and Memory Match.

## Games

### Snake Game
- Implement a snake that looks like a cartoon snake using CSS, canvas, or inline SVG (no external images).
- The snake eats three types of fruit: apples, pears, and oranges. Randomly switch between them during gameplay.
- Fruit should be visually distinct using CSS styling, emoji, or simple SVG.
- Use arrow keys for controls. Prevent the up/down arrows from scrolling the page when the snake game is active.

### Tic Tac Toe Game
- Implement an AI opponent with three difficulty settings:
  - **Easy**: Designed for a child (makes occasional mistakes).
  - **Medium**: Default setting for a normal adult (balanced).
  - **Hard**: AI plays optimally to win or draw.
- Include a tutorial menu with:
  - Static text explaining common patterns and strategies.
  - Interactive guide that highlights moves on the board as the user plays.

### Memory Match Game
- Two picture sets: Fruits (default) and Animals. Users can switch between sets before starting a game.
- Three difficulty levels with different numbers of picture pairs:
  - 12 pictures (6 pairs)
  - 24 pictures (12 pairs)
  - 48 pictures (24 pairs)
- Track high scores for each difficulty level using `localStorage` for persistence across browser sessions.
- Pictures should be represented with emoji, CSS shapes, or simple inline SVG (no external images).

## Technical Requirements
- Use vanilla HTML, CSS, and JavaScript only.
- No external libraries or frameworks.
- No binary image/audio/video assets (use CSS, emoji, inline SVG, canvas, or text placeholders).
- All games must be contained within their own HTML files with linked CSS/JS.
- Include a start page (index.html) with navigation to all three games.
- Include a Node.js validation script that checks file structure and basic implementation.
