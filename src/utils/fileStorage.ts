import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { configManager } from './config';
import { User, Project, Todo, Note } from '../types';

interface StorageData {
  users: User[];
  projects: Project[];
  todos: Todo[];
  notes: Note[];
  currentUser: User | null;
}

const INITIAL_DATA: StorageData = {
  users: [],
  projects: [],
  todos: [],
  notes: [],
  currentUser: null,
};

function ensureDataDirectory(path: string) {
  try {
    mkdirSync(path, { recursive: true });
    return true;
  } catch (error) {
    console.error('Failed to create data directory:', error);
    return false;
  }
}

function readData(): StorageData {
  const dataPath = configManager.getDataPath();
  if (!dataPath) return INITIAL_DATA;

  try {
    const filePath = join(dataPath, 'data.json');
    const data = readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return INITIAL_DATA;
  }
}

function writeData(data: StorageData): boolean {
  const dataPath = configManager.getDataPath();
  if (!dataPath) return false;

  try {
    const filePath = join(dataPath, 'data.json');
    writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to write data:', error);
    return false;
  }
}

export const storage = {
  initialize: (path: string): boolean => {
    if (!configManager.init(path)) return false;
    return ensureDataDirectory(path) && writeData(INITIAL_DATA);
  },

  getUsers: (): User[] => {
    return readData().users;
  },

  setUsers: (users: User[]): boolean => {
    const data = readData();
    data.users = users;
    return writeData(data);
  },

  getCurrentUser: (): User | null => {
    return readData().currentUser;
  },

  setCurrentUser: (user: User | null): boolean => {
    const data = readData();
    data.currentUser = user;
    return writeData(data);
  },

  getProjects: (): Project[] => {
    return readData().projects;
  },

  setProjects: (projects: Project[]): boolean => {
    const data = readData();
    data.projects = projects;
    return writeData(data);
  },

  getTodos: (): Todo[] => {
    return readData().todos;
  },

  setTodos: (todos: Todo[]): boolean => {
    const data = readData();
    data.todos = todos;
    return writeData(data);
  },

  getNotes: (): Note[] => {
    return readData().notes;
  },

  setNotes: (notes: Note[]): boolean => {
    const data = readData();
    data.notes = notes;
    return writeData(data);
  },

  clear: (): boolean => {
    return writeData(INITIAL_DATA);
  },
};
