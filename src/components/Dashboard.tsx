import React from 'react';
import { Project, Todo } from '../types';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  todos: Todo[] | null | undefined; // Allow for nullable todos
  onSelectProject: (projectId: string) => void;
}

export function Dashboard({
  projects,
  todos,
  onSelectProject,
}: DashboardProps) {
  // Ensure todos is an array before proceeding
  const validTodos = Array.isArray(todos) ? todos : [];

  // Sort todos safely
  const sortedTodos = [...validTodos].sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Dashboard
        </h1>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Tasks
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedTodos.map((todo) => {
              const project = projects.find((p) => p.id === todo.projectId);
              return (
                <div
                  key={todo.id}
                  className="px-6 py-4 flex items-center hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="ml-4 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        todo.completed
                          ? 'text-gray-500 line-through'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {todo.title}
                    </p>
                    <button
                      onClick={() => onSelectProject(todo.projectId)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {project?.name}
                    </button>
                  </div>
                  {todo.dueDate && (
                    <div className="ml-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(todo.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
