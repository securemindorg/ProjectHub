import React, { useState, useEffect, useMemo } from 'react';
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
import { useAuth } from './hooks/useAuth';
import { Project, Todo, Note } from './types';
import { API_BASE_URL } from './config';

function App() {
  const { user, initialized, login, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') === 'dark';
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
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

  // Fetch projects, todos, and notes sequentially
  useEffect(() => {
    if (user) {
      const fetchProjectsAndData = async () => {
        try {
          // Fetch Projects
          const projectsResponse = await fetch(`${API_BASE_URL}/api/projects`);
          if (!projectsResponse.ok) throw new Error('Failed to fetch projects');
          const projectsData = await projectsResponse.json();
          const userProjects = projectsData.filter((p: Project) => p.userIds.includes(user.id) || user.isAdmin);
          setProjects(userProjects);

          // Fetch Todos
          const todosResponse = await fetch(`${API_BASE_URL}/api/todos`);
          if (!todosResponse.ok) throw new Error('Failed to fetch todos');
          const todosData = await todosResponse.json();
          setTodos(todosData.filter((todo: Todo) => userProjects.some((project) => project.id === todo.projectId)));

          // Fetch Notes
          const notesResponse = await fetch(`${API_BASE_URL}/api/notes`);
          if (!notesResponse.ok) throw new Error('Failed to fetch notes');
          const notesData = await notesResponse.json();
          setNotes(notesData.filter((note: Note) => userProjects.some((project) => project.id === note.projectId)));
        } catch (error) {
          console.error('Error fetching projects, todos, or notes:', error);
        }
      };

      fetchProjectsAndData();
    }
  }, [user]);

  const handleLogout = () => {
    console.log("Logging out...");
    logout(); // Logout user via the useAuth hook
    setProjects([]);
    setTodos([]);
    setNotes([]);
    setSelectedProjectId(null);
    setShowAdminPanel(false);
    setShowDashboard(true);
    window.location.href = '/login'; // Redirect user to the login page
  };

const handleNewProject = async () => {
  if (!user || !user.id) {
    console.error("User not authenticated or missing ID, cannot create project");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Project ${projects.length + 1}`,
        ownerId: user.id, // Ensure ownerId is sent properly
        userIds: [user.id], // Including the owner as part of userIds
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create project: ${await response.text()}`);
    }

    const project = await response.json();
    setProjects((prev) => [...prev, project]);
  } catch (error) {
    console.error('Error creating project:', error);
  }
};


  const handleUpdateProject = (updatedProject: Project) => {
    fetch(`${API_BASE_URL}/api/projects/${updatedProject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProject),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update project');
        }
        // Handle the response properly, only parse if there’s content
        if (res.status === 204) {
          // No content, just update the project in the UI
          setProjects((prev) =>
            prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
          );
        } else {
          // If the response is not 204, parse the JSON
          return res.json();
        }
      })
      .then((data) => {
        // If there is response data, update the project
        if (data) {
          setProjects((prev) =>
            prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
          );
        }
      })
      .catch((err) => console.error('Error updating project:', err));
  };

const fetchProjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`, // Replace with your auth token
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const projects = await response.json();
    setProjects(
      projects.filter((p: Project) => p.userIds.includes(user.id) || user.isAdmin)
    );
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

useEffect(() => {
  if (user) {
    fetchProjects();
  }
}, [user]);

// Fetch todos
  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/todos`);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const todosData = await response.json();
      setTodos(todosData.filter((todo: Todo) => projects.some((project) => project.id === todo.projectId)));
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const notesData = await response.json();
      setNotes(notesData.filter((note: Note) => projects.some((project) => project.id === note.projectId)));
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };


  const handleAddTodo = async (title: string) => {
    if (!selectedProjectId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          projectId: selectedProjectId,
        }),
      });

      if (!response.ok) throw new Error('Failed to create todo');
      const todo = await response.json();
      setTodos((prev) => [...prev, todo]);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleAddNote = async (content: string) => {
    if (!selectedProjectId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          projectId: selectedProjectId,
        }),
      });

      if (!response.ok) throw new Error('Failed to create note');
      const note = await response.json();
      setNotes((prev) => [...prev, note]);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateTodo = async (updatedTodo: Todo) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/todos/${updatedTodo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const todo = await response.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? todo : t))
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleUpdateNote = async (updatedNote: Note) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/${updatedNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      const note = await response.json();
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? note : n))
      );
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleToggleTodo = async (todoId: string) => {
  try {
    // Find the Todo item to be toggled
    const todoToUpdate = todos.find((todo) => todo.id === todoId);
    if (!todoToUpdate) {
      throw new Error('Todo not found');
    }

    // Update the completed status
    const updatedTodo = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
      updatedAt: new Date().toISOString(),
    };

    // Send the updated Todo to the backend
    const response = await fetch(`${API_BASE_URL}/api/todos/${todoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo),
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }

    // Update the state with the modified Todo
    setTodos((prev) =>
      prev.map((todo) => (todo.id === todoId ? updatedTodo : todo))
    );
  } catch (error) {
    console.error('Error toggling todo:', error);
  }
};

const handleDeleteTodo = async (todoId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/todos/${todoId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }

    // Update the state by filtering out the deleted todo
    setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};

const handleDeleteNote = async (noteId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notes/${noteId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to delete note');
    }

    // Update the state by filtering out the deleted note
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  } catch (error) {
    console.error('Error deleting note:', error);
  }
};

const handleSelectProject = (projectId: string) => {
  setSelectedProjectId(projectId);
  setShowAdminPanel(false);
  setShowDashboard(false);
};


  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

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
                  <Dashboard projects={projects} todos={todos} onSelectProject={handleSelectProject} />
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
                  onUpdateProject={handleUpdateProject}
                  onUpdateTodo={handleUpdateTodo} // fixed 11/28/2024
                  onUpdateNote={handleUpdateNote} // fixed 11/28/2024
                  onToggleTodo={handleToggleTodo} // fixed 11/28/2024
                  onDeleteTodo={handleDeleteTodo} // fixed 11/28/2024
                  onDeleteNote={handleDeleteNote} // fixed 11/28/2024
                  canEdit={user?.isAdmin || selectedProject?.ownerId === user?.id}
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

export default App;
