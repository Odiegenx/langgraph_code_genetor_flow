## Technical Specifications

### File Structure
```
browser-games/
├── index.html              # Main landing page
├── styles.css              # Global styles
├── snake.html              # Snake game page
├── snake.js                # Snake game logic
├── snake.css               # Snake game styles
├── tictactoe.html          # Tic Tac Toe page
├── tictactoe.js            # Tic Tac Toe logic + AI
├── tictactoe.css           # Tic Tac Toe styles
├── memory.html             # Memory Match page
├── memory.js               # Memory game logic
├── memory.css              # Memory game styles
└── validate_site.js        # Validation script
```

### Dependencies
- Node.js (for validation script only)
- Modern browser with ES6 support, localStorage, and canvas

### Implementation Constraints
1. **No external libraries or frameworks** - pure vanilla JS
2. **No binary assets** - all visuals via CSS/emoji/SVG/canvas
3. **Snake game**:
   - Use `<canvas>` for game rendering
   - Implement game loop with `requestAnimationFrame`
   - Arrow key event listeners must call `event.preventDefault()`
   - Fruit types: apple (🍎), pear (🍐), orange (🍊)
4. **Tic Tac Toe**:
   - AI implemented in JavaScript (no external AI services)
   - Easy: ~30% chance of suboptimal move
   - Medium: Minimax with depth limit of 4
   - Hard: Full minimax (depth 9)
   - Tutorial: Separate `<div>` with static content + interactive buttons
5. **Memory Match**:
   - Card flipping with CSS transitions
   - localStorage keys: `memory_highscore_12`, `memory_highscore_24`, `memory_highscore_48`
   - Set switching only available before first card flip
6. **Responsive design**:
   - Works on screens ≥320px wide
   - Touch-friendly for mobile devices

### Validation Script Requirements
- Check existence of all 11 required files
- Verify HTML files have correct `<script>` and `<link>` tags
- Check snake.js for arrow key event prevention
- Check tictactoe.js for three difficulty level functions
- Check memory.js for localStorage getItem/setItem usage
- Output results to `site_validation_output.txt`

### Browser Compatibility
- Chrome 60+, Firefox 55+, Safari 11+, Edge 79+
- ES6 features allowed (arrow functions, const/let, template literals)
