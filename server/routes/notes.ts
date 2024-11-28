import { Router } from 'express';
import { fileStorage } from '../services/storage';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const notes = await fileStorage.getNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

router.post('/', async (req, res) => {
  try {
    const note = await fileStorage.createNote(req.body);
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

export default router;