# Browser Games Hub

Create a small static website that serves as a hub for three browser games:

1. **Snake** – Classic snake game controlled with arrow keys.
2. **Tic Tac Toe** – Two-player local Tic Tac Toe on a 3×3 grid.
3. **Memory Match** – A card-flip memory matching game with a win condition.

The site must have a start/landing page where the user can choose which game to play. Each game should render within the same page (or swap views) using vanilla HTML, CSS, and JavaScript only — no frameworks or libraries.

A local Node.js validation script (`validate_site.js`) must be included that checks:
- All required files exist.
- Each JavaScript file parses without syntax errors (using `require('fs')` and `new Function()` or `acorn`-free syntax check).

The project should be small enough for a local demo and require no external services.
