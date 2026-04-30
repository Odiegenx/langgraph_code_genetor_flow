# Deployment Checklist

Before deploying the Browser Games Hub to a static hosting service (e.g., GitHub Pages, Netlify, S3), follow these steps:

## Pre-Deploy Verification

1. Run the validation script:
   ```bash
   npm run validate
   ```
2. Check `site_validation_output.txt` for any failures.
3. Manually verify that all games are fully playable.
4. Ensure no console errors appear in browser dev tools for any page.

## Deployment Steps

1. Choose your static hosting provider (GitHub Pages, Netlify, etc.).
2. Upload all files from the `browser-games/` directory to your hosting location.
3. Set the root directory to serve `index.html` as the homepage.
4. Verify that all internal links work correctly (e.g., game pages can navigate back to index).
5. Confirm that `localStorage` functions properly for high scores (especially in private browsing modes if applicable).

## Post-Deployment Checks

1. Visit your live URL.
2. Test navigation between all pages.
3. Play each game briefly to ensure functionality.
4. Check that styles render correctly across different browsers.
5. Validate mobile usability (though responsive design is out of scope, basic touch interaction should work).
