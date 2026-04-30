# Generation Contract

All generated artifacts must be written inside the per-run output directory created by the workflow.

The workflow should generate these artifacts:

- `docs/architecture.md`
- `docs/tickets.md`
- `demo_project/pom.xml`
- `demo_project/src/main/java/tasktracker/Main.java`
- `demo_project/src/main/java/tasktracker/Task.java`
- `demo_project/src/main/java/tasktracker/TaskService.java`
- `demo_project/src/main/java/tasktracker/TaskStorage.java`
- `demo_project/src/test/java/tasktracker/TaskServiceTest.java`
- `demo_project/src/test/java/tasktracker/TaskStorageTest.java`
- `docs/quality_report.md`
- `README.md`
- `docs/runbook.md`
- `docs/deployment_checklist.md`
- `maven_test_output.txt`
- `langgraph_java_review.md`
- `artifact_progress.md`

Java contract:

- Java 17 compatible.
- Maven project.
- JUnit 5 tests.
- No Spring Boot.
- `Task` has id, title, and completed state.
- `TaskStorage` exposes `loadTasks()` and `saveTasks(...)`.
- `TaskService` owns business logic and uses `TaskStorage`.
- `Main` owns CLI parsing only.

Validation contract:

- The workflow must run Maven tests.
- If tests fail, the workflow must pass Maven output into a bounded fixer loop.
- The final quality report must reflect the actual Maven result.

