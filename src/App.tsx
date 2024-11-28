import React, { useState, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { ProjectView } from './components/ProjectView';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { ThemeToggle } from './components/ThemeToggle';
import { UserProfile } from './components/UserProfile';
import { Dashboard } from './components/Dashboard';
import { StorageSetup } from './components/StorageSetup';
import { storage } from './utils/storage';
import { useAuth } from './hooks/useAuth';
import { Project, Todo, Note } from './types';

function App() {
  const { user, initialized, login } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') === 'dark';
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
        .matches;
      return saved ?? prefersDark;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    if (user) {
      setProjects(
        storage
          .getProjects()
          .filter((p) => p.userIds.includes(user.id) || user.isAdmin)
      );
      setTodos(storage.getTodos());
      setNotes(storage.getNotes());
    } else {
      const currentUser = storage.getCurrentUser();
      if (currentUser) {
        setProjects(
          storage
            .getProjects()
            .filter(
              (p) => p.userIds.includes(currentUser.id) || currentUser.isAdmin
            )
        );
        setTodos(storage.getTodos());
        setNotes(storage.getNotes());
      }
    }
  }, [user]);

  const handleNewProject = () => {
    if (!user) return;

    const newProject: Project = {
      id: crypto.randomUUID(),
      name: `Project ${projects.length + 1}`,
      ownerId: user.id,
      userIds: [user.id],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    storage.setProjects(updatedProjects);
    setSelectedProjectId(newProject.id);
    setShowAdminPanel(false);
    setShowDashboard(false);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    const updatedProjects = projects.map((p) =>
      p.id === updatedProject.id ? updatedProject : p
    );
    setProjects(updatedProjects);
    storage.setProjects(updatedProjects);
  };

  const handleAddTodo = (title: string) => {
    if (!selectedProjectId) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      projectId: selectedProjectId,
      title,
      completed: false,
      priority: 'medium',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    storage.setTodos(updatedTodos);
  };

  const handleAddNote = (content: string) => {
    if (!selectedProjectId) return;

    const newNote: Note = {
      id: crypto.randomUUID(),
      projectId: selectedProjectId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    storage.setNotes(updatedNotes);
  };

  const handleToggleTodo = (todoId: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === todoId
        ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
        : todo
    );
    setTodos(updatedTodos);
    storage.setTodos(updatedTodos);
  };

  const handleDeleteTodo = (todoId: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== todoId);
    setTodos(updatedTodos);
    storage.setTodos(updatedTodos);
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
    storage.setNotes(updatedNotes);
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    setTodos(updatedTodos);
    storage.setTodos(updatedTodos);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
    storage.setNotes(updatedNotes);
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const routes = createRoutesFromElements(
    <>
      <Route path="/setup" element={<StorageSetup onComplete={login} />} />
      <Route path="/login" element={<Login onLogin={login} />} />
      <Route
        path="/dashboard"
        element={
          <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={(id) => {
                setSelectedProjectId(id);
                setShowAdminPanel(false);
                setShowDashboard(false);
              }}
              onNewProject={handleNewProject}
              user={user}
              onAdminPanel={() => {
                setShowAdminPanel(true);
                setSelectedProjectId(null);
                setShowDashboard(false);
              }}
              onDashboard={() => {
                setShowDashboard(true);
                setSelectedProjectId(null);
                setShowAdminPanel(false);
              }}
            />
            <div className="flex-1 flex flex-col">
              <div className="p-4 flex justify-between items-center bg-white dark:bg-gray-900 shadow-sm">
                {user ? (
                  <UserProfile user={user} />
                ) : (
                  <div>No user information available</div>
                )}
                <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
              </div>
              <div className="flex-1">
                {showAdminPanel ? (
                  <AdminPanel currentUser={user!} />
                ) : showDashboard ? (
                  <Dashboard projects={projects} todos={todos} />
                ) : selectedProject ? (
                  <ProjectView
                    project={selectedProject}
                    todos={todos.filter(
                      (todo) => todo.projectId === selectedProject.id
                    )}
                    notes={notes.filter(
                      (note) => note.projectId === selectedProject.id
                    )}
                    onAddTodo={handleAddTodo}
                    onAddNote={handleAddNote}
                    onToggleTodo={handleToggleTodo}
                    onDeleteTodo={handleDeleteTodo}
                    onDeleteNote={handleDeleteNote}
                    onUpdateProject={handleUpdateProject}
                    onUpdateTodo={handleUpdateTodo}
                    onUpdateNote={handleUpdateNote}
                    canEdit={
                      user?.isAdmin || selectedProject?.ownerId === user?.id
                    }
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    <div className="text-center">
                      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Welcome to ProjectHub
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        Select a project or create a new one to get started
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      />
      {user?.isAdmin && <Route path="/admin" element={<AdminPanel />} />}
      <Route
        path="*"
        element={
          initialized ? (
            <Navigate to={user ? '/dashboard' : '/login'} replace />
          ) : (
            <Navigate to="/setup" replace />
          )
        }
      />
    </>
  );

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}

// Add the default export at the end of the file
export default App;
