import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize the authentication state
    const currentUser = storage.getCurrentUser();
    console.log('Initializing Auth - Current User:', currentUser);
    if (currentUser) {
      setUser(currentUser);
    }
    setInitialized(true); // Mark initialization complete
  }, []);

  const initialize = async (dataPath: string) => {
    storage.setDataPath(dataPath);
  };

    const login = async (username: string, password: string) => {
    console.log('Looking for user during login:', username); // Debug log
    const storedUser = storage.getUser(username);
    console.log('Found user:', storedUser); // Debug log
    if (storedUser && storedUser.password === password) {
        storage.setCurrentUser(storedUser);
        setUser(storedUser);
        return storedUser;
    }
    throw new Error('Invalid username or password');
    };

  const register = async ({ username, password, isAdmin }: { username: string; password: string; isAdmin: boolean }) => {
    const existingUser = storage.getUser(username);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const newUser = { username, password, isAdmin };
    storage.addUser(newUser);
    storage.setCurrentUser(newUser); // Persist the user in storage
    setUser(newUser);
    return newUser;
  };

  return { user, initialized, initialize, login, register };
};
