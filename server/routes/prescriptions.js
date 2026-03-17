import { Router } from 'express';
import Prescription from '../models/Prescription.js';
import Appointment from '../models/Appointment.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// GET /api/prescriptions — get prescriptions for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const { role, id } = req.user;
    const filter = role === 'doctor'
      ? { doctorName: { $exists: true } } // refine if you store doctorId on prescription
      : {};
    // For now, fetch by appointments belonging to the user
    const appointments = await Appointment.find(
      role === 'doctor' ? { doctorId: id } : { patientId: id }
    ).select('_id');
    const aptIds = appointments.map(a => a._id);
    const prescriptions = await Prescription.find({ appointmentId: { $in: aptIds } });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/prescriptions/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const p = await Prescription.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Prescription not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/prescriptions — doctor issues prescription
router.post('/', protect, async (req, res) => {
  try {
    const prescription = await Prescription.create(req.body);
    // Link prescription back to appointment
    await Appointment.findByIdAndUpdate(req.body.appointmentId, {
      prescriptionId: prescription._id,
      status: 'completed',
    });
    res.status(201).json(prescription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
