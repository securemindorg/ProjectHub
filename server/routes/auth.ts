import { Router } from 'express';
import { fileStorage } from '../services/storage';

const router = Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await fileStorage.createUser(username, password);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Registration failed' });
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