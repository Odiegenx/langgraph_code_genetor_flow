# Generation Contract

All generated artifacts must be written inside the per-run output directory created by the workflow.

The workflow should generate these artifacts:

- `docs/architecture.md`
- `docs/tickets.md`
- `website_project/index.html`
- `website_project/styles.css`
- `website_project/app.js`
- `website_project/games/snake.js`
- `website_project/games/tic_tac_toe.js`
- `website_project/games/memory_match.js`
- `website_project/validate_site.js`
- `docs/quality_report.md`
- `README.md`
- `docs/runbook.md`
- `docs/deployment_checklist.md`
- `site_validation_output.txt`
- `langgraph_website_review.md`
- `artifact_progress.md`

Website contract:

- Use vanilla HTML, CSS, and JavaScript.
- Do not require a web server for the main demo.
- Do not use external packages or CDN dependencies.
- `index.html` must include a visible start menu with three game choices.
- The three games must be playable or minimally interactive.
- JavaScript files must avoid module syntax unless the validation script supports it.
- `validate_site.js` must run with Node and validate that required files exist and JavaScript files parse successfully.

Validation contract:

- The workflow must run the configured validation command.
- If validation fails, the workflow must pass validation output into a bounded fixer loop.
- The final quality report must reflect the actual validation result.

