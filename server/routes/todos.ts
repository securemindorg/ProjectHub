import { Router } from 'express';
import { fileStorage } from '../services/storage';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const todos = await fileStorage.getTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const todo = await fileStorage.createTodo(req.body);
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

export default router;