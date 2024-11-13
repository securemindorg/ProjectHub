import React, { useState, useEffect } from 'react';
import { Project, Todo, Note } from './types';
import { storage } from './utils/storage';
import { Sidebar } from './components/Sidebar';
import { ProjectView } from './components/ProjectView';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Load initial data from localStorage
    setProjects(storage.getProjects());
    setTodos(storage.getTodos());
    setNotes(storage.getNotes());
  }, []);

  const handleNewProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: `Project ${projects.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    storage.setProjects(updatedProjects);
    setSelectedProjectId(newProject.id);
  };

  const handleAddTodo = (title: string) => {
    if (!selectedProjectId) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      projectId: selectedProjectId,
      title,
      completed: false,
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    storage.setTodos(updatedTodos);
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

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const projectTodos = todos.filter((todo) => todo.projectId === selectedProjectId);
  const projectNotes = notes.filter((note) => note.projectId === selectedProjectId);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onNewProject={handleNewProject}
        onLogout={() => {}}
      />
      {selectedProject ? (
        <ProjectView
          project={selectedProject}
          todos={projectTodos}
          notes={projectNotes}
          onAddTodo={handleAddTodo}
          onToggleTodo={handleToggleTodo}
          onAddNote={handleAddNote}
          onDeleteTodo={handleDeleteTodo}
          onDeleteNote={handleDeleteNote}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Welcome to ProjectHub
            </h2>
            <p className="text-gray-500">
              Select a project or create a new one to get started
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;