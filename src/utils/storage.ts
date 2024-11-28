import { Project, Todo, Note, User } from '../types';

const STORAGE_KEYS = {
  USERS: 'users',
  PROJECTS: 'projects',
  TODOS: 'todos',
  NOTES: 'notes',
  CURRENT_USER: 'currentUser',
  DATA_PATH: 'dataPath',
};

export const storage = {
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  setUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getUser: (username: string): User | undefined => {
    const users = storage.getUsers();
    console.log(`Looking for user: ${username}`);
    console.log('All users:', users);
    return users.find((user) => user.username === username);
  },

  addUser: (user: User) => {
    if (!user.username || !user.password || typeof user.isAdmin !== 'boolean') {
      throw new Error('Invalid user object');
    }
    const users = storage.getUsers();
    const existingUser = users.find((u) => u.username === user.username);
    if (existingUser) {
      throw new Error('User already exists');
    }
    users.push(user);
    storage.setUsers(users);
  },

    setCurrentUser: (user: User | null) => {
    if (user) {
      console.log('Setting current user:', user); // Debug log
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      console.log('Clearing current user'); // Debug log
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    },

    getCurrentUser: (): User | null => {
      const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
      console.log('Getting current user:', user); // Debug log
      return user;
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

  getDataPath: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.DATA_PATH);
  },

  setDataPath: (path: string) => {
    localStorage.setItem(STORAGE_KEYS.DATA_PATH, path);
  },

  clear: () => {
    localStorage.clear();
  },
};
