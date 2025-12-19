const express = require('express');
const { db } = require('../db');
const { projects } = require('../db/schema');
const { eq, and, desc } = require('drizzle-orm');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const result = await db.select()
      .from(projects)
      .where(eq(projects.userId, req.user.id))
      .orderBy(desc(projects.updatedAt));
    
    const formattedProjects = result.map(p => ({
      _id: p.id,
      ...p,
    }));
    
    res.json(formattedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const [project] = await db.select()
      .from(projects)
      .where(and(
        eq(projects.id, parseInt(req.params.id)),
        eq(projects.userId, req.user.id)
      ));
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ _id: project.id, ...project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, description, category, status, startDate, endDate, thumbnail, githubLink, liveLink } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    
    if (name.trim().length > 200) {
      return res.status(400).json({ message: 'Project name must be less than 200 characters' });
    }
    
    const [project] = await db.insert(projects).values({
      userId: req.user.id,
      name: name.trim(),
      description: description || '',
      category: category || 'Web App',
      status: status || 'Not Started',
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      thumbnail: thumbnail || '',
      githubLink: githubLink || '',
      liveLink: liveLink || '',
      owner: req.user.name || 'Unknown',
    }).returning();
    
    res.status(201).json({ _id: project.id, ...project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Failed to create project' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, category, status, startDate, endDate, thumbnail, githubLink, liveLink } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    
    if (name.trim().length > 200) {
      return res.status(400).json({ message: 'Project name must be less than 200 characters' });
    }
    
    const [project] = await db.update(projects)
      .set({
        name: name.trim(),
        description: description || '',
        category: category || 'Web App',
        status: status || 'Not Started',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        thumbnail: thumbnail || '',
        githubLink: githubLink || '',
        liveLink: liveLink || '',
        updatedAt: new Date(),
      })
      .where(and(
        eq(projects.id, parseInt(req.params.id)),
        eq(projects.userId, req.user.id)
      ))
      .returning();
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ _id: project.id, ...project });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [project] = await db.delete(projects)
      .where(and(
        eq(projects.id, parseInt(req.params.id)),
        eq(projects.userId, req.user.id)
      ))
      .returning();
    
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
