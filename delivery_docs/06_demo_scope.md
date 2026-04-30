# Demo Scope

Repoet indeholder to dokumenterede reference-demoer:

- et Java Maven task tracker CLI-projekt
- et browser-games website genereret fra request-folder flowet

Java/Maven-demoen viser klassisk build/test/package-flow med `mvn test` og `mvn package`. Browser-games-demoen viser, at workflowet kan genbruges til en anden opgavetype via eksterne inputfiler, afklarende spørgsmål og reviewer-fix loop.

## Java/Maven Struktur

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

## Browser-Games Struktur

```text
browser-games/
  index.html
  snake.html
  tictactoe.html
  memory.html
  css/js assets
  site_validation_output.txt
```

## Hvad Demoerne Dokumenterer

- workflowet kan generere flere filer i samme projekt
- workers kan deles op efter filområder
- validation kan køres som en del af workflowet
- reviewer feedback kan sende projektet tilbage gennem et bounded fix-loop
- output gemmes i unikke run-mapper under `results/runs/`
