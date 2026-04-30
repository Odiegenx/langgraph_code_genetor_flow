# Deployment Checklist

## Prerequisites
- [ ] Node.js v18+ installed (for validation script execution)
- [ ] All required static files generated in `browser-games/` directory
- [ ] No missing or empty files as per scope and contract

## Validation Commands
- [ ] Run `node validate_site.js` from the project root
- [ ] Confirm exit code 0 and review `site_validation_output.txt` for detailed results

## Endpoint / Config Notes
- [ ] Serve `browser-games/` directory as root path `/`
- [ ] Ensure all internal links use relative paths (e.g., `./snake.html`, `./tictactoe.html`)
- [ ] No backend endpoints required — purely static site

## Local-only Security Assumptions
- [ ] No user input is processed server-side
- [ ] No cookies, authentication, or session management used
- [ ] All JavaScript executes client-side in isolated browser contexts
- [ ] Files do not reference external resources except standard browser APIs
