# Runbook: Static Multi-Game Website

This document provides step-by-step instructions for building, testing, and deploying the static multi-game website.

## 🔧 Local Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari)
- Node.js installed (for running validation script)

### Running Locally

1. Ensure all files from `website_project/` are present.
2. Open `website_project/index.html` in a browser using the `file://` protocol.
3. You should see a start menu with options to launch Snake, Tic Tac Toe, or Memory Match.

> 💡 Tip: For best results, serve the folder via a local HTTP server like Python’s `http.server` if CORS issues arise with `file://`.

## ✅ Testing Procedure

### Validate File Integrity and Syntax

Run the built-in validation script:

```bash
node validate_site.js
```

Expected output:

```
Starting site validation...
✓ Found required file: index.html
...
Validation passed successfully!
```

If there are missing files or syntax errors, they will be reported immediately.

### Manual Gameplay Testing

For each game:

#### Snake
- Use arrow keys to navigate.
- Eat food to grow and increase score.
- Avoid walls and self-collision.

#### Tic Tac Toe
- Two players take turns clicking cells.
- Win by getting three in a row/column/diagonal.
- Reset button clears the board.

#### Memory Match
- Click cards to flip them.
- Find matching pairs to keep them visible.
- Try to minimize attempts.
- Reset shuffles and restarts.

## ☁️ Deployment

Since the project is fully static, deployment involves simply copying the contents of `website_project/` to your desired hosting solution.

### Hosting Options

#### GitHub Pages
1. Push the contents of `website_project/` to a GitHub repo.
2. Enable GitHub Pages in repository settings pointing to root directory.

#### Amazon S3 / CloudFront
1. Upload all files to an S3 bucket.
2. Configure the bucket for static website hosting.
3. Optionally front with CloudFront for global distribution.

#### Netlify / Vercel
1. Connect your Git provider to Netlify/Vercel.
2. Set publish directory to `website_project/`.
3. Deploy automatically on push.

## 🔄 Updating Content

To add new games or modify existing ones:

1. Add new `.js` file under `games/`.
2. Register a loader function in `app.js` similar to others.
3. Update `validate_site.js` to include the new file path.
4. Test thoroughly before redeploying.

Always re-run `node validate_site.js` post-changes to confirm integrity.

## 📞 Support

For questions or issues related to setup, reach out to the maintainer listed in the repository.
