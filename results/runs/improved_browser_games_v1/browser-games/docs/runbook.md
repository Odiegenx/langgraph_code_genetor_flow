# Browser Games Development Runbook

## Project Overview

This project contains three classic browser games (Snake, Tic Tac Toe, Memory Match) built with vanilla web technologies. The architecture emphasizes modularity, reusability, and constraint compliance.

## Development Environment

- Modern text editor (VS Code recommended)
- Node.js (for running validation script)
- Modern browser (Chrome/Firefox/Safari latest versions)

No build tools or transpilers are required.

## Project Structure

```
browser-games/
├── index.html          # Start page
├── styles.css          # Common styles
├── script.js           # Common utilities
├── snake/              # Snake game module
├── tictactoe/          # Tic Tac Toe module
├── memory/             # Memory game module
├── validate_site.js    # Validation script
├── README.md           # Project documentation
├── docs/               # Documentation
└── site_validation_output.txt  # Validation results
```

## Coding Standards

### HTML
- Use semantic HTML5 elements
- Maintain consistent header/footer structure
- Link CSS/JS files in `<head>`

### CSS
- Use CSS variables for consistent theming
- Prefix game-specific styles with game name
- Use Flexbox/Grid for layouts

### JavaScript
- Use ES6+ features (modules, arrow functions, destructuring)
- Separate concerns (game logic, rendering, UI)
- Use localStorage for persistence
- Handle errors gracefully

## Game Development Guidelines

### Visual Assets
- NO external images, audio, or video files
- Use CSS for styling and animations
- Use emoji for simple graphics
- Use canvas for complex drawings
- Use SVG strings for vector graphics

### Input Handling
- Prevent default behavior for game controls
- Handle both mouse and keyboard events
- Debounce rapid inputs

### Performance
- Throttle game loops to 10-15 FPS
- Use requestAnimationFrame for smooth animations
- Clean up event listeners
- Optimize AI algorithms

## Testing

### Manual Testing
1. Test all games in Chrome, Firefox, and Safari
2. Verify all game mechanics work correctly
3. Check responsive behavior
4. Validate localStorage persistence

### Automated Validation
Run the validation script:

```bash
node validate_site.js
```

This checks:
- File structure compliance
- HTML/CSS/JS linking
- Implementation patterns
- Prohibited asset usage

## Common Utilities

Shared utilities in `script.js` include:
- Navigation helpers
- localStorage wrappers
- DOM manipulation shortcuts

## Troubleshooting

### Game Not Loading
- Check browser console for errors
- Verify all files are in correct locations
- Ensure CSS/JS links are correct

### Validation Failures
- Check that implementation matches validation script expectations
- Verify no prohibited assets are referenced
- Confirm all required files exist

### Performance Issues
- Check for memory leaks
- Optimize rendering loops
- Reduce AI search depth if necessary

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run validation script
5. Submit a pull request

Ensure all changes pass validation and maintain visual constraints.
