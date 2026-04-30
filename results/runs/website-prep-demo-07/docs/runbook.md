# Runbook

## Overview
This document provides instructions for running and validating the browser-games project locally. It includes steps to open the site, verify functionality, and execute validation checks.

## Steps to Run Locally
1. Navigate to the project directory `browser-games`.
2. Open `index.html` in your preferred web browser (preferably a modern one).
3. From the start page, click on any game link to navigate to that game's page:
   - Snake Game (`snake.html`)
   - Tic Tac Toe (`tictactoe.html`)
   - Memory Match (`memory.html`)
4. Play each game according to its specific controls:
   - **Snake**: Use arrow keys to control direction.
   - **Tic Tac Toe**: Click cells to place X/O alternately.
   - **Memory Match**: Click cards to flip and find matching pairs.

## Validate Site Integrity
To ensure all components meet contractual requirements:

1. Execute the validation script from the terminal:
   ```
   node validate_site.js
   ```
2. Check the generated output file `site_validation_output.txt` for pass/fail statuses.

Expected validations include:
- Existence and non-emptiness of all 12 specified files.
- Syntax correctness of JavaScript files.
- Markup integrity including correct linking of assets and scripts.
- Selector and wiring consistency between HTML, CSS, and JS.

## Troubleshooting Tips
- If games do not load, confirm that each `.html` file references its own `.css` and `.js` correctly.
- For broken styles or behaviors, inspect if shared `styles.css` is properly linked across all HTML pages.
- Ensure no external resources are referenced anywhere—this project should work fully offline.
