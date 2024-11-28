import React from 'react';
import { User } from '../types';

interface UserProfileProps {
  user: User | null; // Allow null to handle the case when no user is logged in
}

export function UserProfile({ user }: UserProfileProps) {
  // Debugging log
  console.log("UserProfile - User Object:", user);

  if (!user) {
    return (
      <div className="text-gray-500 dark:text-gray-400">
        No user information available
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="bg-gray-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
        {user.username[0].toUpperCase()}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {user.username}
        </p>
        {user.isAdmin && (
          <p className="text-xs text-blue-500 dark:text-blue-300">
            Administrator
          </p>
        )}
      </div>
    </div>
  );
}
