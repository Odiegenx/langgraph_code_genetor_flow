# Browser Games Website Architecture

## Project Structure
```
browser-games/
├── index.html                    # Start page with game navigation
├── styles.css                    # Common styles (header, footer, layout)
├── script.js                     # Common utilities (navigation, localStorage helpers)
├── snake/                        # Snake game module
│   ├── snake.html               # Snake game page
│   ├── snake.css                # Snake-specific styles
│   └── snake.js                 # Snake game logic
├── tictactoe/                    # Tic Tac Toe game module
│   ├── tictactoe.html           # Tic Tac Toe game page
│   ├── tictactoe.css            # Tic Tac Toe-specific styles
│   └── tictactoe.js             # Tic Tac Toe game logic
├── memory/                       # Memory Match game module
│   ├── memory.html              # Memory game page
│   ├── memory.css               # Memory-specific styles
│   └── memory.js                # Memory game logic
├── validate_site.js             # Node.js validation script
├── README.md                    # Project documentation
├── docs/                        # Documentation directory
│   ├── runbook.md              # Development guide
│   └── deployment_checklist.md  # Deployment steps
└── site_validation_output.txt   # Validation results
```

## Component Decomposition

### 1. Start Page (index.html)
**Responsibilities:**
- Provide navigation to all three games
- Maintain consistent header/footer across all pages
- Display brief game descriptions
- Link to game-specific pages

**Data Flow:**
- Static HTML with CSS styling
- Navigation links to `/snake/snake.html`, `/tictactoe/tictactoe.html`, `/memory/memory.html`

### 2. Snake Game Module
**Core Components:**
- **Game Engine** (`snake.js`):
  - Game loop using `requestAnimationFrame()`
  - Snake movement and collision detection
  - Fruit generation with random types (🍎, 🍐, 🍊)
  - Score tracking
- **Input Handler**:
  - Arrow key event listeners with `preventDefault()`
  - Pause/resume functionality
- **Renderer**:
  - Canvas-based drawing (400x400px)
  - Snake segments as rounded rectangles with gradient fills
  - Fruit as emoji or SVG icons
- **UI Controller**:
  - Score display
  - Game over modal
  - Restart functionality

**Constraints:**
- No external images - use canvas drawing or emoji
- Arrow keys must not scroll page (`event.preventDefault()`)
- Fixed game area dimensions

### 3. Tic Tac Toe Game Module
**Core Components:**
- **Game Board**:
  - 3x3 grid of interactive cells
  - Visual feedback for X/O placement
- **AI Engine** (`tictactoe.js`):
  - **Easy AI**: Random moves with 30% chance of suboptimal play
  - **Medium AI**: Minimax algorithm with depth limit (3-4 moves ahead)
  - **Hard AI**: Full minimax algorithm (optimal play)
- **Tutorial System**:
  - Static strategy explanations (fork, block, center control)
  - Interactive highlighting using CSS classes
  - Step-by-step move suggestions
- **Game State Manager**:
  - Win/draw detection
  - Score tracking (wins/losses/draws)
  - Difficulty persistence

**Data Flow:**
- Board state as 3x3 array
- AI decision tree for medium/hard difficulties
- Local storage for game statistics

### 4. Memory Match Game Module
**Core Components:**
- **Card System**:
  - Two picture sets: Fruits (🍎🍌🍒) and Animals (🐶🐱🐭)
  - Card objects with emoji/SVG content and match state
- **Game Manager**:
  - Difficulty levels (6/12/24 pairs)
  - Timer and move counter
  - Match detection logic
- **High Score System**:
  - `localStorage` persistence with keys: `memory_highscore_12`, `memory_highscore_24`, `memory_highscore_48`
  - Score calculation based on time and moves
- **UI Controller**:
  - Grid layout (4x3, 6x4, 8x6)
  - Card flip animations using CSS transforms
  - Set selection before game start

**Constraints:**
- No external images - use emoji or CSS-generated shapes
- Responsive grid layout for different pair counts
- High scores persist across browser sessions

### 5. Validation Script (validate_site.js)
**Responsibilities:**
- File structure validation (check all required files exist)
- HTML validation (check for proper CSS/JS links)
- Code pattern validation:
  - Snake: Arrow key event listeners with `preventDefault()`
  - Tic Tac Toe: AI difficulty implementations
  - Memory: `localStorage` usage for high scores
- Output results to `site_validation_output.txt`

**Implementation:**
- Node.js script using `fs` module
- Regular expressions for pattern matching
- Exit codes for CI/CD integration

## Data Flow Architecture

### Cross-Game Communication
- **Navigation**: Consistent header with "Back to Home" link
- **Local Storage**:
  - Memory game: High scores per difficulty
  - Tic Tac Toe: Win statistics (optional)
- **State Management**: Each game manages its own state independently

### Game-Specific Data Models

**Snake:**
```javascript
{
  snake: [{x, y}, ...],
  direction: 'right',
  fruit: {x, y, type: 'apple'|'pear'|'orange'},
  score: 0,
  gameOver: false
}
```

**Tic Tac Toe:**
```javascript
{
  board: [['', '', ''], ...],
  currentPlayer: 'X'|'O',
  difficulty: 'easy'|'medium'|'hard',
  scores: {player: 0, ai: 0, draws: 0}
}
```

**Memory:**
```javascript
{
  cards: [{id, content, flipped, matched}, ...],
  selectedSet: 'fruits'|'animals',
  difficulty: 12|24|48,
  moves: 0,
  startTime: Date.now(),
  matchedPairs: 0
}
```

## Technical Constraints & Solutions

### Visual Assets
- **Snake**: Canvas gradients for snake body, emoji for fruits
- **Tic Tac Toe**: CSS shapes for X/O with hover effects
- **Memory**: Emoji for card content, CSS transitions for flips

### Performance Considerations
- **Snake**: Throttle game loop to 10-15 FPS
- **Memory**: Debounce card click events to prevent rapid flipping
- **Tic Tac Toe**: Implement iterative deepening for AI to prevent UI freeze

### Browser Compatibility
- Feature detection for `localStorage`
- Fallback for `requestAnimationFrame`
- CSS Grid with fallback to flexbox for older browsers

## Development Workflow

### Worker A Responsibilities:
1. Start page with consistent navigation
2. Snake game with canvas rendering and keyboard controls
3. Memory game with emoji sets and localStorage scoring
4. Common styles and utilities
5. Documentation (README, runbook)

### Worker B Responsibilities:
1. Tic Tac Toe with three AI difficulty levels
2. Interactive tutorial system
3. Validation script for project integrity
4. Deployment documentation

### Integration Points:
- Shared CSS variables in `styles.css` for consistent theming
- Common navigation component in all HTML files
- Consistent error handling patterns
- Unified game state persistence approach

## Validation Criteria
The validation script will check for:
1. All required files exist in correct locations
2. HTML files have proper CSS/JS links
3. Snake game prevents arrow key scrolling
4. Tic Tac Toe has three AI difficulty implementations
5. Memory game uses localStorage for high scores
6. No external binary assets are referenced
7. All games are playable without JavaScript errors

This architecture ensures modular development while maintaining consistency across games, with clear separation of concerns and adherence to all technical constraints.
