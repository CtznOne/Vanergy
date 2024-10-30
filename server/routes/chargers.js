import express from 'express';
import Charger from '../models/Charger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const chargers = await Charger.find();
    res.json(chargers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chargers' });
  }
});

export default router;