import React, { useState } from 'react';
import { User } from '../types';
import { auth } from '../utils/auth';
import { storage } from '../utils/storage';
import { Shield, Trash2, UserCog, Users } from 'lucide-react';

interface AdminPanelProps {
  currentUser: User;
}

export function AdminPanel({ currentUser }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>(storage.getUsers());

  const handleToggleAdmin = (userId: string) => {
    if (userId === currentUser.id) {
      alert("You cannot modify your own admin status");
      return;
    }

    const updatedUsers = users.map(user =>
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
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <UserCog className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {users.map(user => (
              <div
                key={user.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {user.username[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                    <p className="text-sm text-gray-500">
                      Created {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {user.isAdmin && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Admin
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {user.id !== currentUser.id && (
                    <>
                      <button
                        onClick={() => handleToggleAdmin(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isAdmin
                            ? 'text-blue-600 hover:bg-blue-100'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={user.isAdmin ? 'Remove admin rights' : 'Make admin'}
                      >
                        <Shield className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}