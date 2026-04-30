# Browser Games Hub

A collection of three classic browser-based games built with vanilla HTML5, CSS3, and JavaScript.

## 🎮 Games Included

1. **Snake** - Classic snake game with keyboard controls and scoring.
2. **Tic Tac Toe** - Two-player local game with win/draw detection.
3. **Memory Match** - Card flipping memory challenge with move tracking.

## 📁 Project Structure

```
browser-games/
├── index.html          # Landing page
├── styles.css          # Shared global styling
├── snake.html          # Snake game page
├── snake.css           # Snake-specific styles
├── snake.js            # Snake game logic
├── tictactoe.html      # Tic Tac Toe game page
├── tictactoe.css       # Tic Tac Toe styles
├── tictactoe.js        # Tic Tac Toe logic
├── memory.html         # Memory Match game page
├── memory.css          # Memory Match styles
├── memory.js           # Memory Match logic
└── validate_site.js    # Validation script
```

## ▶️ How to Play

1. Open `index.html` in your browser.
2. Click on any game card to navigate to that game.
3. Enjoy!

### Controls

- **Snake**: Arrow keys to control direction.
- **Tic Tac Toe**: Click on grid cells to place X or O.
- **Memory Match**: Click on cards to flip and find matching pairs.

## ✅ Validation

Run the validation script to check project integrity:

```bash
cd browser-games
node validate_site.js
```

This will generate a `site_validation_output.txt` file showing validation results.

## 🛠 Tech Stack

- **Frontend**: Pure HTML5, CSS3, ES6+ JavaScript (no frameworks)
- **Validation**: Node.js (for running `validate_site.js`)

## 🚫 Out of Scope

- No backend or server-side logic.
- No external libraries or CDNs.
- No responsive/mobile layouts.
- No sound effects or advanced animations.

## 📄 License

This project is open-source and available under the MIT License.
