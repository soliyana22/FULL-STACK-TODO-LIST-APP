const API_BASE_URL = '/api/todos';

export const todoApi = {
  // Fetch all todos
  async getTodos() {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
  },

  // Fetch a single todo by ID
  async getTodoById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch todo');
    }
    return response.json();
  },

  // Create a new todo
  async createTodo(todo) {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    return response.json();
  },

  // Update an existing todo
  async updateTodo(id, updates) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
    return response.json();
  },

  // Delete a todo
  async deleteTodo(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
    return response.json();
  },
};
