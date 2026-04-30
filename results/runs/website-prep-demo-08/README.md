# Browser Games Hub

A static website hosting three classic browser-based games: Snake, Tic Tac Toe, and Memory Match. Built with vanilla HTML, CSS, and JavaScript—no frameworks, no build tools, no backend.

## 🎮 Games Included

- **Snake**: Guide the snake to eat food and grow without hitting walls or yourself.
- **Tic Tac Toe**: Classic 3x3 grid game with alternating X/O turns and win/draw detection.

- **Memory Match**: Flip cards to find matching pairs in as few moves as possible.

## 📁 Project Structure

```
browser-games/
├── index.html          # Hub/landing page with game selection cards
├── styles.css          # Shared styles for hub layout and card UI
├── snake.html          # Snake game page
├── snake.css           # Snake-specific styles
├── snake.js            # Snake game logic (canvas rendering, input, scoring)
├── tictactoe.html      # Tic Tac Toe game page
├── tictactoe.css       # Tic Tac Toe-specific styles
├── tictactoe.js        # Tic Tac Toe logic (turns, win/draw detection)
├── memory.html         # Memory Match game page
├── memory.css          # Memory Match-specific styles
├── memory.js           # Memory Match logic (flip, match, move counter)
└── validate_site.js    # Node.js validation script
```

## ▶️ Getting Started

1. Clone or download this repository.
2. Open `index.html` in your browser to access the game hub.
3. Click any game card to play.
4. Use the "Back" link on each game page to return to the hub.

## ✅ Validation

Run the included Node.js validation script to verify structural integrity:

```bash
cd browser-games
node validate_site.js
```

This will output results to `site_validation_output.txt` and exit with code 0 if all checks pass.

## 🛠️ Technologies Used

- **HTML5** for structure and semantic markup
- **CSS3** for responsive design and animations
- **JavaScript (ES6+)** for interactive gameplay logic
- **Node.js** (for running the validation script only)

## 📜 License

This project is licensed under the MIT License.
