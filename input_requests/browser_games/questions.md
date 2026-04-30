1. **Project Structure:** How should the games be organized in the file system?
   - A) Separate HTML files per game (e.g., `snake.html`, `tic-tac-toe.html`).
   - B) Single-page application (SPA) with JavaScript routing/hiding and showing divs.

2. **Game Features:** What is the minimum viable feature set for the games?
   - A) Basic playable state (e.g., Tic Tac Toe is 2-player only, no score tracking).
   - B) Basic playable state + score tracking across rounds.
   - C) Full features (e.g., Tic Tac Toe has a simple AI opponent, Snake has high scores).

3. **Validation Script:** What should the Node.js validation script check?
   - A) File existence and basic HTML structure (e.g., checking for specific DOM elements).
   - B) A) + JavaScript linting (e.g., using ESLint with a standard config).
   - C) A) + Spinning up a headless browser (Puppeteer) to verify the games load without errors.

4. **Styling/UI:** Are there any specific styling expectations for the website?
   - A) Plain CSS, simple and functional (no specific theme).
   - B) Plain CSS, but with a cohesive retro/arcade gaming theme.
   - C) Plain CSS, responsive design required (must work on mobile screens).

5. **Worker Split:** How should the implementation be divided among workers?
   - A) By component: 1 worker for Start Page + CSS, 1 worker per game (3 workers total for games), 1 worker for validation script.
   - B) By file type: 1 worker for all HTML/CSS, 1 worker for all JS, 1 worker for validation.
   - C) No preference, let the workflow decide the optimal split.
