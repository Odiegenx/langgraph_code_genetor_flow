# Deployment Checklist

## Prerequisites
- Node.js v18+ installed (for validation script only)
- Static file server or ability to serve files locally via browser
- No build tools, bundlers, or package managers required
- No internet access needed; all resources are local

## Validation Commands
Run the following command from the project root (`browser-games/`) to validate the site structure and syntax:

```
node validate_site.js
```

This will generate a `site_validation_output.txt` file with detailed pass/fail results.

## Endpoint / Configuration Notes
- All HTML files are statically linked and can be opened directly in a browser
- Game pages must be accessed via:
  - `snake.html`
  - `tictactoe.html`
  - `memory.html`
- The homepage is `index.html`, which links to all games
- CSS is shared through `styles.css`, referenced by all pages
- JavaScript logic resides in individual `.js` files per game
- Paths used internally are relative—no absolute paths or server configurations required

## Local-only Security Assumptions
- This project runs entirely client-side using vanilla HTML, CSS, and JavaScript
- No external scripts, CDNs, or network calls are made
- No cookies, localStorage, or persistent data storage is used
- Files should not be served publicly without review as security practices are not implemented beyond static content handling
- Do not host this project on a public web server without adding proper headers and Content Security Policies (CSP) if exposing online
