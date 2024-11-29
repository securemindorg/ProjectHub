import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StorageSetupProps {
  onComplete: (user: any) => void;
}

export const StorageSetup = ({ onComplete }: StorageSetupProps) => {
  const { initialize, register } = useAuth();
  const [dataPath, setDataPath] = useState('/home/project/data');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check that all fields are filled
    if (!dataPath || !username || !password) {
      setError('All fields are required');
      return;
    }

    try {
      // Initialize storage on the server side before proceeding
      console.log('Initializing storage at:', dataPath);
      await initialize(dataPath);

      // Register the admin user
      console.log('Registering admin with:', { username, password });
      const user = await register({ username, password, isAdmin: true });

      console.log('Registered user:', user);
      onComplete(user);  // Callback after successful setup
      navigate('/login');  // Redirect to login after setup
    } catch (err) {
      // Handle errors that occur during the setup process
      console.error('Error during storage setup:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during setup');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Setup ProjectHub
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Storage path input */}
          <div>
            <label
              htmlFor="dataPath"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Data Storage Location
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="dataPath"
                value={dataPath}
                onChange={(e) => setDataPath(e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                required
              />
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-500"
              >
                <FolderOpen className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Choose where to store your project data
            </p>
          </div>

          {/* Username input */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Admin Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              required
            />
          </div>

          {/* Password input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              required
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span>Initialize ProjectHub</span>
          </button>
        </form>
      </div>
    </div>
  );
};
