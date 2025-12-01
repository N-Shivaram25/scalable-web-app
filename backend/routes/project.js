const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// GET all projects for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id })
      .sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// GET single project by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
});

// CREATE new project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, category, status, startDate, endDate, thumbnail, githubLink, liveLink } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    if (name.trim().length > 200) {
      return res.status(400).json({ message: 'Project name must be less than 200 characters' });
    }

    const project = new Project({
      userId: req.user.id,
      name: name.trim(),
      description: description || '',
      category: category || 'Web App',
      status: status || 'Not Started',
      startDate: startDate || null,
      endDate: endDate || null,
      thumbnail: thumbnail || '',
      githubLink: githubLink || '',
      liveLink: liveLink || '',
      owner: req.user.name || 'Unknown'
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Failed to create project' });
  }
});

// UPDATE project
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, category, status, startDate, endDate, thumbnail, githubLink, liveLink } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    if (name.trim().length > 200) {
      return res.status(400).json({ message: 'Project name must be less than 200 characters' });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        name: name.trim(),
        description: description || '',
        category: category || 'Web App',
        status: status || 'Not Started',
        startDate: startDate || null,
        endDate: endDate || null,
        thumbnail: thumbnail || '',
        githubLink: githubLink || '',
        liveLink: liveLink || '',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

// DELETE project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

module.exports = router;
