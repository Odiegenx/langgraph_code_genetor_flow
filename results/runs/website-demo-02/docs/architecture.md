# Architecture Overview

## Project Structure

```text
website_project/
├── index.html              # Entry point with game selection UI
├── styles.css              # Shared styling for layout and theming
├── app.js                  # Game navigation and lifecycle coordinator
├── validate_site.js        # Validation script for file integrity and JS syntax
└── games/
    ├── snake.js            # Snake game implementation
    ├── tic_tac_toe.js      # Tic Tac Toe game implementation
    ├── memory_match.js     # Memory Match card-flipping game
```

Documentation:
```text
docs/
├── architecture.md         # This document
├── tickets.md              # Development task breakdown
├── quality_report.md       # Final QA summary
├── runbook.md              # Instructions to build/test/demo
└── deployment_checklist.md # Pre-flight checks before publishing
```

Other artifacts:
- `README.md`: User guide and project overview
- `site_validation_output.txt`: Output from latest validation run
- `langgraph_website_review.md`: Final review verdict
- `artifact_progress.md`: Progress tracking during generation

---

## Component Decomposition & Responsibilities

### Shell Layer (Worker A)
**Files**: `index.html`, `styles.css`, `app.js`

#### Responsibilities
- Present initial game selection menu
- Load and switch between game views dynamically
- Manage DOM containers for each game
- Handle global styling and responsive layout
- Coordinate inter-game transitions cleanly

#### Constraints
- Must not depend on external libraries or CDNs
- All functionality must be self-contained in plain HTML/CSS/JS
- Design must support quick browser-based demo access via `file://` protocol

---

### Game Implementations (Worker B)
**Files**: 
- `games/snake.js`
- `games/tic_tac_toe.js`
- `games/memory_match.js`

#### Responsibilities
Each game module exports a public function attached to the global `window` object:
- `window.startSnakeGame(containerElement)`
- `window.startTicTacToe(containerElement)`
- `window.startMemoryMatch(containerElement)`

These functions take over rendering and interaction logic within their assigned container element.

##### Snake
- Grid-based movement using arrow keys
- Score tracking
- Collision detection

##### Tic Tac Toe
- 3x3 grid board
- Turn-based player moves
- Win condition detection

##### Memory Match
- Card flip animation
- Pair matching logic
- Reset/restart capability

#### Constraints
- Vanilla JavaScript only
- No module system usage (`import`/`export`)
- Each game must clean up its own event listeners when unloaded
- Games should avoid modifying global scope beyond their registered start function

---

### Validation System
**File**: `validate_site.js`

#### Responsibilities
- Verify presence of all required files
- Check JavaScript files for parse errors using `node --check`
- Log results to stdout and write to `site_validation_output.txt`

#### Constraints
- Must execute standalone with Node.js runtime
- Cannot rely on additional tools like ESLint or Babel
- Should fail fast on missing critical assets

---

## Data Flow

1. **User Interaction**
   - Opens `index.html` directly in browser
   - Clicks one of three game buttons/cards

2. **App Controller (`app.js`)**
   - Hides current view
   - Loads selected game's container
   - Invokes corresponding `window.start<GameName>(container)` method

3. **Game Module**
   - Takes control of provided container
   - Renders full game UI inside it
   - Binds necessary input handlers
   - Begins gameplay loop or awaits user action

4. **Validation Process**
   - Runs independently as part of CI or manual check
   - Parses all `.js` files for correctness
   - Reports success/failure status

---

## Deployment Model

This is a fully static site deployable by copying the contents of `website_project/` to any HTTP server root or cloud storage bucket configured for static hosting.

No backend services, APIs, or dynamic content are used — ideal for GitHub Pages, S3 buckets, or simple CDN distribution.
