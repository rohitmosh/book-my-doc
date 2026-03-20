import { Router } from 'express';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// GET /api/appointments — get appointments for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const { role, id } = req.user;
    let filter;
    if (role === 'doctor') {
      // appointments use the Doctor doc's _id, not the User's _id
      const user = await User.findById(id).select('doctorId');
      filter = { doctorId: user?.doctorId || id };
    } else {
      filter = { patientId: id };
    }
    const appointments = await Appointment.find(filter).sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/appointments/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const apt = await Appointment.findById(req.params.id);
    if (!apt) return res.status(404).json({ message: 'Appointment not found' });
    res.json(apt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/appointments — book (patient)
router.post('/', protect, async (req, res) => {
  try {
    const apt = await Appointment.create({ ...req.body, patientId: req.user.id });
    res.status(201).json(apt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/appointments/:id/status — update status (doctor)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const apt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!apt) return res.status(404).json({ message: 'Appointment not found' });
    res.json(apt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/appointments/:id — cancel
router.delete('/:id', protect, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
