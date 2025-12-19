const express = require('express');
const { db } = require('../db');
const { tasks } = require('../db/schema');
const { eq, and } = require('drizzle-orm');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const result = await db.select()
      .from(tasks)
      .where(eq(tasks.userId, req.user.id));
    
    const formattedTasks = result.map(t => ({
      _id: t.id,
      user: t.userId,
      ...t,
    }));
    
    res.json(formattedTasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title } = req.body;
    
    const [task] = await db.insert(tasks).values({
      userId: req.user.id,
      title,
    }).returning();
    
    res.json({ _id: task.id, user: task.userId, ...task });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { title, completed } = req.body;
    
    const [task] = await db.update(tasks)
      .set({ title, completed })
      .where(and(
        eq(tasks.id, parseInt(req.params.id)),
        eq(tasks.userId, req.user.id)
      ))
      .returning();
    
    res.json({ _id: task.id, user: task.userId, ...task });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.delete(tasks)
      .where(and(
        eq(tasks.id, parseInt(req.params.id)),
        eq(tasks.userId, req.user.id)
      ));
    
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
