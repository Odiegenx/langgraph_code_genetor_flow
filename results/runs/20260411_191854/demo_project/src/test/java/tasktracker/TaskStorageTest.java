package tasktracker;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TaskStorageTest {

    private TaskStorage storage;
    private File tempFile;

    @BeforeEach
    void setUp() throws IOException {
        tempFile = File.createTempFile("tasks", ".json");
        storage = new TaskStorage(tempFile.getAbsolutePath());
    }

    @AfterEach
    void tearDown() {
        if (tempFile.exists()) {
            tempFile.delete();
        }
    }

    @Test
    void testLoadTasksEmptyFile() throws IOException {
        List<Task> tasks = storage.loadTasks();
        assertNotNull(tasks);
        assertTrue(tasks.isEmpty());
    }

    @Test
    void testSaveAndLoadTasks() throws IOException {
        List<Task> originalTasks = Arrays.asList(
                new Task(1, "First Task", false),
                new Task(2, "Second Task", true)
        );

        storage.saveTasks(originalTasks);
        List<Task> loadedTasks = storage.loadTasks();

        assertEquals(originalTasks, loadedTasks);
    }

    @Test
    void testOverwriteTasks() throws IOException {
        List<Task> firstBatch = Arrays.asList(
                new Task(1, "Old Task", false)
        );
        List<Task> secondBatch = Arrays.asList(
                new Task(2, "New Task", true),
                new Task(3, "Another New Task", false)
        );

        storage.saveTasks(firstBatch);
        storage.saveTasks(secondBatch);
        List<Task> loadedTasks = storage.loadTasks();

        assertEquals(secondBatch, loadedTasks);
        assertNotEquals(firstBatch, loadedTasks);
    }
}
