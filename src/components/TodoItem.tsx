import React, { useState } from 'react';
import { Todo, UpdateTodoRequest } from '../types/todo';
import LoadingSpinner from './LoadingSpinner';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (updateData: UpdateTodoRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
  loadingAction?: 'update' | 'delete' | 'toggle';
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  onUpdate, 
  onDelete, 
  isLoading,
  loadingAction 
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(todo.title);
  const [editDescription, setEditDescription] = useState<string>(todo.description);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validateEditForm = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};

    if (!editTitle.trim()) {
      newErrors.title = 'Title is required';
    } else if (editTitle.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!editDescription.trim()) {
      newErrors.description = 'Description is required';
    } else if (editDescription.trim().length < 5) {
      newErrors.description = 'Description must be at least 5 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleToggleComplete = async (): Promise<void> => {
    try {
      await onUpdate({
        id: todo.id,
        completed: !todo.completed,
      });
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleStartEdit = (): void => {
    setIsEditing(true);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setErrors({});
  };

  const handleCancelEdit = (): void => {
    setIsEditing(false);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setErrors({});
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!validateEditForm()) return;

    try {
      await onUpdate({
        id: todo.id,
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await onDelete(todo.id);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isEditing) {
    return (
      <div className={`todo-item editing ${todo.completed ? 'completed' : ''}`}>
        <div className="edit-form">
          <div className="form-group">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: undefined }));
                }
              }}
              placeholder="Todo title..."
              className={errors.title ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <textarea
              value={editDescription}
              onChange={(e) => {
                setEditDescription(e.target.value);
                if (errors.description) {
                  setErrors(prev => ({ ...prev, description: undefined }));
                }
              }}
              placeholder="Todo description..."
              rows={3}
              className={errors.description ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="edit-actions">
            <button
              className="save-button"
              onClick={handleSaveEdit}
              disabled={isLoading}
            >
              {isLoading && loadingAction === 'update' ? (
                <>
                  <LoadingSpinner size="small" message="" />
                  Saving...
                </>
              ) : (
                '✓ Save'
              )}
            </button>
            <button
              className="cancel-button"
              onClick={handleCancelEdit}
              disabled={isLoading}
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          disabled={isLoading}
          id={`todo-${todo.id}`}
        />
        <label htmlFor={`todo-${todo.id}`} className="checkbox-label">
          {isLoading && loadingAction === 'toggle' && (
            <LoadingSpinner size="small" message="" />
          )}
        </label>
      </div>

      <div className="todo-content">
        <h3 className="todo-title">{todo.title}</h3>
        <p className="todo-description">{todo.description}</p>
        <span className="todo-date">Created: {formatDate(todo.createdAt)}</span>
      </div>

      <div className="todo-actions">
        <button
          className="edit-button"
          onClick={handleStartEdit}
          disabled={isLoading}
          title="Edit todo"
        >
          ✏️
        </button>
        <button
          className="delete-button"
          onClick={handleDelete}
          disabled={isLoading}
          title="Delete todo"
        >
          {isLoading && loadingAction === 'delete' ? (
            <LoadingSpinner size="small" message="" />
          ) : (
            '🗑️'
          )}
        </button>
      </div>
    </div>
  );
};

export default TodoItem;