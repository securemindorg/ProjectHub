import { Project, Todo, Note, User } from '../types';

const STORAGE_KEYS = {
  USERS: 'users',
  PROJECTS: 'projects',
  TODOS: 'todos',
  NOTES: 'notes',
  CURRENT_USER: 'currentUser',
};

export const storage = {
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  setUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

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

  clear: () => {
    localStorage.clear();
  },
};