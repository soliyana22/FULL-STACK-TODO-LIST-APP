'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from './Button';

export default function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    
    setIsLoading(true);
    try {
      await onUpdate(todo.id, { title: editTitle.trim() });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      await onUpdate(todo.id, { completed: !todo.completed });
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setIsLoading(true);
      try {
        await onDelete(todo.id);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <Button
          onClick={handleSave}
          disabled={isLoading || !editTitle.trim()}
          size="sm"
        >
          Save
        </Button>
        <Button
          onClick={handleCancel}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggleComplete}
        disabled={isLoading}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <span
        className={`flex-1 text-gray-900 ${
          todo.completed ? 'line-through text-gray-500' : ''
        }`}
      >
        {todo.title}
      </span>
      <div className="flex gap-2">
        <Link 
          href={`/todos/${todo.id}`}
          className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-gray-100 hover:text-gray-900 h-8 px-3 text-sm"
        >
          View
        </Link>
        <Button
          onClick={() => setIsEditing(true)}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          Edit
        </Button>
        <Button
          onClick={handleDelete}
          variant="destructive"
          size="sm"
          disabled={isLoading}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
