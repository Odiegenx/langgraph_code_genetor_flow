# Deployment Checklist

## Prerequisites

- [ ] Node.js installed (v14 or higher recommended)
- [ ] Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)
- [ ] Local file system access
- [ ] No external dependencies or internet connection required

## Validation Commands

Run the following command from the root of the project directory (`browser-games/`) to validate site integrity:

```bash
node validate_site.js
```

Check the output in `site_validation_output.txt` for any failed validations.

## Endpoint / Configuration Notes

- All files are static and designed for local filesystem execution
- No server-side components or APIs used
- Games rely on `localStorage` for high score persistence (Memory game)
- Navigation between pages uses relative links (`./snake.html`, etc.)
- No build step or transpilation required

## Security Assumptions

- Intended for local use only; not designed for public hosting
- No user input sanitization needed as there is no dynamic content submission
- No cookies or sensitive data stored beyond game scores in `localStorage`
- Does not support mobile devices explicitly but may function in mobile browsers

> ⚠️ Warning: Do not host this project publicly without adding proper sandboxing and security layers.
