import React, { useState } from 'react';
import { Folder, ChevronRight, ChevronDown } from 'lucide-react';

interface DirectoryBrowserProps {
  onSelect: (path: string) => void;
  onClose: () => void;
}

export function DirectoryBrowser({ onSelect, onClose }: DirectoryBrowserProps) {
  const [currentPath, setCurrentPath] = useState('/');

  // Simulated directory structure for demo
  const directories = {
    '/': ['home', 'usr', 'var'],
    '/home': ['user', 'projects', 'documents'],
    '/usr': ['local', 'bin', 'share'],
    '/var': ['log', 'tmp', 'cache'],
  };

  const handleSelect = (dir: string) => {
    const newPath = currentPath === '/' ? `/${dir}` : `${currentPath}/${dir}`;
    setCurrentPath(newPath);
  };

  const handleConfirm = () => {
    onSelect(currentPath);
    onClose();
  };

  const goUp = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    setCurrentPath(parentPath);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Directory</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{currentPath}</p>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <button
              onClick={goUp}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-gray-800"
            >
              Go up
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {directories[currentPath as keyof typeof directories]?.map((dir) => (
              <button
                key={dir}
                onClick={() => handleSelect(dir)}
                className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <Folder className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-900 dark:text-white">{dir}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Select Directory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}