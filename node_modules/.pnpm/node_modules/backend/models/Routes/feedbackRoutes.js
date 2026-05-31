import express from 'express';
import Feedback from '../Feedback.js';

const router = express.Router();

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const { userId, resumeId } = req.body;

    // Check if already submitted for this resume
    const existing = await Feedback.findOne({ userId, resumeId });
    if (existing) {
      return res.status(409).json({ message: 'Already submitted' });
    }

    const feedback = await Feedback.create(req.body);
    res.json({ success: true, id: feedback._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// Check if feedback exists for user + resume
router.get('/check/:userId/:resumeId', async (req, res) => {
  try {
    const { userId, resumeId } = req.params;
    const existing = await Feedback.findOne({ userId, resumeId });
    res.json({ exists: !!existing });
  } catch (err) {
    res.status(500).json({ exists: false });
  }
});

// Check by userId only (fallback)
router.get('/check/:userId', async (req, res) => {
  res.json({ exists: false });
});

// Get all feedback (admin)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback' });
  }
});

export default router;