import React, { useState } from 'react';
import { Project, Todo, Note } from '../types';
import { ListTodo, StickyNote, Plus, Trash2, Edit2, Check, X, Eye, EyeOff } from 'lucide-react';
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
  const [editingProjectName, setEditingProjectName] = useState(false);
  const [editedProjectName, setEditedProjectName] = useState(project.name);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<{ [key: string]: boolean }>({});

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

  const handleProjectNameSave = () => {
    if (editedProjectName.trim() && editedProjectName !== project.name) {
      onUpdateProject({
        ...project,
        name: editedProjectName.trim(),
        updatedAt: new Date().toISOString(),
      });
    }
    setEditingProjectName(false);
  };

  const handleTodoSave = (todo: Todo, newTitle: string) => {
    if (newTitle.trim() && newTitle !== todo.title) {
      onUpdateTodo({
        ...todo,
        title: newTitle.trim(),
        updatedAt: new Date().toISOString(),
      });
    }
    setEditingTodoId(null);
  };

  const toggleNotePreview = (noteId: string) => {
    setPreviewMode(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          {editingProjectName ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editedProjectName}
                onChange={(e) => setEditedProjectName(e.target.value)}
                className="text-3xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none dark:text-white"
                autoFocus
              />
              <button
                onClick={handleProjectNameSave}
                className="p-1 text-green-600 hover:bg-green-100 rounded"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setEditingProjectName(false);
                  setEditedProjectName(project.name);
                }}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {project.name}
              </h1>
              {canEdit && (
                <button
                  onClick={() => setEditingProjectName(true)}
                  className="p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Todos Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <ListTodo className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold dark:text-white">Tasks</h2>
            </div>

            {canEdit && (
              <form onSubmit={handleAddTodo} className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggleTodo(todo.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    disabled={!canEdit}
                  />
                  {editingTodoId === todo.id ? (
                    <div className="flex-1 flex items-center space-x-2">
                      <input
                        type="text"
                        value={todo.title}
                        onChange={(e) =>
                          onUpdateTodo({ ...todo, title: e.target.value })  // Ensure this function is available
                        }
                        className="flex-1 px-2 py-1 bg-white dark:bg-gray-700 border border-blue-500 rounded focus:outline-none dark:text-white"
                        autoFocus
                      />
                      <button
                        onClick={() => handleTodoSave(todo, todo.title)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingTodoId(null)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        className={`prose dark:prose-invert max-w-none ${
                          todo.completed ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {todo.title}
                      </ReactMarkdown>
                    </div>
                  )}
                  {canEdit && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
                      <button
                        onClick={() => setEditingTodoId(todo.id)}
                        className="p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTodo(todo.id)}
                        className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <StickyNote className="w-5 h-5 text-yellow-600" />
              <h2 className="text-xl font-semibold dark:text-white">Notes</h2>
            </div>

            {canEdit && (
              <form onSubmit={handleAddNote} className="mb-4">
                <MarkdownEditor
                  content={newNote}
                  onChange={setNewNote}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Add Note
                  </button>
                </div>
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
                        content={note.content}
                        onChange={(content) => onUpdateNote({ ...note, content })}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          Save
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
                      {canEdit && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex items-center space-x-1">
                          <button
                            onClick={() => toggleNotePreview(note.id)}
                            className="p-1 text-gray-500 hover:bg-yellow-100 dark:hover:bg-yellow-800 rounded transition-colors"
                          >
                            {previewMode[note.id] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setEditingNoteId(note.id)}
                            className="p-1 text-gray-500 hover:bg-yellow-100 dark:hover:bg-yellow-800 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteNote(note.id)}
                            className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
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
