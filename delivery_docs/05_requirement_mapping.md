# Requirement Mapping

## Purpose

This document maps the assignment requirements to concrete deliverables in the current repository after the successful configurable LangGraph workflow run.

## Current Reference Run

The current successful Java/Maven reference run is:

```text
results/runs/20260411_191854/
```

This run contains all workflow-generated artifacts in one place:

```text
results/runs/20260411_191854/
  demo_project/
  docs/
  README.md
  artifact_progress.md
  maven_test_output.txt
  maven_package_output.txt
  langgraph_java_review.md
```

The workflow inputs for this run are externalized in:

```text
inputs/task.md
inputs/demo_scope.md
inputs/generation_contract.md
inputs/workflow_config.json
```

An additional configurable workflow run was executed with a different input set:

```text
results/runs/website-demo-02/
```

This run used:

```text
test_projects/website_task/
```

It generated a static multi-game website instead of a Java/Maven CLI project. This is evidence that the LangGraph workflow is not limited to one hardcoded task description.

The strongest current browser-games reference run is:

```text
results/runs/website-prep-demo-11/
```

This run used:

```text
input_requests/browser_games/request.md
input_requests/browser_games/questions.md
input_requests/browser_games/answers.md
```

It demonstrates the newer request-folder flow, clarifying questions/answers, stronger validation, and reviewer-fix loop behavior.

## Summary Status

Covered:

- candidate comparison and recommendation
- multi-endpoint configuration
- open source tooling discussion
- architecture artifacts
- tech lead tickets
- multi-worker implementation split
- multi-file Java/Maven project generation
- Maven test execution
- bounded fixer loop
- quality report
- README and runbook
- deployment checklist
- Maven package evidence
- static website generation evidence from a second input set
- request-folder input generation with clarifying answers
- reviewer-fix loop evidence
- manual runtime evidence for the generated website
- context management via external inputs, graph state, artifact logs, and per-run output folders
- security baseline using local/private model endpoints
- setup guide

## Key Evidence

Comparison and recommendation:

- `delivery_docs/01_toolchain_comparison.md`
- `delivery_docs/08_crewai_evidence_note.md`
- `delivery_docs/02_workflow_architecture.md`
- `docs/adr-001-toolchain-choice.md`

Workflow implementation:

- `langgraph_workflow.py`
- `.env`
- `inputs/workflow_config.json`

Successful run:

- `results/runs/20260411_191854/artifact_progress.md`
- `results/runs/20260411_191854/maven_test_output.txt`
- `results/runs/20260411_191854/maven_package_output.txt`
- `results/runs/20260411_191854/langgraph_java_review.md`

Successful alternate input run:

- `results/runs/website-demo-02/artifact_progress.md`
- `results/runs/website-demo-02/site_validation_output.txt`
- `results/runs/website-demo-02/langgraph_website_review.md`
- `results/runs/website-demo-02/manual_runtime_check.md`
- `results/runs/website-demo-02/website_project/index.html`
- `results/runs/website-demo-02/website_project/app.js`
- `results/runs/website-demo-02/website_project/games/snake.js`
- `results/runs/website-demo-02/website_project/games/tic_tac_toe.js`
- `results/runs/website-demo-02/website_project/games/memory_match.js`

Successful request-folder browser-games run:

- `results/runs/website-prep-demo-11/artifact_progress.md`
- `results/runs/website-prep-demo-11/workflow_review.md`
- `results/runs/website-prep-demo-11/manual_runtime_check.md`
- `results/runs/website-prep-demo-11/browser-games/site_validation_output.txt`
- `results/runs/website-prep-demo-11/browser-games/index.html`
- `input_requests/browser_games/request.md`
- `input_requests/browser_games/questions.md`
- `input_requests/browser_games/answers.md`

Generated project:

- `results/runs/20260411_191854/demo_project/pom.xml`
- `results/runs/20260411_191854/demo_project/src/main/java/tasktracker/Main.java`
- `results/runs/20260411_191854/demo_project/src/main/java/tasktracker/Task.java`
- `results/runs/20260411_191854/demo_project/src/main/java/tasktracker/TaskService.java`
- `results/runs/20260411_191854/demo_project/src/main/java/tasktracker/TaskStorage.java`
- `results/runs/20260411_191854/demo_project/src/test/java/tasktracker/TaskServiceTest.java`
- `results/runs/20260411_191854/demo_project/src/test/java/tasktracker/TaskStorageTest.java`

Generated docs:

- `results/runs/20260411_191854/docs/architecture.md`
- `results/runs/20260411_191854/docs/tickets.md`
- `results/runs/20260411_191854/docs/quality_report.md`
- `results/runs/20260411_191854/docs/runbook.md`
- `results/runs/20260411_191854/docs/deployment_checklist.md`
- `results/runs/20260411_191854/README.md`

## Test and Deployment Evidence

The workflow ran validation with Maven. The reference run passed:

```text
Tests run: 8, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

Package validation was also run and produced:

```text
results/runs/20260411_191854/demo_project/target/task-tracker-cli-1.0-SNAPSHOT.jar
BUILD SUCCESS
```

The alternate website run passed Node-based validation:

```text
Validation passed successfully!
```

Manual browser testing also confirmed that the generated start page loaded and that Snake, Tic Tac Toe, and Memory Match were playable:

```text
results/runs/website-demo-02/manual_runtime_check.md
```

The newer request-folder run also passed validation and manual runtime testing:

```text
results/runs/website-prep-demo-11/manual_runtime_check.md
```

It reached final reviewer verdict `good_enough` after one reviewer-fix iteration.

## Requirement Mapping

| Requirement | Status | Evidence |
|---|---|---|
| Evaluate at least two approaches | Covered | `delivery_docs/01_toolchain_comparison.md`, `delivery_docs/08_crewai_evidence_note.md`, `legacy/snake_prototype/crewai_pipeline.py` |
| Recommend one approach | Covered | `docs/adr-001-toolchain-choice.md` |
| Two local endpoints | Covered | `.env`, `langgraph_workflow.py` |
| Configurable routing | Covered | `.env`, role endpoint variables |
| Open source tooling | Covered | `delivery_docs/01_toolchain_comparison.md` |
| Architecture responsibility | Covered | generated `docs/architecture.md`, plus static architecture docs |
| Tech lead responsibility | Covered | generated `docs/tickets.md` |
| Multi-worker implementation | Covered | Worker A and Worker B nodes |
| Multi-file repository changes | Covered | generated Java/Maven project files |
| Reusable workflow inputs | Covered | `inputs/`, `test_projects/website_task/`, `results/runs/website-demo-02/` |
| Clarifying request flow | Covered | `input_requests/browser_games/questions.md`, `input_requests/browser_games/answers.md`, `results/runs/website-prep-demo-11/` |
| Tests created and run | Covered | generated JUnit tests, `maven_test_output.txt` |
| Quality report | Covered | generated `docs/quality_report.md` |
| README and runbook | Covered | generated `README.md`, `docs/runbook.md` |
| Deployment validation | Covered | generated deployment checklist and `maven_package_output.txt` |
| Predictability/control | Covered | explicit graph, bounded fixer loop, progress log |
| Reproducibility | Covered | setup guide, inputs, per-run folders |
| Context management | Covered | external inputs, graph state, artifact handoffs |
| Security baseline | Covered | local endpoint setup in setup/topology docs |
| Presentation source material | Covered | delivery docs, run evidence, requirement mapping |

## Presentation Source Material

The final presentation can be built directly from the documented evidence in:

```text
delivery_docs/
docs/
results/runs/20260411_191854/
results/runs/website-prep-demo-11/
```
