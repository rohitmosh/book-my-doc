import { Router } from 'express';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// GET /api/profile/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let doctorProfile = null;
    if (user.role === 'doctor' && user.doctorId) {
      doctorProfile = await Doctor.findById(user.doctorId);
    }

    res.json({ user, doctorProfile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/profile/me — update user + doctor profile
router.patch('/me', protect, async (req, res) => {
  try {
    const { doctorProfile, ...userFields } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    if (doctorProfile && user.doctorId) {
      await Doctor.findByIdAndUpdate(user.doctorId, { $set: doctorProfile });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
