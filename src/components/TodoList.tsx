import React from 'react';
import { Todo, UpdateTodoRequest } from '../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onUpdate: (updateData: UpdateTodoRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loadingStates: { [key: string]: { action: 'update' | 'delete' | 'toggle'; isLoading: boolean } };
}

const TodoList: React.FC<TodoListProps> = ({ 
  todos, 
  onUpdate, 
  onDelete, 
  loadingStates 
}) => {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No todos yet!</h3>
        <p>Create your first todo to get started.</p>
      </div>
    );
  }

  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="todo-list">
      <div className="todo-stats">
        <span className="stats-item">
          Total: <strong>{todos.length}</strong>
        </span>
        <span className="stats-item">
          Pending: <strong>{pendingTodos.length}</strong>
        </span>
        <span className="stats-item">
          Completed: <strong>{completedTodos.length}</strong>
        </span>
      </div>

      {pendingTodos.length > 0 && (
        <section className="todo-section">
          <h3 className="section-title">📋 Pending Tasks</h3>
          <div className="todo-grid">
            {pendingTodos.map(todo => {
              const loadingState = loadingStates[todo.id];
              return (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  isLoading={loadingState?.isLoading || false}
                  loadingAction={loadingState?.action}
                />
              );
            })}
          </div>
        </section>
      )}

      {completedTodos.length > 0 && (
        <section className="todo-section">
          <h3 className="section-title">✅ Completed Tasks</h3>
          <div className="todo-grid">
            {completedTodos.map(todo => {
              const loadingState = loadingStates[todo.id];
              return (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  isLoading={loadingState?.isLoading || false}
                  loadingAction={loadingState?.action}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default TodoList;