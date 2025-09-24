import React, { useState } from 'react';
import { CreateTodoRequest } from '../types/todo';
import LoadingSpinner from './LoadingSpinner';

interface AddTodoFormProps {
  onAddTodo: (todoData: CreateTodoRequest) => Promise<void>;
  isLoading: boolean;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo, isLoading }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 5) {
      newErrors.description = 'Description must be at least 5 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onAddTodo({
        title: title.trim(),
        description: description.trim(),
      });
      
      // Clear form on success
      setTitle('');
      setDescription('');
      setErrors({});
    } catch (error) {
      // Error handling is managed by parent component
      console.error('Failed to add todo:', error);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
    // Clear error when user starts typing
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setDescription(e.target.value);
    // Clear error when user starts typing
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: undefined }));
    }
  };

  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      <h2>Add New Todo</h2>
      
      <div className="form-group">
        <label htmlFor="todo-title">Title</label>
        <input
          id="todo-title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter todo title..."
          disabled={isLoading}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="todo-description">Description</label>
        <textarea
          id="todo-description"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Enter todo description..."
          disabled={isLoading}
          rows={3}
          className={errors.description ? 'error' : ''}
        />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="small" message="" />
            Adding...
          </>
        ) : (
          'Add Todo'
        )}
      </button>
    </form>
  );
};

export default AddTodoForm;