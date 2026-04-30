# Deployment Checklist: Browser Games Hub

## Prerequisites

- [ ] All project files are present as per `generation_contract.md`
- [ ] Node.js (version 14 or higher) is installed on the deployment environment
- [ ] `npm install` has been executed successfully in the project root directory
- [ ] Static file server is available (e.g., nginx, Apache, GitHub Pages, Netlify, Vercel)
- [ ] No server-side logic exists; entire project consists of client-side HTML/CSS/JS only

## Validation Commands

Before deploying, ensure all validations pass locally:

```bash
npm install
node validate_site.js
```

Verify that `site_validation_output.txt` reports all tests passed.

## Endpoint and Configuration Notes

- The application is fully static and can be served via any web-accessible directory
- All pages must be accessible directly via `.html` extensions (`index.html`, `snake.html`, etc.)
- Paths in HTML files use relative URLs (no absolute paths)
- `validate_site.js` uses `file://` protocol for local testing but deployment should serve over HTTP(S)
- No build step is required – raw source files are deployable

## Local-only Security Assumptions

- [ ] No user input is processed or stored beyond localStorage usage for high scores
- [ ] No external resources (CDNs, APIs, images) are referenced in game code
- [ ] All JavaScript execution occurs within the browser context of the visitor
- [ ] localStorage access is limited to saving and retrieving numeric high score values
- [ ] Puppeteer script (`validate_site.js`) is not deployed and only used during development/validation

> ⚠️ Warning: Do not expose `validate_site.js` or `node_modules/` publicly in production environments.
