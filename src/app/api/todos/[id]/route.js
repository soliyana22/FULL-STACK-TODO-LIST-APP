import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Ensure Node.js runtime so fs is available (Vercel defaults can be Edge)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Use runtime-writable temp directory on Vercel; local 'data' dir in dev
const dataDir = process.env.VERCEL ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data');
const dataFilePath = path.join(dataDir, 'todos.json');

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

export async function GET(_req, { params }) {
  try {
    const id = parseInt(params.id);
    const todos = await readTodos();
    const todo = todos.find(t => t.id === id);
    if (!todo) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to get todo' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id);
    const updates = await request.json();
    const todos = await readTodos();
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const updatedTodo = { ...todos[index], ...updates };
    todos[index] = updatedTodo;
    await writeTodos(todos);
    return NextResponse.json(updatedTodo);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update todo' }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const id = parseInt(params.id);
    const todos = await readTodos();
    const filtered = todos.filter(t => t.id !== id);
    if (filtered.length === todos.length) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    await writeTodos(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete todo' }, { status: 500 });
  }
}





