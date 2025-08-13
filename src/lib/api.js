const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Helper function to get todos from localStorage or fetch from API
const getStoredTodos = () => {
  const stored = localStorage.getItem('todos');
  return stored ? JSON.parse(stored) : null;
};

// Helper function to save todos to localStorage
const saveTodosToStorage = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

export const todoApi = {
  // Fetch all todos
  async getTodos() {
    try {
      // First try to get from localStorage
      const storedTodos = getStoredTodos();
      if (storedTodos) {
        return storedTodos;
      }

      // If no stored todos, fetch from API and store them
      const response = await fetch(`${API_BASE_URL}/todos`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const todos = await response.json();
      
      // Store the fetched todos
      saveTodosToStorage(todos);
      return todos;
    } catch (error) {
      console.error('Error fetching todos:', error);
      // Return empty array if API fails
      return [];
    }
  },

  // Fetch a single todo by ID
  async getTodoById(id) {
    try {
      const todos = getStoredTodos();
      if (!todos) {
        // If no stored todos, fetch them first
        await this.getTodos();
        const updatedTodos = getStoredTodos();
        const todo = updatedTodos.find(t => t.id === parseInt(id));
        if (!todo) {
          throw new Error('Todo not found');
        }
        return todo;
      }

      const todo = todos.find(t => t.id === parseInt(id));
      if (!todo) {
        throw new Error('Todo not found');
      }
      return todo;
    } catch (error) {
      console.error('Error fetching todo:', error);
      throw error;
    }
  },

  // Create a new todo
  async createTodo(todo) {
    try {
      const todos = getStoredTodos() || [];
      
      // Generate a new ID (max existing ID + 1)
      const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
      
      const newTodo = {
        ...todo,
        id: newId,
      };
      
      const updatedTodos = [newTodo, ...todos];
      saveTodosToStorage(updatedTodos);
      
      return newTodo;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Update an existing todo
  async updateTodo(id, updates) {
    try {
      const todos = getStoredTodos();
      if (!todos) {
        throw new Error('No todos found');
      }

      const todoIndex = todos.findIndex(t => t.id === parseInt(id));
      if (todoIndex === -1) {
        throw new Error('Todo not found');
      }

      const updatedTodo = {
        ...todos[todoIndex],
        ...updates,
      };

      todos[todoIndex] = updatedTodo;
      saveTodosToStorage(todos);
      
      return updatedTodo;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  // Delete a todo
  async deleteTodo(id) {
    try {
      const todos = getStoredTodos();
      if (!todos) {
        throw new Error('No todos found');
      }

      const filteredTodos = todos.filter(t => t.id !== parseInt(id));
      if (filteredTodos.length === todos.length) {
        throw new Error('Todo not found');
      }

      saveTodosToStorage(filteredTodos);
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },
};
