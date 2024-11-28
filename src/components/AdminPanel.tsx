import React, { useState } from 'react';
import { User, Project } from '../types';
import { auth } from '../utils/auth';
import { storage } from '../utils/storage';
import { Shield, Trash2, UserCog, Users, FolderKanban, Share2, Database, Folder } from 'lucide-react';
import { ProjectSharing } from './ProjectSharing';
import { DirectoryBrowser } from './DirectoryBrowser';

interface AdminPanelProps {
  currentUser: User;
}

export function AdminPanel({ currentUser }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>(storage.getUsers());
  const [projects, setProjects] = useState<Project[]>(storage.getProjects());
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDirectoryBrowser, setShowDirectoryBrowser] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await auth.register(newUsername, newPassword);
      setUsers([...users, user]);
      setNewUsername('');
      setNewPassword('');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to add user');
    }
  };

  const handleToggleAdmin = (userId: string) => {
    if (userId === currentUser.id) {
      alert("You cannot modify your own admin status");
      return;
    }

    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
    );
    storage.setUsers(updatedUsers);
    setUsers(updatedUsers);
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      alert("You cannot delete your own account");
      return;
    }

    if (confirm("Are you sure you want to delete this user?")) {
      auth.deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project and all its contents?")) {
      const updatedProjects = projects.filter((p) => p.id !== projectId);
      storage.setProjects(updatedProjects);
      setProjects(updatedProjects);
    }
  };

  const handleUpdateDataDirectory = (projectId: string, path: string) => {
    const updatedProjects = projects.map((project) =>
      project.id === projectId
        ? { ...project, dataDirectory: path, updatedAt: new Date().toISOString() }
        : project
    );
    storage.setProjects(updatedProjects);
    setProjects(updatedProjects);
    setShowDirectoryBrowser(false);
    setSelectedProjectId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* User Management Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h2>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleAddUser} className="mb-6 flex space-x-4">
              <input
                type="text"
                placeholder="Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <input
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add User
              </button>
            </form>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <div key={user.id || user.username} className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{user.username[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                      <p className="text-sm text-gray-500">
                        Created {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    {user.isAdmin && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Admin
                      </span>
                    )}
                  </div>

                  {user.id !== currentUser.id && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleAdmin(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isAdmin ? 'text-blue-600 hover:bg-blue-100' : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        <Shield className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Project Management Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <FolderKanban className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Project Management</h2>
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {projects.map((project) => (
              <div key={project.id} className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{project.name}</h3>
                  <p className="text-sm text-gray-500">
                    Owner: {users.find((u) => u.id === project.ownerId)?.username}
                  </p>
                  {project.dataDirectory && (
                    <p className="text-sm text-gray-500">Storage: {project.dataDirectory}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setShowDirectoryBrowser(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Folder className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedProject && (
        <ProjectSharing
          project={selectedProject}
          users={users}
          onClose={() => setSelectedProject(null)}
          onUpdate={(updatedProject) => {
            const updatedProjects = projects.map((p) =>
              p.id === updatedProject.id ? updatedProject : p
            );
            storage.setProjects(updatedProjects);
            setProjects(updatedProjects);
            setSelectedProject(null);
          }}
        />
      )}

      {showDirectoryBrowser && selectedProjectId && (
        <DirectoryBrowser
          onSelect={(path) => handleUpdateDataDirectory(selectedProjectId, path)}
          onClose={() => {
            setShowDirectoryBrowser(false);
            setSelectedProjectId(null);
          }}
        />
      )}
    </div>
  );
}
