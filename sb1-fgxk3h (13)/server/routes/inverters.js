import express from 'express';
import Inverter from '../models/Inverter.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const inverters = await Inverter.find();
    res.json(inverters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inverters' });
  }
});

export default router;