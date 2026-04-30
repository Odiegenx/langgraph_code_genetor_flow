package tasktracker;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class TaskStorage {
    private final String filePath;
    private final Gson gson;

    public TaskStorage(String filePath) {
        this.filePath = filePath;
        this.gson = new Gson();
    }

    public List<Task> loadTasks() throws IOException {
        if (!Files.exists(Paths.get(filePath))) {
            return new ArrayList<>();
        }
        try (FileReader reader = new FileReader(filePath)) {
            Type listType = new TypeToken<ArrayList<Task>>(){}.getType();
            List<Task> tasks = gson.fromJson(reader, listType);
            return tasks != null ? tasks : new ArrayList<>();
        }
    }

    public void saveTasks(List<Task> tasks) throws IOException {
        try (FileWriter writer = new FileWriter(filePath)) {
            gson.toJson(tasks, writer);
        }
    }
}
