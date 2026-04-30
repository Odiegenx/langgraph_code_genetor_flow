# Demo Scope

The demo project is a static multi-game website.

User experience:

1. `index.html` is the start page.
2. The start page lets the user choose between three games:
   - Snake
   - Tic Tac Toe
   - Memory Match
3. Selecting a game shows that game without requiring a server.
4. The website should work by opening `index.html` in a browser.

Recommended generated structure:

```text
website_project/
  index.html
  styles.css
  app.js
  validate_site.js
  games/
    snake.js
    tic_tac_toe.js
    memory_match.js
```

Out of scope:

- backend server
- external API calls
- npm dependencies
- database
- authentication
- build pipeline

