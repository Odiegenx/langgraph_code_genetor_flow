# Deployment Checklist

## Prerequisites
- Node.js >= 18 installed (for running the validation script)
- Static file server capability (e.g., `http-server`, `live-server`, or any static hosting platform)
- Browser with support for ES6 JavaScript and Canvas API

## Validation Commands
Run the following command from the root of the project directory to validate site integrity:

```
node validate_site.js
```

This will generate a report at `site_validation_output.txt`. Ensure that:
- All required files are present
- No syntax errors exist in HTML or JS files
- Required CSS classes and DOM elements are implemented correctly
- Game initialization functions (`init`) are exported properly in each game's JS file

## Endpoint / Configuration Notes
- The application is fully static and client-side; no backend services are needed.
- Entrypoint: `index.html`
- Game URLs:
  - Snake: `snake.html`
  - Tic Tac Toe: `tictactoe.html`
  - Memory Match: `memory.html`
- Shared Stylesheet: `styles.css` (linked by all pages)
- Navigation between games and back to the hub is handled through hardcoded relative links.

## Security Assumptions
- This project runs entirely in the browser with no network requests or external resources.
- No user input is processed beyond keyboard controls and internal state management.
- There are no authentication mechanisms or sensitive data stored or transmitted.
- Local filesystem access is limited to manual opening of HTML files or serving via localhost.
- As per scope, there are no persistent storage mechanisms such as cookies or localStorage used for gameplay logic.
