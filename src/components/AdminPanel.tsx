import React, { useState, useEffect } from 'react';
import { User, Project } from '../types';
import { Shield, Trash2, Users, FolderKanban, Share2, Folder } from 'lucide-react';
import { ProjectSharing } from './ProjectSharing';
import { DirectoryBrowser } from './DirectoryBrowser';
import { API_BASE_URL } from '../config';

interface AdminPanelProps {
  currentUser: User;
}

export function AdminPanel({ currentUser }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDirectoryBrowser, setShowDirectoryBrowser] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch users from backend
    fetch(`${API_BASE_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));

    // Fetch projects from backend
    fetch(`${API_BASE_URL}/api/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const user = await response.json();
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

    const user = users.find((user) => user.id === userId);
    if (!user) return;

    const updatedUser = { ...user, isAdmin: !user.isAdmin };

    fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update user admin status');
        }
        setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
      })
      .catch((error) => alert(error.message));
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      alert("You cannot delete your own account");
      return;
    }

    if (confirm("Are you sure you want to delete this user?")) {
      fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to delete user');
          }
          setUsers(users.filter((user) => user.id !== userId));
        })
        .catch((error) => alert(error.message));
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project and all its contents?")) {
      fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to delete project');
          }
          setProjects(projects.filter((project) => project.id !== projectId));
        })
        .catch((error) => alert(error.message));
    }
  };

  const handleUpdateDataDirectory = (projectId: string, path: string) => {
    const updatedProject = projects.find((project) => project.id === projectId);
    if (!updatedProject) return;

    const updatedProjectData = {
      ...updatedProject,
      dataDirectory: path,
      updatedAt: new Date().toISOString(),
    };

    fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProjectData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update project data directory');
        }
        setProjects(projects.map((p) => (p.id === projectId ? updatedProjectData : p)));
        setShowDirectoryBrowser(false);
        setSelectedProjectId(null);
      })
      .catch((error) => alert(error.message));
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
  {projects.map((project) => {
    const owner = users.find((user) => user.id === project.ownerId);

    return (
      <div key={project.id} className="p-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{project.name}</h3>
          <p className="text-sm text-gray-500">
            Owner: {owner ? owner.username : 'Unknown'}
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
            onClick={() => handleDeleteProject(project.id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  })}
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
