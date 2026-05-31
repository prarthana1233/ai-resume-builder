import express from 'express';
import Resume from '../Resume.js';

const router = express.Router();

// ── POST: Save/create a resume (userId must be in body) ───────────────
router.post('/', async (req, res) => {
  try {
    const body = req.body;

    // If resume already exists (same id), update it
    if (body.id) {
      const existing = await Resume.findOne({ id: body.id });
      if (existing) {
        const updated = await Resume.findOneAndUpdate(
          { id: body.id },
          body,
          { new: true }
        );
        return res.json(updated);
      }
    }

    // Otherwise create new
    const resume = await Resume.create(body);
    res.json(resume);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error saving resume' });
  }
});

// ── GET all: Only return resumes belonging to the requesting user ──────
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.json([]);
    const resumes = await Resume.find({ userId });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resumes' });
  }
});

// ── GET single resume by id ───────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOne({ id: req.params.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resume' });
  }
});

// ── PUT: Update a resume by id ────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error updating resume' });
  }
});

// ── DELETE: Delete a resume by id ─────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await Resume.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resume' });
  }
});
// ONE-TIME migration — run once then remove
router.post('/migrate/:userId', async (req, res) => {
  try {
    const result = await Resume.updateMany(
      { $or: [{ userId: { $exists: false } }, { userId: null }, { userId: '' }] },
      { $set: { userId: req.params.userId } }
    );
    res.json({ updated: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: 'Migration failed' });
  }
});


export default router;