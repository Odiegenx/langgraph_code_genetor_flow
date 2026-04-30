# Deployment Checklist

## Prerequisites

- [ ] A static web hosting service (e.g., GitHub Pages, Netlify, Vercel, or AWS S3)
- [ ] Node.js v18+ installed (only required for pre-deployment validation)
- [ ] Modern browser support for opening HTML files locally or via HTTP(S)

## Validation Commands

Before deployment, run the following command from inside the `browser-games/` directory:

```bash
node validate_site.js
```

Ensure that the output file `site_validation_output.txt` is generated and contains:

```
✅ All checks passed.
```

## Endpoint / Configuration Notes

- All files are static and do not require server-side processing.
- The entry point is `index.html`, which provides navigation to:
  - `snake.html`
  - `tictactoe.html`
  - `memory.html`
- Each game page links to `styles.css` for consistent styling.
- Relative paths are used throughout; no absolute paths or base URLs are hardcoded.
- Each game includes a "Back to Hub" link pointing to `index.html`.

## Local-Only Security Assumptions

- [ ] No backend or API dependencies – fully client-side execution
- [ ] No user input is stored or processed beyond the current browser session
- [ ] No sensitive data is handled or transmitted
- [ ] All resources (HTML, CSS, JS) are served from the same origin
- [ ] No third-party scripts or external resources are included
- [ ] The project does not use cookies, localStorage, or sessionStorage for gameplay logic

✅ Ready for static deployment once all items above are confirmed.
