# Static Multi-Game Website

A lightweight, self-contained collection of classic browser-based games built with vanilla HTML, CSS, and JavaScript. No external dependencies — just open `index.html` in your browser to play!

## 🎮 Games Included

1. **Snake** – Classic grid-based snake movement with scoring.
2. **Tic Tac Toe** – Traditional 3x3 turn-based strategy game.
3. **Memory Match** – Card flipping memory challenge with pair matching.

## 🚀 Quick Start

To run the demo:

1. Clone or download this repository.
2. Navigate to the `website_project/` folder.
3. Open `index.html` directly in a web browser using the `file://` protocol.

That's it! The interface will let you choose which game to play.

## 🧾 Features

- Fully static site (no server required)
- Self-contained implementation (no CDNs or external libraries)
- Responsive design suitable for desktop and mobile
- Modular architecture enabling easy extension

## 🛠️ Development

All source code lives in the `website_project/` directory:

```
website_project/
├── index.html          # Main entry point
├── styles.css          # Shared styling
├── app.js              # Game navigation logic
├── validate_site.js    # Validation script
└── games/              # Individual game modules
    ├── snake.js
    ├── tic_tac_toe.js
    └── memory_match.js
```

Run validation locally:

```bash
node validate_site.js
```

## 📄 Documentation

See the `docs/` folder for detailed information:

- [Architecture](./docs/architecture.md)
- [Deployment Checklist](./docs/deployment_checklist.md)
- [Runbook](./docs/runbook.md)
- [Quality Report](./docs/quality_report.md)

## ✅ License

This project is licensed under the MIT License - see the LICENSE file for details.
