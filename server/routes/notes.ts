import { Router } from 'express';
import { fileStorage } from '../services/storage';

const router = Router();

// Get all notes
router.get('/', async (req, res) => {
  try {
    console.log('Fetching notes...');
    const notes = await fileStorage.getNotes();
    console.log('Notes fetched:', notes);
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).send({ error: 'Failed to fetch notes' });
  }
});

router.post('/', async (req, res) => {
  try {
    const note = await fileStorage.createNote(req.body);  // Ensure body is passed correctly
    res.json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update a Note by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Note ID is required' });
  }

  try {
    const updatedNote = await fileStorage.updateNote(id, updatedData);
    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete a Note by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Note ID is required' });
  }

  try {
    const deleted = await fileStorage.deleteNote(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;
