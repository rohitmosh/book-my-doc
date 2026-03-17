import { Router } from 'express';
import Doctor from '../models/Doctor.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// GET /api/doctors — list all (public)
router.get('/', async (req, res) => {
  try {
    const { specialty, gender, available } = req.query;
    const filter = {};
    if (specialty) filter.specialty = specialty;
    if (gender) filter.gender = gender;
    if (available !== undefined) filter.available = available === 'true';
    const doctors = await Doctor.find(filter);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctors/:id — single doctor (public)
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/doctors — create (protected)
router.post('/', protect, async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/doctors/:id — update (protected)
router.patch('/:id', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
