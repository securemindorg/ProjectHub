import React, { useState } from 'react';
import { Project, Todo } from '../types';
import { Calendar, CheckCircle2, Circle, Clock, ArrowUpDown } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  todos: Todo[];
  onSelectProject: (projectId: string) => void;
}

type SortOption = 'updated' | 'created' | 'due';

export function Dashboard({ projects, todos, onSelectProject }: DashboardProps) {
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [sortDesc, setSortDesc] = useState(true);

  const sortedTodos = [...todos].sort((a, b) => {
    // Always put completed items at the bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Sort by selected criteria
    let aDate: string, bDate: string;
    switch (sortBy) {
      case 'created':
        aDate = a.createdAt;
        bDate = b.createdAt;
        break;
      case 'due':
        aDate = a.dueDate || '9999';
        bDate = b.dueDate || '9999';
        break;
      default: // 'updated'
        aDate = a.updatedAt;
        bDate = b.updatedAt;
    }

    return sortDesc
      ? new Date(bDate).getTime() - new Date(aDate).getTime()
      : new Date(aDate).getTime() - new Date(bDate).getTime();
  });

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return d.toLocaleDateString([], { weekday: 'long' });
    } else {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Tasks</h2>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="updated">Last Updated</option>
                <option value="created">Creation Date</option>
                <option value="due">Due Date</option>
              </select>
              <button
                onClick={() => setSortDesc(!sortDesc)}
                className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title={sortDesc ? "Sort Ascending" : "Sort Descending"}
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
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
                    <p className={`text-sm font-medium ${
                      todo.completed
                        ? 'text-gray-500 line-through'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {todo.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <button
                        onClick={() => onSelectProject(todo.projectId)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {project?.name}
                      </button>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(todo.updatedAt)}
                      </span>
                    </div>
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