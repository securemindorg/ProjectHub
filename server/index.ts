import express from 'express';
import cors from 'cors';
import { fileStorage } from './services/storage';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import todoRoutes from './routes/todos';
import noteRoutes from './routes/notes';
import { checkInitialized } from './middlewares/checkInitialized';
import userRoutes from './routes/users';

const app = express();
const port = 3000;

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173',  // Add the correct frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allow necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Add 'Authorization' to allowed headers
}));

app.use(express.json());

// Initialization route
app.post('/api/init', async (req, res) => {
  const { dataPath } = req.body;

  if (!dataPath) {
    return res.status(400).json({ error: 'dataPath is required' });
  }

  try {
    console.log(`Initializing storage at: ${dataPath}`);
    await fileStorage.initialize(dataPath);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to initialize storage:', error);
    res.status(500).json({ error: 'Failed to initialize storage', details: (error as Error).message });
  }
});

// Use the checkInitialized middleware for routes that need the storage initialized
app.use('/api/auth', checkInitialized, authRoutes);
app.use('/api/projects', checkInitialized, projectRoutes);
app.use('/api/todos', checkInitialized, todoRoutes);
app.use('/api/notes', checkInitialized, noteRoutes);
app.use('/api/users', userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
