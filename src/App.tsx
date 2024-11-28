import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import { StorageSetup } from './components/StorageSetup';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { ProjectView } from './components/ProjectView';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, initialized, login, logout } = useAuth();

  if (!initialized) {
    return <StorageSetup onComplete={login} />;
  }

  if (!user) {
    return <Login onLogin={login} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/:projectId" element={<ProjectView />} />
        {user.isAdmin && <Route path="/admin" element={<AdminPanel />} />}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;