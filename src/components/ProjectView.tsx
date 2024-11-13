import React, { useState } from 'react';
import { Project, Todo, Note } from '../types';
import { ListTodo, StickyNote, Plus, Trash2 } from 'lucide-react';

interface ProjectViewProps {
  project: Project;
  todos: Todo[];
  notes: Note[];
  onAddTodo: (title: string) => void;
  onToggleTodo: (todoId: string) => void;
  onAddNote: (content: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export function ProjectView({
  project,
  todos,
  notes,
  onAddTodo,
  onToggleTodo,
  onAddNote,
  onDeleteTodo,
  onDeleteNote,
}: ProjectViewProps) {
  const [newTodo, setNewTodo] = useState('');
  const [newNote, setNewNote] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      onAddTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote(newNote.trim());
      setNewNote('');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{project.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Todos Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <ListTodo className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Tasks</h2>
            </div>

            <form onSubmit={handleAddTodo} className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg group"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggleTodo(todo.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span
                    className={`flex-1 ${
                      todo.completed ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {todo.title}
                  </span>
                  <button
                    onClick={() => onDeleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <StickyNote className="w-5 h-5 text-yellow-600" />
              <h2 className="text-xl font-semibold">Notes</h2>
            </div>

            <form onSubmit={handleAddNote} className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a new note..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 bg-yellow-50 rounded-lg group relative"
                >
                  <p className="text-gray-800">{note.content}</p>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}