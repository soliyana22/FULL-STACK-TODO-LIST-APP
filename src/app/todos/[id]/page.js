'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { todoApi } from '../../../lib/api';
import Button from '../../../components/Button';

export default function TodoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchTodo(params.id);
    }
  }, [params.id]);

  const fetchTodo = async (id) => {
    try {
      setLoading(true);
      const data = await todoApi.getTodoById(parseInt(id));
      setTodo(data);
      setEditTitle(data.title);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todo');
      console.error('Error fetching todo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editTitle.trim()) return;

    setIsUpdating(true);
    try {
      const updatedTodo = await todoApi.updateTodo(todo.id, {
        title: editTitle.trim(),
      });
      setTodo(updatedTodo);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating todo:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await todoApi.deleteTodo(todo.id);
        router.push('/todos');
      } catch (err) {
        console.error('Error deleting todo:', err);
      }
    }
  };

  const handleToggleComplete = async () => {
    try {
      const updatedTodo = await todoApi.updateTodo(todo.id, {
        completed: !todo.completed,
      });
      setTodo(updatedTodo);
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading todo...</p>
        </div>
      </div>
    );
  }

  if (error || !todo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Todo not found'}</p>
          <Link href="/todos">
            <Button>Back to Todos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/todos" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Todos
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Todo Details</h1>
        </div>

        {/* Todo Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUpdating}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleUpdate}
                  disabled={isUpdating || !editTitle.trim()}
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setEditTitle(todo.title);
                  }}
                  variant="outline"
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={handleToggleComplete}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <h2 className={`text-xl font-semibold ${
                  todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {todo.title}
                </h2>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    todo.completed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {todo.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">ID:</span>
                  <span className="text-sm text-gray-600">#{todo.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">User ID:</span>
                  <span className="text-sm text-gray-600">{todo.userId}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                >
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
