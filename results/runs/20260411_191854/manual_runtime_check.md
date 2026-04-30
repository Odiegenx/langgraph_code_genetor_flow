PS C:\Users\pf\Desktop\Skole\LLM for Developers\LLM\mandetory1\Mandatory-1 real\results\runs\20260411_191854\demo_project> mvn exec:java "-Dexec.mainClass=tasktracker.Main" "-Dexec.args=add Write_tests"
[INFO] Scanning for projects...
[INFO]
[INFO] --------------------< com.example:task-tracker-cli >--------------------
[INFO] Building task-tracker-cli 1.0-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- exec:3.1.0:java (default-cli) @ task-tracker-cli ---
Task added successfully.
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  0.476 s
[INFO] Finished at: 2026-04-11T20:13:44+02:00
[INFO] ------------------------------------------------------------------------
PS C:\Users\pf\Desktop\Skole\LLM for Developers\LLM\mandetory1\Mandatory-1 real\results\runs\20260411_191854\demo_project> mvn exec:java "-Dexec.mainClass=tasktracker.Main" "-Dexec.args=list"
[INFO] Scanning for projects...
[INFO]
[INFO] --------------------< com.example:task-tracker-cli >--------------------
[INFO] Building task-tracker-cli 1.0-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- exec:3.1.0:java (default-cli) @ task-tracker-cli ---
Tasks:
Task{id=1, title='writetest', completed=true}
Task{id=2, title='Write_tests', completed=false}
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  0.440 s
[INFO] Finished at: 2026-04-11T20:14:02+02:00
[INFO] ------------------------------------------------------------------------
PS C:\Users\pf\Desktop\Skole\LLM for Developers\LLM\mandetory1\Mandatory-1 real\results\runs\20260411_191854\demo_project> mvn exec:java "-Dexec.mainClass=tasktracker.Main" "-Dexec.args=complete 1"
[INFO] Scanning for projects...
[INFO]
[INFO] --------------------< com.example:task-tracker-cli >--------------------
[INFO] Building task-tracker-cli 1.0-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- exec:3.1.0:java (default-cli) @ task-tracker-cli ---
Task not found or already completed.
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  0.433 s
[INFO] Finished at: 2026-04-11T20:14:40+02:00
[INFO] ------------------------------------------------------------------------