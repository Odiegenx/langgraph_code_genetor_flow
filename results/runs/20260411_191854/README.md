# Task Tracker CLI

A simple command-line interface (CLI) application for tracking tasks. Built with Java and Maven, this tool allows users to add, list, and mark tasks as completed, with all data persisted in a local JSON file.

## Features

- Add new tasks
- List all tasks
- Mark tasks as completed
- Persistent storage using JSON

## Prerequisites

- Java 17+
- Apache Maven 3.6+

## How to Build

To compile and package the application:

```bash
mvn clean package
```

This will create an executable JAR in the `target/` directory.

## How to Run

After building, you can run the application using:

```bash
java -jar target/task-tracker-cli-1.0-SNAPSHOT.jar [command]
```

Supported commands:

- `add "Task Title"` – Adds a new task with the given title.
- `list` – Displays all tasks.
- `complete <ID>` – Marks the task with the given ID as completed.

Example:

```bash
java -jar target/task-tracker-cli-1.0-SNAPSHOT.jar add "Buy groceries"
java -jar target/task-tracker-cli-1.0-SNAPSHOT.jar list
java -jar target/task-tracker-cli-1.0-SNAPSHOT.jar complete 1
```

## Testing

Run unit tests using:

```bash
mvn test
```

---

For more information, see the documentation in the `docs/` folder.
