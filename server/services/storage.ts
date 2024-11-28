import { promises as fs } from 'fs';
import { join } from 'path';
import { User, Project, Todo, Note } from '../../src/types';
import { hash, verify } from '../utils/crypto';

interface StorageData {
  users: User[];
  projects: Project[];
  todos: Todo[];
  notes: Note[];
}

const INITIAL_DATA: StorageData = {
  users: [],
  projects: [],
  todos: [],
  notes: []
};

class FileStorage {
  private dataPath: string | null = null;
  private data: StorageData = INITIAL_DATA;

  async initialize(path: string): Promise<void> {
    this.dataPath = path;
    await fs.mkdir(path, { recursive: true });
    
    try {
      const content = await fs.readFile(join(path, 'data.json'), 'utf-8');
      this.data = JSON.parse(content);
    } catch {
      await this.saveData();
    }
  }

  private async saveData(): Promise<void> {
    if (!this.dataPath) throw new Error('Storage not initialized');
    await fs.writeFile(
      join(this.dataPath, 'data.json'),
      JSON.stringify(this.data, null, 2)
    );
  }

  async createUser(username: string, password: string): Promise<User> {
    if (this.data.users.some(u => u.username === username)) {
      throw new Error('Username already exists');
    }

    const passwordHash = await hash(password);
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      passwordHash,
      isAdmin: this.data.users.length === 0,
      createdAt: new Date().toISOString()
    };

    this.data.users.push(newUser);
    await this.saveData();
    return newUser;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = this.data.users.find(u => u.username === username);
    if (!user) return null;
    
    const isValid = await verify(password, user.passwordHash);
    return isValid ? user : null;
  }

  async getProjects(): Promise<Project[]> {
    return this.data.projects;
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.projects.push(newProject);
    await this.saveData();
    return newProject;
  }

  async getTodos(): Promise<Todo[]> {
    return this.data.todos;
  }

  async createTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.todos.push(newTodo);
    await this.saveData();
    return newTodo;
  }

  async getNotes(): Promise<Note[]> {
    return this.data.notes;
  }

  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.notes.push(newNote);
    await this.saveData();
    return newNote;
  }
}

export const fileStorage = new FileStorage();