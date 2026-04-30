# Deployment Checklist

## Prerequisites

- **Java 17** must be installed and available on the system PATH.
- **Apache Maven 3.8+** must be installed and available on the system PATH.

## Build & Test

- [ ] Run `mvn clean test` to ensure all unit tests pass successfully.
- [ ] Verify that there are no compilation warnings or errors in the build output.

## Package

- [ ] Run `mvn clean package` to build the JAR file.
- [ ] Confirm the JAR is created under `target/task-tracker-cli-1.0-SNAPSHOT.jar`.

## Execution

- [ ] Execute the CLI using:
  ```bash
  java -jar target/task-tracker-cli-1.0-SNAPSHOT.jar
  ```
- [ ] Validate basic commands work as expected:
  - `add "New Task"`
  - `list`
  - `complete <id>`

## Configuration & Endpoints

- [ ] The application stores task data locally in a file named `tasks.json` in the working directory where the JAR is executed.
- [ ] No external endpoints or network dependencies exist; this is a fully local application.

## Security Assumptions

- [ ] Intended for single-user, local use only.
- [ ] No authentication or authorization mechanisms are implemented or required.
- [ ] File permissions should be managed by the operating system to restrict access to `tasks.json` if needed.
