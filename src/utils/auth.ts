import { User } from '../types';
import { storage } from './storage';
import { hash, verify } from './crypto';

export const auth = {
  login: async (username: string, password: string): Promise<User | null> => {
    const users = storage.getUsers();
    const user = users.find(u => u.username === username);
    
    if (!user) return null;
    
    const isValid = await verify(password, user.passwordHash);
    return isValid ? user : null;
  },

  register: async (username: string, password: string): Promise<User> => {
    const users = storage.getUsers();
    
    if (users.some(u => u.username === username)) {
      throw new Error('Username already exists');
    }

    const passwordHash = await hash(password);
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      passwordHash,
      isAdmin: users.length === 0, // First user is admin
      createdAt: new Date().toISOString(),
    };

    storage.setUsers([...users, newUser]);
    return newUser;
  },

  changePassword: async (userId: string, newPassword: string) => {
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) throw new Error('User not found');

    const passwordHash = await hash(newPassword);
    users[userIndex] = { ...users[userIndex], passwordHash };
    storage.setUsers(users);
  },

  deleteUser: (userId: string) => {
    const users = storage.getUsers();
    storage.setUsers(users.filter(u => u.id !== userId));
  },
};