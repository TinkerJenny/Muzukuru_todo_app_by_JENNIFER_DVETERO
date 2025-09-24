import React, { useState, useEffect, useCallback } from 'react';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from './types/todo';
import { todoApi } from './services/api';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import './styles/App.css';

interface LoadingState {
  action: 'update' | 'delete' | 'toggle';
  isLoading: boolean;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isAddingTodo, setIsAddingTodo] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: LoadingState }>({});

  // Fetch initial todos
  const fetchTodos = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      setIsInitialLoading(true);
      const response = await todoApi.fetchTodos();
      setTodos(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch todos';
      setError(errorMessage);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  // Load todos on component mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Set loading state for specific todo
  const setTodoLoading = (todoId: string, action: LoadingState['action'], isLoading: boolean): void => {
    setLoadingStates(prev => ({
      ...prev,
      [todoId]: { action, isLoading }
    }));
  };

  // Add new todo
  const handleAddTodo = async (todoData: CreateTodoRequest): Promise<void> => {
    try {
      setError(null);
      setIsAddingTodo(true);
      const response = await todoApi.createTodo(todoData);
      setTodos(prev => [response.data, ...prev]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create todo';
      setError(errorMessage);
      throw err; // Re-throw to handle in component
    } finally {
      setIsAddingTodo(false);
    }
  };

  // Update existing todo
  const handleUpdateTodo = async (updateData: UpdateTodoRequest): Promise<void> => {
    const { id } = updateData;
    const action = updateData.completed !== undefined ? 'toggle' : 'update';
    
    try {
      setError(null);
      setTodoLoading(id, action, true);
      
      const response = await todoApi.updateTodo(updateData);
      
      setTodos(prev => prev.map(todo => 
        todo.id === id ? response.data : todo
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo';
      setError(errorMessage);
      throw err;
    } finally {
      setTodoLoading(id, action, false);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id: string): Promise<void> => {
    try {
      setError(null);
      setTodoLoading(id, 'delete', true);
      
      await todoApi.deleteTodo(id);
      
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(errorMessage);
      throw err;
    } finally {
      setTodoLoading(id, 'delete', false);
    }
  };

  // Clear error message
  const handleClearError = (): void => {
    setError(null);
  };

  // Retry failed operation
  const handleRetry = (): void => {
    setError(null);
    if (todos.length === 0) {
      fetchTodos();
    }
  };

  if (isInitialLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <LoadingSpinner size="large" message="Loading your todos..." />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 Muzukuru Todo App</h1>
        <p>Stay organized and productive with your personal task manager</p>
      </header>

      <main className="app-main">
        {error && (
          <ErrorMessage
            message={error}
            onRetry={handleRetry}
            className="app-error"
          />
        )}

        <div className="app-content">
          <section className="add-todo-section">
            <AddTodoForm
              onAddTodo={handleAddTodo}
              isLoading={isAddingTodo}
            />
          </section>

          <section className="todo-list-section">
            <TodoList
              todos={todos}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
              loadingStates={loadingStates}
            />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with ❤️ for Muzukuru - Demonstrating React, TypeScript & Modern Frontend Skills</p>
      </footer>

      {/* Clear error on click outside error message */}
      {error && (
        <div 
          className="error-overlay" 
          onClick={handleClearError}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default App;