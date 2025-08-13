'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { todoApi } from '../../lib/api';
import TodoItem from '../../components/TodoItem';
import CreateTodoForm from '../../components/CreateTodoForm';
import Button from '../../components/Button';

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoApi.getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (newTodo) => {
    try {
      const createdTodo = await todoApi.createTodo(newTodo);
      setTodos(prev => [createdTodo, ...prev]);
    } catch (err) {
      console.error('Error creating todo:', err);
      throw err;
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const updatedTodo = await todoApi.updateTodo(id, updates);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      console.error('Error updating todo:', err);
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      await todoApi.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchTodos}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo List</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>

        {/* Create Todo Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Todo</h2>
          <CreateTodoForm onCreate={handleCreate} />
        </div>

        {/* Todos List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Todos ({todos.length})
            </h2>
            <div className="text-sm text-gray-500">
              {todos.filter(todo => todo.completed).length} completed
            </div>
          </div>

          {todos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No todos yet. Create your first todo above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
