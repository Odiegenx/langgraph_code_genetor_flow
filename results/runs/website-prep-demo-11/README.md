# Browser Games Hub

Welcome to **Browser Games Hub**, a collection of three classic arcade-style games playable directly in your browser — no installation, no server, no build step.

## 🎮 Games Included

1. **Snake** – Guide the snake to eat food and grow, avoiding walls and itself.
2. **Tic Tac Toe** – Challenge an AI opponent in this timeless strategy game.
3. **Memory Match** – Flip cards to find matching pairs in as few moves as possible.

## 🚀 Getting Started

To run locally:

1. Clone or download this repository.
2. Navigate to the project folder in your terminal.
3. Run:
   ```bash
   npm install
   ```
4. Open `index.html` in your browser to start playing!

## ✅ Validation

Run the automated validation suite to ensure all pages and interactions work correctly:

```bash
npm run validate
```

This runs `validate_site.js` using Puppeteer to simulate browser interactions and verify page structure.

## 📁 Project Structure

```
browser-games/
├── index.html
├── styles.css
├── snake.html
├── snake.css
├── snake.js
├── tic-tac-toe.html
├── tic-tac-toe.css
├── tic-tac-toe.js
├── memory.html
├── memory.css
├── memory.js
├── validate_site.js
├── package.json
├── README.md
└── docs/
    ├── architecture.md
    └── deployment_checklist.md
```

## 🧾 License

This project is open-source and available under the MIT License.
