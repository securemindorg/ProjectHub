import React from 'react';
import { User } from '../types';
import { UserCircle } from 'lucide-react';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="flex items-center space-x-2">
      <UserCircle className="w-6 h-6 text-gray-500 dark:text-gray-400" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {user.username}
        {user.isAdmin && (
          <span className="ml-1 text-xs text-blue-600 dark:text-blue-400">(Admin)</span>
        )}
      </span>
    </div>
  );
}