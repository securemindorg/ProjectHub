// server/services/storage.ts
import { promises as fs } from 'fs';
import { join } from 'path';
import { User, Project, Todo, Note } from '../../src/types';

const INITIAL_DATA = {
  users: [],
  projects: [],
  todos: [],
  notes: [],
};

class FileStorage {
  private dataPath: string | null = null;
  private data = INITIAL_DATA;
  private initialized = false;

  // Initialize storage
  async initialize(path: string): Promise<void> {
    if (this.initialized) {
      console.warn('Storage already initialized at:', this.dataPath);
      return;
    }

    console.log('Initializing storage at path:', path);
    this.dataPath = path;

    try {
      await fs.mkdir(path, { recursive: true });
      console.log('Directory created or exists at:', path);

      try {
        const content = await fs.readFile(join(path, 'data.json'), 'utf-8');
        this.data = JSON.parse(content);
        console.log('Loaded existing data:', this.data);
      } catch (readError) {
        if (readError.code === 'ENOENT') {
          console.warn('No existing data.json found, initializing with default data');
          this.data = INITIAL_DATA;
        } else {
          console.error('Error reading data.json:', readError);
          throw new Error('Failed to read data.json');
        }
      }

      this.initialized = true;
      console.log('Storage initialized successfully at:', this.dataPath);
      await this.saveData();
    } catch (error) {
      console.error('Error initializing storage:', error);
      throw new Error('Failed to initialize storage');
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  // Load data from `data.json`
  private async loadData(): Promise<void> {
    if (!this.dataPath) {
      throw new Error('Storage path is not set');
    }

    try {
      const content = await fs.readFile(join(this.dataPath, 'data.json'), 'utf-8');
      this.data = JSON.parse(content);
      console.log('Data loaded from data.json:', this.data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn('No existing data.json found, initializing with default data');
        this.data = INITIAL_DATA; // Set to default
      } else {
        console.error('Error loading data from data.json:', error);
        throw new Error('Failed to load data.json');
      }
    }
  }

  // Delete a project by ID
  async deleteProject(projectId: string): Promise<void> {
    if (!this.initialized) {
      throw new Error('Storage not initialized');
    }

    const projectIndex = this.data.projects.findIndex((project) => project.id === projectId);

    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    // Remove the project from the list
    this.data.projects.splice(projectIndex, 1);
    await this.saveData();
    console.log(`Project with ID ${projectId} deleted successfully`);
  }

  // Save data to file
  private async saveData(): Promise<void> {
    console.log('saveData called, initialized:', this.initialized);
    if (!this.initialized || !this.dataPath) {
      console.error('Storage not initialized, cannot save data');
      throw new Error('Storage not initialized');
    }

    try {
      await fs.writeFile(
        join(this.dataPath, 'data.json'),
        JSON.stringify(this.data, null, 2)
      );
      console.log('Data successfully saved to data.json');
    } catch (err) {
      console.error('Error saving data.json:', err);
      throw new Error('Failed to save data.json');
    }
  }

  // Get all users
  async getUsers(): Promise<User[]> {
    if (!this.initialized) {
      throw new Error('Storage not initialized');
    }

    await this.loadData(); // Load the latest data
    console.log('Fetching users:', this.data.users);
    return this.data.users || [];
  }

  // Get a user by username
  async getUser(username: string): Promise<User | undefined> {
    if (!this.initialized) {
      throw new Error('Storage not initialized');
    }

    await this.loadData(); // Ensure data is up-to-date before fetching user
    console.log('Looking for user:', username, 'All users:', this.data.users);
    return this.data.users.find((user) => user.username === username);
  }

  async getTodos(): Promise<Todo[]> {
  if (!this.initialized) {
    throw new Error('Storage not initialized');
  }

  await this.loadData(); // Ensure data is up-to-date before fetching todos
  console.log('Todos loaded:', this.data.todos);
  return this.data.todos || [];
  }

  async getNotes(): Promise<Note[]> {
  if (!this.initialized) {
    throw new Error('Storage not initialized');
  }

  await this.loadData(); // Ensure data is up-to-date before fetching notes
  console.log('Notes loaded:', this.data.notes);
  return this.data.notes || [];
  }

  // Create a new user
  async createUser(newUser: User): Promise<void> {
    if (!this.initialized) {
      throw new Error('Storage not initialized');
    }

    console.log('Adding new user to storage:', newUser);
    this.data.users.push(newUser);
    await this.saveData(); // Persist the new user
    console.log('User successfully added to data.json');
  }

  // Create a note
  async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    if (!this.initialized) {
      throw new Error('Storage not initialized');
    }

    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(), // Generate a unique ID for the note
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.notes.push(newNote);
    await this.saveData();
    return newNote;
  }

  // Update a note
  async updateNote(id: string, updatedData: Partial<Note>): Promise<Note | null> {
    if (!this.initialized) {
      throw new Error('Storage not initialized');
    }

    const noteIndex = this.data.notes.findIndex((note) => note.id === id);

    if (noteIndex === -1) {
      console.warn(`Note with ID ${id} not found`);
      return null; // Note not found
    }

    const updatedNote = {
      ...this.data.notes[noteIndex],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };

    this.data.notes[noteIndex] = updatedNote;
    await this.saveData(); // Persist the updated data
    return updatedNote;
  }

  // Delete a note
  async deleteNote(id: string): Promise<boolean> {
    if (!this.initialized) {
      throw new Error('Storage not initialized');
    }

    const noteIndex = this.data.notes.findIndex((note) => note.id === id);

    if (noteIndex === -1) {
      console.warn(`Note with ID ${id} not found`);
      return false; // Note not found
    }

    this.data.notes.splice(noteIndex, 1);
    await this.saveData(); // Persist the updated data
    return true; // Successfully deleted
  }

  // Get all projects
  getProjects(): Project[] {
    if (!this.initialized) {
      throw new Error('Storage not initialized');
    }
    return this.data.projects;
  }

  // Create a new project
  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    if (!this.initialized) {
      throw new Error('Storage not initialized');
    }

    if (!project.name || !project.ownerId) {
      throw new Error('Missing project name or ownerId');
    }

    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.projects.push(newProject);
    await this.saveData();
    return newProject;
  }

  // Update project
  async updateProject(id: string, updatedData: Partial<Project>): Promise<Project | null> {
    if (!this.initialized) {
      throw new Error('Storage not initialized');
    }

    const projectIndex = this.data.projects.findIndex((project) => project.id === id);

    if (projectIndex === -1) {
      console.warn(`Project with ID ${id} not found`);
      return null;
    }

    const updatedProject = {
      ...this.data.projects[projectIndex],
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };

    this.data.projects[projectIndex] = updatedProject;
    await this.saveData();
    return updatedProject;
  }

  // Create a Todo
  async createTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    if (!this.initialized) {
      throw new Error('Storage not initialized');
    }

    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.todos.push(newTodo);
    await this.saveData();
    return newTodo;
  }

  // Other similar CRUD methods for Todos, Projects...
}

export const fileStorage = new FileStorage();
