# Java Maven Task Tracker CLI - Architecture

## Component Decomposition

### 1. Main Application (`TaskTrackerCLI`)
**Responsibilities:**
- Entry point for CLI application
- Command routing to appropriate handlers
- Global exception handling
- Help text generation

### 2. Command Layer
#### `CommandParser`
- Parses command-line arguments
- Validates command syntax
- Routes to specific command handlers

#### `CommandHandler` (Interface)
- Abstract interface for all command implementations

#### Concrete Command Handlers:
- `AddTaskCommand` - Create new tasks
- `ListTasksCommand` - Display tasks with filtering
- `UpdateTaskCommand` - Modify existing tasks
- `DeleteTaskCommand` - Remove tasks
- `CompleteTaskCommand` - Mark tasks as completed

### 3. Business Logic Layer
#### `TaskService`
- Core task management operations
- Transaction coordination
- Business rule enforcement

#### `TaskValidator`
- Input validation for task operations
- Data integrity checks

### 4. Data Access Layer
#### `TaskRepository`
- CRUD operations for tasks
- In-memory storage implementation
- Data persistence abstraction

#### `Task` (Model)
- Task entity with fields: id, description, status, priority, createdDate, completedDate

### 5. Utilities
#### `FileStorageUtil`
- JSON serialization/deserialization
- File I/O operations
- Data persistence management

#### `OutputFormatter`
- Console output formatting
- Table generation for task lists
- Color-coded status indicators

## Data Flow

```
CLI Args → CommandParser → CommandHandler → TaskService → TaskRepository ↔ FileStorageUtil
                              ↓              ↑
                        TaskValidator   OutputFormatter
```

1. User enters CLI command
2. CommandParser validates and routes to appropriate handler
3. CommandHandler delegates to TaskService
4. TaskService applies business logic via TaskValidator
5. TaskRepository performs data operations
6. FileStorageUtil handles persistence
7. Results formatted by OutputFormatter for display

## Constraints

### Technical
- Java 11+ minimum version
- Maven for dependency management
- Single JSON file for persistence
- No external databases
- Console-only interface

### Functional
- Maximum 1000 tasks per file
- Tasks must have unique IDs
- Status limited to: PENDING, IN_PROGRESS, COMPLETED
- Priority levels: LOW, MEDIUM, HIGH
- Description max length: 255 characters

### Performance
- Startup time < 2 seconds
- Command execution < 500ms
- Memory usage < 100MB

### Security
- Input sanitization for special characters
- File access restricted to application directory
- No network connectivity required
