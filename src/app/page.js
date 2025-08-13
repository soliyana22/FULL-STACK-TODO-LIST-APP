import Link from 'next/link';
import Button from '../components/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Todo App
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A modern, responsive todo list application built with Next.js and Tailwind CSS
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/todos">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Features:</p>
            <ul className="mt-2 space-y-1">
              <li>• Create, edit, and delete todos</li>
              <li>• Mark todos as complete</li>
              <li>• View individual todo details</li>
              <li>• Responsive design</li>
              <li>• Real-time updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
