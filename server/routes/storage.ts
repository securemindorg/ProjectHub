import { Router } from 'express';
import { fileStorage } from '../services/storage';

const router = Router();

// POST request to initialize the storage
router.post('/api/init', async (req, res) => {
  const { dataPath } = req.body;

  // Ensure dataPath is provided
  if (!dataPath) {
    return res.status(400).json({ error: 'Storage path is required' });
  }

  try {
    // Initialize storage with the provided data path
    await fileStorage.initializeStorage(dataPath);

    // Respond with success
    res.status(200).json({ message: 'Storage initialized successfully' });
  } catch (error) {
    // Handle any errors that occur during initialization
    console.error('Error initializing storage:', error);
    res.status(500).json({ error: 'Failed to initialize storage' });
  }
});

export default router;
