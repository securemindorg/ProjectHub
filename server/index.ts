import express from 'express';
import cors from 'cors';
import { fileStorage } from './services/storage';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import todoRoutes from './routes/todos';
import noteRoutes from './routes/notes';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialize storage
app.post('/api/init', async (req, res) => {
  const { dataPath } = req.body;
  try {
    await fileStorage.initialize(dataPath);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize storage' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/notes', noteRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});