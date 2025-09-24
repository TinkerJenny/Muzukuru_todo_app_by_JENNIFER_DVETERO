import { Todo, CreateTodoRequest, UpdateTodoRequest, ApiResponse } from '../types/todo';

// Mock data
let mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Complete React project',
    description: 'Build an amazing todo app for Muzukuru interview',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Review code quality',
    description: 'Ensure TypeScript types are properly defined and code is clean',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Test responsive design',
    description: 'Make sure the app works well on mobile and desktop',
    completed: true,
    createdAt: new Date().toISOString(),
  },
];

// Simulate network delay
const delay = (ms: number = 1000): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Simulate random failures (10% chance)
const shouldSimulateError = (): boolean => Math.random() < 0.1;

export const todoApi = {
  // GET: Fetch all todos
  async fetchTodos(): Promise<ApiResponse<Todo[]>> {
    await delay(800);
    
    if (shouldSimulateError()) {
      throw new ApiError('Failed to fetch todos. Please try again.');
    }
    
    return {
      data: [...mockTodos],
      message: 'Todos fetched successfully',
      success: true,
    };
  },

  // POST: Create new todo
  async createTodo(todoData: CreateTodoRequest): Promise<ApiResponse<Todo>> {
    await delay(1200);
    
    if (shouldSimulateError()) {
      throw new ApiError('Failed to create todo. Please try again.');
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: todoData.title,
      description: todoData.description,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    mockTodos.unshift(newTodo);
    
    return {
      data: newTodo,
      message: 'Todo created successfully',
      success: true,
    };
  },

  // PUT: Update existing todo
  async updateTodo(updateData: UpdateTodoRequest): Promise<ApiResponse<Todo>> {
    await delay(800);
    
    if (shouldSimulateError()) {
      throw new ApiError('Failed to update todo. Please try again.');
    }

    const todoIndex = mockTodos.findIndex(todo => todo.id === updateData.id);
    
    if (todoIndex === -1) {
      throw new ApiError('Todo not found');
    }

    mockTodos[todoIndex] = {
      ...mockTodos[todoIndex],
      ...updateData,
    };

    return {
      data: mockTodos[todoIndex],
      message: 'Todo updated successfully',
      success: true,
    };
  },

  // DELETE: Remove todo
  async deleteTodo(id: string): Promise<ApiResponse<void>> {
    await delay(600);
    
    if (shouldSimulateError()) {
      throw new ApiError('Failed to delete todo. Please try again.');
    }

    const todoIndex = mockTodos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      throw new ApiError('Todo not found');
    }

    mockTodos.splice(todoIndex, 1);
    
    return {
      data: undefined,
      message: 'Todo deleted successfully',
      success: true,
    };
  },
};

// Custom error class
class ApiError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}