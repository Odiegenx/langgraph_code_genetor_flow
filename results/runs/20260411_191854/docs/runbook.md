# Runbook - Task Tracker CLI

This runbook provides operational instructions for maintaining and troubleshooting the Task Tracker CLI application.

## Starting the Application

Ensure Java 17+ and Maven are installed. To start the application:

1. Compile and package the project:
   ```bash
   mvn clean package
   ```
2. Run the JAR:
   ```bash
   java -jar target/task-tracker-cli-1.0-SNAPSHOT.jar [command]
   ```

Replace `[command]` with one of the supported actions: `add`, `list`, or `complete <ID>`.

## Common Operations

### Adding a Task

```bash
java -jar task-tracker-cli-1.0-SNAPSHOT.jar add "Write documentation"
```

### Listing Tasks

```bash
java -jar task-tracker-cli-1.0-SNAPSHOT.jar list
```

### Completing a Task

```bash
java -jar task-tracker-cli-1.0-SNAPSHOT.jar complete 3
```

Where `3` is the ID of the task to mark as completed.

## Troubleshooting

### Application Fails to Start

- Verify that Java 17+ is installed and available in your PATH.
- Confirm that Maven built the project successfully (`mvn clean package`).

### Tasks Not Persisting

Check that the application has write permissions to the working directory where `tasks.json` is stored.

### Unexpected Behavior

Review logs printed to stdout/stderr. For detailed debugging, consider adding logging statements to capture internal state transitions.

## Maintenance

Periodically clean old builds:

```bash
mvn clean
```

Rebuild when updating source code:

```bash
mvn clean compile
```

Update dependencies if needed by modifying `pom.xml` and running:

```bash
mvn dependency:resolve
```

## Logs and Diagnostics

All runtime diagnostics are currently printed directly to the console. Future enhancements might include structured logging to a dedicated file.
