package tasktracker;

import java.io.IOException;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        if (args.length < 1) {
            printUsage();
            return;
        }

        TaskStorage storage = new TaskStorage("tasks.json");
        TaskService service = new TaskService(storage);

        try {
            switch (args[0]) {
                case "add":
                    if (args.length != 2) {
                        System.out.println("Usage: add <title>");
                        return;
                    }
                    service.createTask(args[1]);
                    System.out.println("Task added successfully.");
                    break;
                case "list":
                    List<Task> tasks = service.listTasks();
                    if (tasks.isEmpty()) {
                        System.out.println("No tasks found.");
                    } else {
                        System.out.println("Tasks:");
                        for (Task task : tasks) {
                            System.out.println(task);
                        }
                    }
                    break;
                case "complete":
                    if (args.length != 2) {
                        System.out.println("Usage: complete <id>");
                        return;
                    }
                    try {
                        int id = Integer.parseInt(args[1]);
                        boolean completed = service.completeTask(id);
                        if (completed) {
                            System.out.println("Task marked as completed.");
                        } else {
                            System.out.println("Task not found or already completed.");
                        }
                    } catch (NumberFormatException e) {
                        System.out.println("Invalid task ID. Please provide a numeric ID.");
                    }
                    break;
                default:
                    printUsage();
            }
        } catch (IOException e) {
            System.err.println("Error accessing task storage: " + e.getMessage());
        }
    }

    private static void printUsage() {
        System.out.println("Task Tracker CLI");
        System.out.println("Usage:");
        System.out.println("  add <title>        - Add a new task");
        System.out.println("  list               - List all tasks");
        System.out.println("  complete <id>      - Mark a task as completed");
    }
}
