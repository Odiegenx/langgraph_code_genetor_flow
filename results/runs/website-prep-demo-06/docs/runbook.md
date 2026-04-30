# Runbook: Troubleshooting Guide

This document provides solutions to common issues you might encounter while working with the **Browser Games Hub** project.

## ❓ Common Issues & Fixes

### 1. Files Won't Load When Opening `index.html`

#### Symptom
When opening `index.html` via `file://`, styles or scripts don’t load.

#### Cause
Some browsers block certain features over the `file://` protocol due to security policies.

#### Fix
- Ensure all paths in HTML files use relative URLs (they already do).
- Try launching Chrome with flags to allow local file access:
  ```bash
  google-chrome --allow-file-access-from-files
  ```
- Alternatively, serve the folder locally using a simple HTTP server:
  ```bash
  npx serve .
  ```

### 2. Validation Script Fails Unexpectedly

#### Symptom
Running `node validate_site.js` returns an error even though all files exist.

#### Cause
Possible syntax errors in one of the JS files caught during parsing by `vm.createScript`.

#### Fix
Check `site_validation_output.txt` for detailed messages indicating which file failed and why. Correct any syntax issues manually.

### 3. Game Doesn't Respond to Input

#### Symptom
Clicks or keypresses have no effect in-game.

#### Causes
- Missing focus on the element handling input (especially for Snake)
- Incorrect event listeners

#### Fix
Ensure that:
- Canvas or interactive elements receive proper focus
- Event listeners are attached after DOM content has loaded
- Console shows no JavaScript runtime errors

Use browser dev tools (`F12`) to inspect console logs and debug step-by-step if needed.

### 4. Styling Looks Broken Across Pages

#### Symptom
Styles appear inconsistent or broken between `index.html`, game pages, etc.

#### Cause
Incorrect linking to `styles.css` or malformed CSS rules.

#### Fix
Verify each `.html` file includes:
```html
<link rel="stylesheet" href="styles.css">
```
Also confirm there are no typos in class names or conflicting global styles.

Validate your CSS using [W3C CSS Validator](https://jigsaw.w3.org/css-validator/).

### 5. Game Resets on Page Refresh

#### Symptom
Refreshing the game page causes loss of progress.

#### Cause
By design, the games do not persist state across sessions.

#### Note
There is currently no mechanism for saving scores or progress. This behavior aligns with project scope limitations.

---

If issues persist beyond these cases, review browser developer console logs and consider raising an issue in internal documentation or communication channels.
