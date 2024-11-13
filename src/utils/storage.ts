import { Project, Todo, Note } from '../types';

const STORAGE_KEYS = {
  PROJECTS: 'projects',
  TODOS: 'todos',
  NOTES: 'notes',
  USER: 'user',
};

export const storage = {
  getProjects: (): Project[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
  },

  setProjects: (projects: Project[]) => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },

  getTodos: (): Todo[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TODOS) || '[]');
  },

  setTodos: (todos: Todo[]) => {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  },

  getNotes: (): Note[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || '[]');
  },

  setNotes: (notes: Note[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  getUser: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
  },

  setUser: (user: any) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clear: () => {
    localStorage.clear();
  },
};