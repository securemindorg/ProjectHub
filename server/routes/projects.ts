import { Router } from 'express';
import { fileStorage } from '../services/storage';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const projects = await fileStorage.getProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/', async (req, res) => {
  try {
    const project = await fileStorage.createProject(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

export default router;