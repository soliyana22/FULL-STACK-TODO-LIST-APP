'use client';

import { useState } from 'react';
import Button from './Button';
import Input from './Input';

export default function CreateTodoForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onCreate({
        title: title.trim(),
        completed: false,
        userId: 1, // Default user ID
      });
      setTitle('');
    } catch (error) {
      console.error('Failed to create todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter a new todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={isLoading || !title.trim()}
        >
          {isLoading ? 'Adding...' : 'Add Todo'}
        </Button>
      </div>
    </form>
  );
}
