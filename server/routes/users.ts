// server/routes/users.ts
import { Router } from 'express';
import { fileStorage } from '../services/storage';
import { User } from '../../src/types';
import crypto from 'crypto'; // Make sure to import crypto

const router = Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const username = req.query.username as string;
    const users = await fileStorage.getUsers();

    if (username) {
      const user = users.find((user) => user.username === username);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(user);
    }

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }

    // Check if the user already exists
    const users = await fileStorage.getUsers();
    if (users.some((user) => user.username === username)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      password,
      isAdmin,
      createdAt: new Date().toISOString(),
    };

    await fileStorage.createUser(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user (e.g., toggle admin status)
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body;

    await fileStorage.updateUser(userId, updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await fileStorage.deleteUser(userId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
