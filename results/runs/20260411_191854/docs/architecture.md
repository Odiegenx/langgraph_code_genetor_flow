```markdown
# Architecture Document - Task Tracker CLI

## Overview

This document describes the architecture of a Java-based command-line interface (CLI) task tracker application built with Maven. The system enables users to add, list, and complete tasks that are persisted locally in a file.

---

## Components

### 1. Main (`Main.java`)
**Responsibility:**  
Entry point of the application. Handles CLI argument parsing and delegates actions to `TaskService`.

**Functions:**
- Parses command-line arguments.
- Invokes appropriate methods on `TaskService`.

---

### 2. Task (`Task.java`)
**Responsibility:**  
Represents an individual task entity.

**Fields:**
- `id`: Unique identifier for the task.
- `title`: Descriptive name/title of the task.
- `completed`: Boolean flag indicating completion status.

---

### 3. TaskService (`TaskService.java`)
**Responsibility:**  
Encapsulates all business logic related to managing tasks.

**Functions:**
- Adding new tasks.
- Listing existing tasks.
- Marking a task as completed by ID.
- Interacts with `TaskStorage` for persistence operations.

---

### 4. TaskStorage (`TaskStorage.java`)
**Responsibility:**  
Handles loading from and saving tasks to a local JSON file.

**Functions:**
- `loadTasks()`: Reads tasks from storage.
- `saveTasks(List<Task> tasks)`: Writes updated task list to storage.

---

## Data Flow

```text
[User Command] 
       ↓
   Main.main()
       ↓
 TaskService (business logic)
       ↓
 TaskStorage (persistence)
       ↓
 Local File (tasks.json or similar)
```

Each interaction follows this flow:
1. User issues a CLI command.
2. `Main` parses the command and calls `TaskService`.
3. `TaskService` performs validation/business rules and interacts with `TaskStorage`.
4. `TaskStorage` reads/writes data to the filesystem.

---

## Constraints

- **No external frameworks**: Pure core Java + Maven; no Spring Boot.
- **Persistence**: Tasks stored in a simple local file (e.g., JSON).
- **Testing Framework**: Unit tests implemented using JUnit 5.
- **Java Version Compatibility**: Must compile and run under Java 17.
- **Modularity**: Clear separation between CLI handling, business logic, and persistence layers.

---
```
