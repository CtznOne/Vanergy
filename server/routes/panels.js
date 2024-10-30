import express from 'express';
import Panel from '../models/Panel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const panels = await Panel.find();
    res.json(panels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching panels' });
  }
});

export default router;