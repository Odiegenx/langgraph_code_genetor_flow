# Runbook: Java Maven Task Tracker CLI

This document provides operational guidance for deploying, running, troubleshooting, and maintaining the Task Tracker CLI application.

## Deployment

### Build Process

To build the application from source:

```bash
mvn clean package
```

This generates an executable JAR file located at `target/tasktracker-cli.jar`.

### Runtime Requirements

- Java 11 or newer installed
- Read/write permissions in the working directory (for `tasks.json`)

### Starting the Application

Execute the JAR file:

```bash
java -jar tasktracker-cli.jar
```

If no arguments are provided, the application will show help text.

## Common Operations

### Adding a Task

```bash
java -jar tasktracker-cli.jar add "Write runbook" --priority HIGH
```

### Listing Tasks

List all tasks:

```bash
java -jar tasktracker-cli.jar list
```

Filter by status:

```bash
java -jar tasktracker-cli.jar list --status COMPLETED
```

### Updating a Task

Update description and/or priority:

```bash
java -jar tasktracker-cli.jar update 123 --description "Updated task description"
```

### Completing a Task

Mark a task as completed:

```bash
java -jar tasktracker-cli.jar complete 123
```

### Deleting a Task

Remove a task permanently:

```bash
java -jar tasktracker-cli.jar delete 123
```

## Troubleshooting

### No Output or Unexpected Behavior

Ensure you're providing valid commands and options. Use `help` for guidance:

```bash
java -jar tasktracker-cli.jar help
```

### File Permission Issues

Make sure the application has permission to read and write to its working directory. The app stores data in `tasks.json`.

### Corrupted Data File

If `tasks.json` becomes corrupted:

1. Backup the file if needed.
2. Delete or rename it.
3. Restart the application to initialize a fresh data file.

Note: You'll lose previously stored tasks unless backed up.

### Slow Performance

Verify that your environment meets the performance constraints:

- Startup time should be under 2 seconds
- Each command should execute within 500ms
- Memory usage should remain under 100MB

If performance degrades, consider reducing the number of stored tasks or optimizing hardware resources.

## Maintenance

Periodically monitor:

- Disk space usage (due to `tasks.json` growth)
- Number of stored tasks (max 1000 per design)
- Logs or error reports from failed operations

Archive old tasks manually if approaching limits.

## Monitoring

Since this is a local CLI tool, monitoring primarily involves:

- Observing console output for errors
- Checking integrity of `tasks.json`
- Validating that file sizes stay within expected bounds

There are no background processes or services to monitor.

## Rollback Plan

In case of issues:

1. Revert to a known good version of the JAR file.
2. Restore `tasks.json` from backup if available.
3. Communicate impact to end-users if deployed in shared environments.
