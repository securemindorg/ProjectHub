import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Fetch users to ensure data is loaded from backend
        const response = await fetch('http://localhost:3000/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const users = await response.json();
        console.log('Fetched users during Auth Initialization:', users);

        // Now get the current user from local storage (if exists)
        const currentUser = storage.getCurrentUser();
        console.log('Initializing Auth - Current User:', currentUser);

        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error initializing authentication:', error);
      } finally {
        setInitialized(true); // Mark initialization complete
      }
    };

    initializeAuth();
  }, []);

  // adds logout functionality
  const logout = () => {
    storage.removeCurrentUser(); // Clear user data from storage
    setUser(null);
  };

  // Initialize storage by calling backend API
  const initialize = async (dataPath: string) => {
    try {
      // Send the dataPath to the server to initialize storage
      const response = await fetch('http://localhost:3000/api/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataPath }),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize storage');
      }

      // If successful, save the data path to local storage
      storage.setDataPath(dataPath);
    } catch (error) {
      console.error('Error during storage initialization:', error);
      throw error;
    }
  };

  const login = async (username: string, password: string) => {
    console.log('Looking for user during login:', username); // Debug log

    try {
      // Make an API request to get the user data from the backend
      const response = await fetch(`http://localhost:3000/api/users?username=${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const storedUser = await response.json();
      console.log('Found user:', storedUser); // Debug log

      if (storedUser && storedUser.password === password) {
        storage.setCurrentUser(storedUser);
        setUser(storedUser);
        return storedUser;
      }
      throw new Error('Invalid username or password');
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const register = async ({ username, password, isAdmin }: { username: string; password: string; isAdmin: boolean }) => {
    try {
      console.log('Registering user:', { username, password, isAdmin }); // Debugging log

      // Make an API request to create a user in the backend
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, isAdmin }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const newUser = await response.json();
      storage.setCurrentUser(newUser); // Store current user in the client-side storage
      setUser(newUser);

      console.log('User successfully registered and saved:', newUser); // Debugging log
      return newUser;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  return { user, initialized, initialize, login, register };
};
