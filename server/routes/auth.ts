import { Router } from 'express';
import { fileStorage } from '../services/storage';

const router = Router();

router.post('/register', async (req, res) => {
  const { username, password, dataPath } = req.body;

  if (!dataPath) {
    return res.status(400).json({ error: 'Data path is required' });
  }

  try {
    // Initialize storage before creating the user
    await fileStorage.initialize(dataPath);

    const user = await fileStorage.createUser(username, password);
    res.status(201).json(user);
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Registration failed',
    });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await fileStorage.validateUser(username, password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
