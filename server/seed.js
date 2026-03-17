import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Doctor from './models/Doctor.js';
import User from './models/User.js';
import Appointment from './models/Appointment.js';
import Prescription from './models/Prescription.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log('Connected to MongoDB');

// Clear existing data
await Promise.all([
  Doctor.deleteMany({}),
  User.deleteMany({}),
  Appointment.deleteMany({}),
  Prescription.deleteMany({}),
]);
console.log('Cleared existing collections');

// --- Seed Doctors ---
const doctors = await Doctor.insertMany([
  {
    name: 'Dr. Sarah Mitchell',
    specialty: 'Cardiologist',
    image: '',
    rating: 4.8,
    reviews: 124,
    fee: 150,
    experience: 12,
    location: 'Downtown Medical Center',
    gender: 'Female',
    available: true,
    education: 'MD, Harvard Medical School',
    about: 'Dr. Mitchell is a board-certified cardiologist specializing in preventive cardiology and heart failure management with over 12 years of clinical experience.',
    clinic: 'HeartCare Clinic, 5th Avenue',
    slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'],
  },
  {
    name: 'Dr. James Wilson',
    specialty: 'Dermatologist',
    image: '',
    rating: 4.6,
    reviews: 89,
    fee: 120,
    experience: 8,
    location: 'Westside Health Plaza',
    gender: 'Male',
    available: true,
    education: 'MD, Johns Hopkins University',
    about: 'Specializing in medical and cosmetic dermatology, Dr. Wilson treats conditions ranging from acne to skin cancer with evidence-based approaches.',
    clinic: 'SkinFirst Dermatology, Oak Street',
    slots: ['10:00', '10:30', '11:00', '11:30', '15:00', '15:30', '16:00'],
  },
  {
    name: 'Dr. Priya Sharma',
    specialty: 'Pediatrician',
    image: '',
    rating: 4.9,
    reviews: 210,
    fee: 100,
    experience: 15,
    location: "Children's Medical Hub",
    gender: 'Female',
    available: true,
    education: 'MD, Stanford University',
    about: 'Dr. Sharma is a compassionate pediatrician dedicated to providing comprehensive care for children from newborn to adolescence.',
    clinic: 'Little Stars Pediatrics, Elm Road',
    slots: ['08:00', '08:30', '09:00', '09:30', '10:00', '13:00', '13:30', '14:00'],
  },
  {
    name: 'Dr. Michael Chen',
    specialty: 'Orthopedic',
    image: '',
    rating: 4.7,
    reviews: 156,
    fee: 200,
    experience: 18,
    location: 'Sports Medicine Institute',
    gender: 'Male',
    available: true,
    education: 'MD, Yale School of Medicine',
    about: 'Expert in sports medicine and joint replacement surgery with 18 years of surgical experience and research in minimally invasive procedures.',
    clinic: 'OrthoPlus Center, Park Avenue',
    slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  },
  {
    name: 'Dr. Emily Roberts',
    specialty: 'Neurologist',
    image: '',
    rating: 4.5,
    reviews: 67,
    fee: 180,
    experience: 10,
    location: 'Neuro Health Center',
    gender: 'Female',
    available: false,
    education: 'MD, Columbia University',
    about: 'Dr. Roberts specializes in headache disorders, epilepsy, and neurodegenerative diseases, utilizing cutting-edge diagnostic technologies.',
    clinic: 'BrainHealth Neurology, River Street',
    slots: [],
  },
  {
    name: 'Dr. Robert Kim',
    specialty: 'General Physician',
    image: '',
    rating: 4.4,
    reviews: 198,
    fee: 80,
    experience: 20,
    location: 'Community Health Clinic',
    gender: 'Male',
    available: true,
    education: 'MD, University of Chicago',
    about: 'A seasoned general practitioner providing primary care, preventive medicine, and chronic disease management for the whole family.',
    clinic: 'HealthFirst Family Practice, Main Street',
    slots: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'],
  },
]);
console.log(`Seeded ${doctors.length} doctors`);

// --- Seed Users (patient + doctor accounts) ---
const hashedPassword = await bcrypt.hash('password123', 10);

const users = await User.insertMany([
  {
    name: 'John Doe',
    email: 'patient@demo.com',
    password: hashedPassword,
    role: 'patient',
    dob: '24 Jul 1993',
    location: 'New York, USA',
  },
  {
    name: 'Alice Johnson',
    email: 'alice@demo.com',
    password: hashedPassword,
    role: 'patient',
    location: 'New York, USA',
  },
  {
    name: 'Bob Martinez',
    email: 'bob@demo.com',
    password: hashedPassword,
    role: 'patient',
    location: 'New York, USA',
  },
  {
    name: 'Carol Davis',
    email: 'carol@demo.com',
    password: hashedPassword,
    role: 'patient',
    location: 'New York, USA',
  },
  {
    name: 'David Lee',
    email: 'david@demo.com',
    password: hashedPassword,
    role: 'patient',
    location: 'New York, USA',
  },
  {
    name: 'Dr. Sarah Mitchell',
    email: 'doctor@demo.com',
    password: hashedPassword,
    role: 'doctor',
    doctorId: doctors[0]._id,
  },
]);
console.log(`Seeded ${users.length} users`);

const patient   = users[0]; // John Doe
const alice     = users[1];
const bob       = users[2];
const carol     = users[3];
const david     = users[4];
const drSarah   = doctors[0];
const drPriya   = doctors[2];
const drWilson  = doctors[1];

// --- Seed Appointments ---
const appointments = await Appointment.insertMany([
  // Patient (John Doe) appointments
  {
    doctorId: drSarah._id,
    doctorName: 'Dr. Sarah Mitchell',
    specialty: 'Cardiologist',
    patientId: patient._id,
    patientName: 'John Doe',
    date: '2026-03-15',
    time: '10:00',
    status: 'completed',
    symptoms: 'Chest pain, shortness of breath',
  },
  {
    doctorId: drPriya._id,
    doctorName: 'Dr. Priya Sharma',
    specialty: 'Pediatrician',
    patientId: patient._id,
    patientName: 'John Doe',
    date: '2026-03-18',
    time: '09:30',
    status: 'scheduled',
    symptoms: 'Fever, cough',
  },
  {
    doctorId: drWilson._id,
    doctorName: 'Dr. James Wilson',
    specialty: 'Dermatologist',
    patientId: patient._id,
    patientName: 'John Doe',
    date: '2026-03-20',
    time: '11:00',
    status: 'pending',
    symptoms: 'Skin rash',
  },
  // Doctor (Sarah Mitchell) appointments from other patients
  {
    doctorId: drSarah._id,
    doctorName: 'Dr. Sarah Mitchell',
    specialty: 'Cardiologist',
    patientId: alice._id,
    patientName: 'Alice Johnson',
    date: '2026-03-12',
    time: '09:00',
    status: 'scheduled',
    symptoms: 'High blood pressure, dizziness',
  },
  {
    doctorId: drSarah._id,
    doctorName: 'Dr. Sarah Mitchell',
    specialty: 'Cardiologist',
    patientId: bob._id,
    patientName: 'Bob Martinez',
    date: '2026-03-12',
    time: '10:00',
    status: 'pending',
    symptoms: 'Irregular heartbeat',
  },
  {
    doctorId: drSarah._id,
    doctorName: 'Dr. Sarah Mitchell',
    specialty: 'Cardiologist',
    patientId: carol._id,
    patientName: 'Carol Davis',
    date: '2026-03-13',
    time: '14:00',
    status: 'in-progress',
    symptoms: 'Chest tightness after exercise',
  },
  {
    doctorId: drSarah._id,
    doctorName: 'Dr. Sarah Mitchell',
    specialty: 'Cardiologist',
    patientId: david._id,
    patientName: 'David Lee',
    date: '2026-03-10',
    time: '11:00',
    status: 'completed',
    symptoms: 'Follow-up check for stent placement',
  },
]);
console.log(`Seeded ${appointments.length} appointments`);

// --- Seed Prescriptions ---
const prescriptions = await Prescription.insertMany([
  {
    appointmentId: appointments[0]._id,
    doctorName: 'Dr. Sarah Mitchell',
    patientName: 'John Doe',
    date: '2026-03-15',
    diagnosis: 'Mild angina pectoris',
    symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue'],
    medications: [
      { name: 'Aspirin', dosage: '75mg', duration: '30 days', instructions: 'Once daily after breakfast' },
      { name: 'Atorvastatin', dosage: '20mg', duration: '30 days', instructions: 'Once daily at bedtime' },
      { name: 'Metoprolol', dosage: '25mg', duration: '14 days', instructions: 'Twice daily with meals' },
    ],
    notes: 'Patient should follow a low-sodium diet and engage in moderate exercise. Follow-up in 4 weeks.',
  },
  {
    appointmentId: appointments[6]._id,
    doctorName: 'Dr. Sarah Mitchell',
    patientName: 'David Lee',
    date: '2026-03-10',
    diagnosis: 'Post-stent follow-up — stable condition',
    symptoms: ['Routine follow-up', 'No acute symptoms'],
    medications: [
      { name: 'Clopidogrel', dosage: '75mg', duration: '90 days', instructions: 'Once daily after lunch' },
      { name: 'Rosuvastatin', dosage: '10mg', duration: '90 days', instructions: 'Once daily at bedtime' },
    ],
    notes: 'Stent site healing well. Continue dual antiplatelet therapy. Next follow-up in 3 months.',
  },
]);

// Link prescriptions back to their appointments
await Appointment.findByIdAndUpdate(appointments[0]._id, { prescriptionId: prescriptions[0]._id });
await Appointment.findByIdAndUpdate(appointments[6]._id, { prescriptionId: prescriptions[1]._id });
console.log(`Seeded ${prescriptions.length} prescriptions`);

console.log('\n✅ Database seeded successfully!');
console.log('\nDemo login credentials:');
console.log('  Patient → email: patient@demo.com  | password: password123');
console.log('  Doctor  → email: doctor@demo.com   | password: password123');

await mongoose.disconnect();
process.exit(0);
