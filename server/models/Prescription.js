import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  duration: String,
  instructions: String,
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  doctorName: { type: String, required: true },
  patientName: { type: String, required: true },
  date: { type: String, required: true },
  diagnosis: { type: String, required: true },
  symptoms: [{ type: String }],
  medications: [medicationSchema],
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model('Prescription', prescriptionSchema);
