import React, { useState } from 'react';
import { Project, Todo, Note } from '../types';
import { ListTodo, StickyNote, Plus, Trash2, Edit2, Check, X, Eye, EyeOff, Clock, Circle, CheckCircle2 } from 'lucide-react';
import { MarkdownEditor } from './MarkdownEditor';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProjectViewProps {
  project: Project;
  todos: Todo[];
  notes: Note[];
  onAddTodo: (title: string) => void;
  onToggleTodo: (todoId: string) => void;
  onAddNote: (content: string) => void;
  onDeleteTodo: (todoId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onUpdateProject: (project: Project) => void;
  onUpdateTodo: (todo: Todo) => void;
  onUpdateNote: (note: Note) => void;
  canEdit: boolean;
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
  onUpdateProject,
  onUpdateTodo,
  onUpdateNote,
  canEdit,
}: ProjectViewProps) {
  const [newTodo, setNewTodo] = useState('');
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

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

  const handleEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingNoteContent(note.content);
  };

  const handleSaveNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      onUpdateNote({
        ...note,
        content: editingNoteContent,
        updatedAt: new Date().toISOString(),
      });
    }
    setEditingNoteId(null);
    setEditingNoteContent('');
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingNoteContent('');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Todos Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <ListTodo className="w-5 h-5 mr-2" />
                Tasks
              </h2>
            </div>

            {canEdit && (
              <form onSubmit={handleAddTodo} className="mb-4">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a new task..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </form>
            )}

            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group"
                >
                  <button
                    onClick={() => onToggleTodo(todo.id)}
                    className={`flex-shrink-0 ${!canEdit && 'cursor-not-allowed'}`}
                    disabled={!canEdit}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
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

                  {canEdit && (
                    <button
                      onClick={() => onDeleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:bg-red-100 rounded transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <StickyNote className="w-5 h-5 mr-2" />
                Notes
              </h2>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {showPreview ? (
                  <Edit2 className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {canEdit && (
              <form onSubmit={handleAddNote} className="mb-4">
                <MarkdownEditor
                  content={newNote}
                  onChange={setNewNote}
                  preview={showPreview}
                />
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Note
                </button>
              </form>
            )}

            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg group relative"
                >
                  {editingNoteId === note.id ? (
                    <div className="space-y-2">
                      <MarkdownEditor
                        content={editingNoteContent}
                        onChange={setEditingNoteContent}
                        preview={showPreview}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSaveNote(note.id)}
                          className="px-3 py-1 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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
                      {canEdit && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex space-x-1">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteNote(note.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
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