import React from 'react';
import { FolderKanban, ListTodo, StickyNote, Plus, LogOut, UserCog, LayoutDashboard } from 'lucide-react';
import { Project, User } from '../types';

interface SidebarProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onNewProject: () => void;
  onLogout: () => void;
  user: User;
  onAdminPanel: () => void;
  onDashboard: () => void;
}

export function Sidebar({
  projects,
  selectedProjectId,
  onSelectProject,
  onNewProject,
  onLogout,
  user,
  onAdminPanel,
  onDashboard,
}: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-4 flex items-center space-x-2 border-b border-gray-700">
        <FolderKanban className="w-6 h-6" />
        <h1 className="text-xl font-bold">ProjectHub</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          <button
            onClick={onDashboard}
            className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={onNewProject}
            className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>

        <nav className="space-y-1 px-2">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedProjectId === project.id
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span className="truncate">{project.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700 space-y-2">
        {user.isAdmin && (
          <button
            onClick={onAdminPanel}
            className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <UserCog className="w-4 h-4" />
            <span>Admin Panel</span>
          </button>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}