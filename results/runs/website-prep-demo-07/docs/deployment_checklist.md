# Deployment Checklist

## Prerequisites
- Node.js (any recent version) installed for validation script execution.
- All project files generated in the `browser-games` directory as per the contract.
- No external dependencies or build tools required.

## Validation Commands
Run the following command from the project root (`browser-games/`) to validate the site:

```
node validate_site.js
```

This will generate a `site_validation_output.txt` file indicating PASS/FAIL status for each validation criterion.

## Endpoint / Config Notes
- This is a static website; no backend or API endpoints.
- The start page is served from `index.html`, which links to:
  - `snake.html`
  - `tictactoe.html`
  - `memory.html`
- All pages share styling via `styles.css`; individual games also use their respective CSS files.
- JavaScript files are loaded directly into their corresponding HTML pages with `<script>` tags.

## Local-Only Security Assumptions
- No user input is processed or stored persistently.
- No cookies, localStorage, or session data used.
- Entire site runs client-side with no network requests or third-party content.
- Safe for local development and demonstration purposes without internet access.
