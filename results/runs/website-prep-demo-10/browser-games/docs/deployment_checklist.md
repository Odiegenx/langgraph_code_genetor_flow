# Deployment Checklist

Before deploying the Browser Games Hub, ensure the following items are completed:

## Pre-deployment Checks

- [ ] All required files are present in the project directory
  - `index.html`, `styles.css`
  - Game files: `snake.html`, `snake.js`, `tictactoe.html`, `tictactoe.js`, `memory.html`, `memory.js`
  - Documentation: `README.md`, `docs/architecture.md`, `docs/deployment_checklist.md`
  - Validation script: `validate_site.js`
- [ ] Run `node validate_site.js` and confirm all checks pass
- [ ] Verify there are no console errors when opening pages in a browser

## Compatibility

- [ ] Confirmed compatibility with modern browsers supporting ES6+ JavaScript
- [ ] Confirmed that the site works via `file://` protocol (no server required)
- [ ] No build step is required
- [ ] No external dependencies or CDN resources are used

## Serving Instructions

To serve the site statically:

1. Place all project files in a directory accessible by your web server
2. Ensure the server serves `.html` files as `text/html` and `.js/.css` with appropriate MIME types
3. Access `index.html` through your server's URL

Example using Python's built-in HTTP server (from project root):

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

Alternative methods include using Node.js `http-server`, Apache, Nginx, or any static file hosting service.
