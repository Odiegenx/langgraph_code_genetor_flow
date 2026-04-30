# Demo Scope

The demo project is a Java Maven Task Tracker CLI.

Minimum user features:

1. Add a task.
2. List tasks.
3. Complete a task by id.
4. Persist tasks in a local file.

Recommended generated structure:

```text
demo_project/
  pom.xml
  src/
    main/
      java/
        tasktracker/
          Main.java
          Task.java
          TaskService.java
          TaskStorage.java
    test/
      java/
        tasktracker/
          TaskServiceTest.java
          TaskStorageTest.java
```

Out of scope:

- Spring Boot
- web frontend
- database server
- authentication
- cloud deployment

