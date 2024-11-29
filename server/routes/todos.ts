import { Router } from 'express';
import { fileStorage } from '../services/storage';

const router = Router();

router.get('/', async (req, res) => {
  try {
    console.log('Fetching todos...');
    const todos = await fileStorage.getTodos();
    console.log('Todos fetched:', todos);
    res.status(200).json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).send({ error: 'Failed to fetch todos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const todo = await fileStorage.createTodo(req.body);  // Ensure body is passed correctly
    res.json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update a Todo by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Todo ID is required' });
  }

  try {
    const updatedTodo = await fileStorage.updateTodo(id, updatedData);
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a Todo by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Todo ID is required' });
  }

  try {
    const deleted = await fileStorage.deleteTodo(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

export default router;
