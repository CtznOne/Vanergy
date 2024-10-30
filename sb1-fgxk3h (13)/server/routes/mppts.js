import express from 'express';
import MPPT from '../models/MPPT.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const mppts = await MPPT.find();
    res.json(mppts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching MPPTs' });
  }
});

export default router;