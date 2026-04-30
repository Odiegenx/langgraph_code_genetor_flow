# Deployment Checklist

## Prerequisites

- [ ] All required files are present as per `workflow_config.json`
- [ ] No external dependencies (npm, CDNs, APIs) used
- [ ] Entire project is contained within the `website_project/` directory
- [ ] Site works by opening `index.html` directly in a browser

## Validation Commands

- [ ] Run `node validate_site.js` to confirm:
  - All required files exist
  - JavaScript files parse without syntax errors
- [ ] Confirm `site_validation_output.txt` shows successful validation

## Endpoint / Configuration Notes

- **Entry Point**: Open `website_project/index.html` in any modern browser
- **No Server Required**: This is a static site; no backend or hosting configuration needed
- **Game Navigation**: Games are loaded and managed through `app.js` via functions exposed on `window`

## Local-Only Security Assumptions

- [ ] No data leaves the user's browser
- [ ] No cookies, localStorage, or persistent storage used
- [ ] No external network requests made
- [ ] All logic runs client-side in the browser sandbox
- [ ] Safe for offline/local use with no internet access required
