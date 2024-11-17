import React, { useState } from 'react';
import { Project, Todo, Note } from '../types';
import { ListTodo, StickyNote, Plus, Trash2, Edit2, Check, X, Eye, EyeOff, Clock } from 'lucide-react';
import { MarkdownEditor } from './MarkdownEditor';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ... rest of the imports remain the same ...

export function ProjectView({
  project,
  todos,
  notes,
  onAddTodo,
  onToggleTodo,
  onAddNote,
  onDeleteTodo,
  onDeleteNote,
  onUpdateProject,
  onUpdateTodo,
  onUpdateNote,
  canEdit,
}: ProjectViewProps) {
  // ... existing state declarations remain the same ...

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return d.toLocaleDateString([], { weekday: 'long' });
    } else {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const now = new Date().toISOString();
      onAddTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      const now = new Date().toISOString();
      onAddNote(newNote.trim());
      setNewNote('');
    }
  };

  // ... rest of the existing functions remain the same ...

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* ... Project header section remains the same ... */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Todos Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
            {/* ... Todo header and form remain the same ... */}

            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group"
                >
                  {/* ... Checkbox and title section remain the same ... */}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        className={`prose dark:prose-invert max-w-none ${
                          todo.completed ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {todo.title}
                      </ReactMarkdown>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center ml-2">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(todo.updatedAt)}
                      </span>
                    </div>
                  </div>
                  
                  {/* ... Action buttons remain the same ... */}
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
            {/* ... Notes header and form remain the same ... */}

            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg group relative"
                >
                  {editingNoteId === note.id ? (
                    /* ... Edit mode remains the same ... */
                    <div>Existing edit mode content</div>
                  ) : (
                    <>
                      <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {note.content}
                        </ReactMarkdown>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(note.updatedAt)}
                      </div>
                      {/* ... Action buttons remain the same ... */}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}