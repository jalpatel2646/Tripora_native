import { Router } from 'express';
import { Trip } from '../models/Trip';

const router = Router();

// Create new trip
router.post('/', async (req, res) => {
  try {
    const newTrip = new Trip(req.body);
    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get all trips
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.json(trips);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get single trip
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
