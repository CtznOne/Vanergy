import express from 'express';
import Battery from '../models/Battery.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('Fetching batteries...');
    const batteries = await Battery.find();
    console.log('Found batteries:', batteries);
    res.json(batteries);
  } catch (error) {
    console.error('Error fetching batteries:', error);
    res.status(500).json({ message: 'Error fetching batteries', error: error.message });
  }
});

export default router;