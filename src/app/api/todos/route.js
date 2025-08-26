import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'todos.json');

async function ensureDataFile() {
  try {
    await fs.access(dataFilePath);
  } catch {
    const initialData = [];
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

async function readTodos() {
  await ensureDataFile();
  const content = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(content || '[]');
}

async function writeTodos(todos) {
  await fs.writeFile(dataFilePath, JSON.stringify(todos, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const todos = await readTodos();
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to load todos' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, completed = false, userId = 1 } = body || {};
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const todos = await readTodos();
    const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id || 0)) + 1 : 1;
    const newTodo = { id: newId, title: title.trim(), completed: Boolean(completed), userId };
    const updated = [newTodo, ...todos];
    await writeTodos(updated);
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create todo' }, { status: 500 });
  }
}



