import React, { useState, useEffect } from 'react';
import { Folder, ChevronRight, ChevronDown, FolderUp } from 'lucide-react';

interface DirectoryBrowserProps {
  onSelect: (path: string) => void;
  onClose: () => void;
}

interface DirectoryStructure {
  [key: string]: string[];
}

export function DirectoryBrowser({ onSelect, onClose }: DirectoryBrowserProps) {
  const [currentPath, setCurrentPath] = useState('/');
  const [directories, setDirectories] = useState<DirectoryStructure>({
    '/': ['home', 'usr', 'var', 'opt', 'etc'],
    '/home': ['user', 'projects', 'documents', 'downloads'],
    '/home/user': ['workspace', 'data', 'backup'],
    '/home/projects': ['web', 'mobile', 'desktop'],
    '/usr': ['local', 'bin', 'share', 'lib'],
    '/var': ['log', 'tmp', 'cache', 'www'],
    '/opt': ['local', 'custom'],
    '/etc': ['config', 'default', 'system']
  });

  const handleSelect = (dir: string) => {
    const newPath = currentPath === '/' ? `/${dir}` : `${currentPath}/${dir}`;
    setCurrentPath(newPath);
  };

  const handleConfirm = () => {
    onSelect(currentPath);
    onClose();
  };

  const goUp = () => {
    if (currentPath === '/') return;
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    setCurrentPath(parentPath);
  };

  const getCurrentDirectories = () => {
    return directories[currentPath] || [];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-2xl w-full">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Directory</h3>
          <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Folder className="w-4 h-4" />
            <span className="font-mono">{currentPath}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <button
              onClick={goUp}
              disabled={currentPath === '/'}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                currentPath === '/'
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800'
              }`}
            >
              <FolderUp className="w-4 h-4" />
              <span>Go up</span>
            </button>
          </div>

          <div className="space-y-1 max-h-96 overflow-y-auto">
            {getCurrentDirectories().map((dir) => (
              <button
                key={dir}
                onClick={() => handleSelect(dir)}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Folder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-900 dark:text-white font-medium">{dir}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Select This Directory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}