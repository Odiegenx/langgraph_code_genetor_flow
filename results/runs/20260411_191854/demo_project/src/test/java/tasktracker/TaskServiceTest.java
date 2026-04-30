package tasktracker;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatcher;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    private TaskStorage mockStorage;
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        mockStorage = mock(TaskStorage.class);
        taskService = new TaskService(mockStorage);
    }

    @Test
    void testCreateTask() throws IOException {
        List<Task> initialTasks = Arrays.asList(
                new Task(1, "Existing Task", false)
        );
        when(mockStorage.loadTasks()).thenReturn(initialTasks);

        taskService.createTask("New Task");

        verify(mockStorage).loadTasks();
        verify(mockStorage).saveTasks(argThat(new ArgumentMatcher<List<Task>>() {
            @Override
            public boolean matches(List<Task> tasks) {
                return tasks.size() == 2 &&
                        tasks.get(0).getId() == 1 &&
                        tasks.get(1).getId() == 2 &&
                        tasks.get(1).getTitle().equals("New Task") &&
                        !tasks.get(1).isCompleted();
            }
        }));
    }

    @Test
    void testListTasks() throws IOException {
        List<Task> expectedTasks = Arrays.asList(
                new Task(1, "Task 1", false),
                new Task(2, "Task 2", true)
        );
        when(mockStorage.loadTasks()).thenReturn(expectedTasks);

        List<Task> result = taskService.listTasks();

        assertEquals(expectedTasks, result);
        verify(mockStorage).loadTasks();
    }

    @Test
    void testCompleteTaskSuccessfully() throws IOException {
        List<Task> initialTasks = Arrays.asList(
                new Task(1, "Incomplete Task", false),
                new Task(2, "Already Completed", true)
        );
        when(mockStorage.loadTasks()).thenReturn(initialTasks);

        boolean result = taskService.completeTask(1);

        assertTrue(result);
        verify(mockStorage).loadTasks();
        verify(mockStorage).saveTasks(argThat(new ArgumentMatcher<List<Task>>() {
            @Override
            public boolean matches(List<Task> tasks) {
                return tasks.size() == 2 &&
                        tasks.get(0).getId() == 1 &&
                        tasks.get(0).isCompleted() &&
                        tasks.get(1).getId() == 2 &&
                        tasks.get(1).isCompleted();
            }
        }));
    }

    @Test
    void testCompleteTaskNotFound() throws IOException {
        List<Task> initialTasks = Collections.singletonList(
                new Task(1, "Some Task", false)
        );
        when(mockStorage.loadTasks()).thenReturn(initialTasks);

        boolean result = taskService.completeTask(999);

        assertFalse(result);
        verify(mockStorage).loadTasks();
        verify(mockStorage, never()).saveTasks(any(List.class));
    }

    @Test
    void testCompleteTaskAlreadyCompleted() throws IOException {
        List<Task> initialTasks = Collections.singletonList(
                new Task(1, "Completed Task", true)
        );
        when(mockStorage.loadTasks()).thenReturn(initialTasks);

        boolean result = taskService.completeTask(1);

        assertFalse(result);
        verify(mockStorage).loadTasks();
        verify(mockStorage, never()).saveTasks(any(List.class));
    }
}
