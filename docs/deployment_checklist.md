# Deployment Checklist

## Prerequisites

- **Java Development Kit (JDK)**: JDK 17 or higher must be installed.
- **Apache Maven**: Maven 3.8.x or higher should be installed and configured in the system PATH.
- **Operating System**: Compatible with Windows, macOS, or Linux.

## Build & Test

### Run Unit Tests
```bash
mvn test
```

Expected Output:
```
[INFO] Tests run: 11, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

### Package Application
```bash
mvn package
```
This generates a JAR artifact at `target/tasktracker-1.0-SNAPSHOT.jar`.

Actual package validation evidence is stored in:

- `results/maven_package_output.txt`

The recorded package run ended with:

```text
BUILD SUCCESS
```

## Configuration Notes

- The application runs locally as a CLI tool and does **not expose any network endpoints**.
- All data is stored in a local JSON file (`tasks.json`) within the working directory.
- No external configuration files are required for basic operation.

## Security Considerations

- This is a **local-only application**, not intended for network access or multi-user environments.
- Data persistence uses simple JSON storage without encryption; suitable only for development/demo purposes.
- Assumes trusted user input; no authentication or authorization mechanisms implemented.

