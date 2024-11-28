import axios from 'axios';
import { User, Project, Todo, Note } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const apiClient = {
  initialize: async (dataPath: string) => {
    const { data } = await api.post('/init', { dataPath });
    return data;
  },

  login: async (username: string, password: string): Promise<User> => {
    const { data } = await api.post('/auth/login', { username, password });
    return data;
  },

  register: async (username: string, password: string): Promise<User> => {
    const { data } = await api.post('/auth/register', { username, password });
    return data;
  },

  getProjects: async (): Promise<Project[]> => {
    const { data } = await api.get('/projects');
    return data;
  },

  createProject: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const { data } = await api.post('/projects', project);
    return data;
  },

  getTodos: async (): Promise<Todo[]> => {
    const { data } = await api.get('/todos');
    return data;
  },

  createTodo: async (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> => {
    const { data } = await api.post('/todos', todo);
    return data;
  },

  getNotes: async (): Promise<Note[]> => {
    const { data } = await api.get('/notes');
    return data;
  },

  createNote: async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    const { data } = await api.post('/notes', note);
    return data;
  }
};