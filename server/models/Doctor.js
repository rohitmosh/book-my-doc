import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  image: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  fee: { type: Number, required: true },
  experience: { type: Number, required: true },
  location: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  available: { type: Boolean, default: true },
  education: { type: String },
  about: { type: String },
  clinic: { type: String },
  slots: [{ type: String }],
  workingDays: [{ type: String }],
  workingHours: { start: { type: String }, end: { type: String } },
}, { timestamps: true });

export default mongoose.model('Doctor', doctorSchema);
