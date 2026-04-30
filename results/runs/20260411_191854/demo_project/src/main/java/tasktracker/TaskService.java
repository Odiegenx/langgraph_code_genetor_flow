package tasktracker;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class TaskService {
    private final TaskStorage storage;

    public TaskService(TaskStorage storage) {
        this.storage = storage;
    }

    public void createTask(String title) throws IOException {
        List<Task> tasks = new ArrayList<>(storage.loadTasks()); // Create a mutable copy
        int maxId = tasks.stream().mapToInt(Task::getId).max().orElse(0);
        Task newTask = new Task(maxId + 1, title, false);
        tasks.add(newTask);
        storage.saveTasks(tasks);
    }

    public List<Task> listTasks() throws IOException {
        return new ArrayList<>(storage.loadTasks());
    }

    public boolean completeTask(int id) throws IOException {
        List<Task> tasks = storage.loadTasks();
        List<Task> updatedTasks = tasks.stream()
                .map(task -> {
                    if (task.getId() == id && !task.isCompleted()) {
                        return new Task(task.getId(), task.getTitle(), true);
                    }
                    return task;
                })
                .collect(Collectors.toList());
        
        if (updatedTasks.equals(tasks)) {
            return false; // No task was found or it was already completed
        }
        
        storage.saveTasks(updatedTasks);
        return true;
    }
}
