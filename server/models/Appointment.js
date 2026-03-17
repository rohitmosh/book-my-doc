import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: { type: String, required: true },
  specialty: { type: String },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'in-progress', 'completed'],
    default: 'pending',
  },
  symptoms: { type: String },
  prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
