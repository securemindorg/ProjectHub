import { Router } from 'express';
import { fileStorage } from '../services/storage';

const router = Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await fileStorage.getProjects(); // Corrected to use 'await'
    console.log('Projects fetched:', projects); // Debugging line
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error); // Debugging line
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  try {
    const { name, ownerId } = req.body;

    // If either name or ownerId is missing, return an error
    if (!name || !ownerId) {
      console.error('Request missing project name or ownerId:', req.body);
      return res.status(400).json({ error: 'Missing project name or ownerId' });
    }

    // Validate that the ownerId exists in the user list
    const users = await fileStorage.getUsers();
    console.log('Current users in the system:', users); // Debugging log
    const ownerExists = users.some((user) => user.id === ownerId);
    if (!ownerExists) {
      console.error(`Invalid ownerId: ${ownerId} not found in users list`);
      return res.status(400).json({ error: 'Invalid ownerId' });
    }

    console.log('Creating project with:', { name, ownerId });

    const newProject = await fileStorage.createProject({ name, ownerId, userIds: [ownerId] });
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update a project by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Project ID is required' });
  }

  try {
    const updatedProject = await fileStorage.updateProject(id, updatedData);
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const projectId = req.params.id;

    // Check if project exists before attempting to delete
    const existingProject = await fileStorage.getProjects();
    if (!existingProject.find(project => project.id === projectId)) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await fileStorage.deleteProject(projectId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
