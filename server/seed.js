import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from './models/Doctor.js';
import User from './models/User.js';
import Appointment from './models/Appointment.js';
import Prescription from './models/Prescription.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log('Connected to MongoDB');

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
    name: 'Dr. Arjun Mehta',
    specialty: 'Cardiologist',
    image: '',
    rating: 4.8, reviews: 124, fee: 800, experience: 12,
    location: 'Apollo Hospital, Mumbai',
    gender: 'Male', available: true,
    education: 'MD, AIIMS New Delhi',
    about: 'Dr. Mehta is a board-certified cardiologist specialising in preventive cardiology and heart failure management with over 12 years of clinical experience.',
    clinic: 'HeartCare Clinic, Bandra West, Mumbai',
    slots: ['09:00','09:30','10:00','10:30','11:00','14:00','14:30','15:00'],
  },
  {
    name: 'Dr. Priya Nair',
    specialty: 'Dermatologist',
    image: '',
    rating: 4.6, reviews: 89, fee: 600, experience: 8,
    location: 'Fortis Hospital, Bangalore',
    gender: 'Female', available: true,
    education: 'MD, Kasturba Medical College',
    about: 'Specialising in medical and cosmetic dermatology, Dr. Nair treats conditions ranging from acne to skin disorders with evidence-based approaches.',
    clinic: 'SkinFirst Dermatology, Koramangala, Bangalore',
    slots: ['10:00','10:30','11:00','11:30','15:00','15:30','16:00'],
  },
  {
    name: 'Dr. Sunita Sharma',
    specialty: 'Pediatrician',
    image: '',
    rating: 4.9, reviews: 210, fee: 500, experience: 15,
    location: "Rainbow Children's Hospital, Hyderabad",
    gender: 'Female', available: true,
    education: 'MD, Osmania Medical College',
    about: 'Dr. Sharma is a compassionate pediatrician dedicated to providing comprehensive care for children from newborn to adolescence.',
    clinic: 'Little Stars Pediatrics, Jubilee Hills, Hyderabad',
    slots: ['08:00','08:30','09:00','09:30','10:00','13:00','13:30','14:00'],
  },
  {
    name: 'Dr. Rajesh Kumar',
    specialty: 'Orthopedic',
    image: '',
    rating: 4.7, reviews: 156, fee: 1000, experience: 18,
    location: 'Max Hospital, Delhi',
    gender: 'Male', available: true,
    education: 'MS Ortho, AIIMS New Delhi',
    about: 'Expert in sports medicine and joint replacement surgery with 18 years of surgical experience and research in minimally invasive procedures.',
    clinic: 'OrthoPlus Centre, Saket, New Delhi',
    slots: ['09:00','10:00','11:00','14:00','15:00','16:00'],
  },
  {
    name: 'Dr. Kavitha Reddy',
    specialty: 'Neurologist',
    image: '',
    rating: 4.5, reviews: 67, fee: 900, experience: 10,
    location: 'NIMHANS, Bangalore',
    gender: 'Female', available: false,
    education: 'DM Neurology, NIMHANS',
    about: 'Dr. Reddy specialises in headache disorders, epilepsy, and neurodegenerative diseases, utilising cutting-edge diagnostic technologies.',
    clinic: 'BrainHealth Neurology, Indiranagar, Bangalore',
    slots: [],
  },
  {
    name: 'Dr. Vikram Singh',
    specialty: 'General Physician',
    image: '',
    rating: 4.4, reviews: 198, fee: 400, experience: 20,
    location: 'Community Health Centre, Pune',
    gender: 'Male', available: true,
    education: 'MBBS, BJ Medical College, Pune',
    about: 'A seasoned general practitioner providing primary care, preventive medicine, and chronic disease management for the whole family.',
    clinic: 'HealthFirst Family Practice, FC Road, Pune',
    slots: ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','14:00','14:30','15:00'],
  },
]);
console.log(`Seeded ${doctors.length} doctors`);

// --- Helper to create user - model's pre-save hook handles hashing ---
const createUser = async (data) => {
  const { plainPassword, ...rest } = data;
  const user = new User({ ...rest, password: plainPassword, plainPassword });
  await user.save();
  return user;
};

// --- Seed Users ---
const patientUser = await createUser({
  name: 'Rahul Verma',
  email: 'rahul.verma@demo.com',
  plainPassword: 'rahul@123',
  role: 'patient',
  dob: '15 Aug 1992',
  location: 'Mumbai, Maharashtra',
});

const aliceUser = await createUser({ name: 'Ananya Iyer',    email: 'ananya.iyer@demo.com',    plainPassword: 'ananya@123',  role: 'patient', location: 'Chennai, Tamil Nadu' });
const bobUser   = await createUser({ name: 'Suresh Patel',   email: 'suresh.patel@demo.com',   plainPassword: 'suresh@123',  role: 'patient', location: 'Ahmedabad, Gujarat' });
const carolUser = await createUser({ name: 'Meena Joshi',    email: 'meena.joshi@demo.com',    plainPassword: 'meena@123',   role: 'patient', location: 'Pune, Maharashtra' });
const davidUser = await createUser({ name: 'Kiran Rao',      email: 'kiran.rao@demo.com',      plainPassword: 'kiran@123',   role: 'patient', location: 'Hyderabad, Telangana' });

const doctorUser = await createUser({
  name: 'Dr. Arjun Mehta',
  email: 'arjun.mehta@demo.com',
  plainPassword: 'arjun@123',
  role: 'doctor',
  doctorId: doctors[0]._id,
});

console.log(`Seeded 6 users`);

// --- Seed Appointments ---
const appointments = await Appointment.insertMany([
  // Rahul's appointments
  {
    doctorId: doctors[0]._id, doctorName: 'Dr. Arjun Mehta', specialty: 'Cardiologist',
    patientId: patientUser._id, patientName: 'Rahul Verma',
    date: '2026-03-15', time: '10:00', status: 'completed',
    symptoms: 'Chest pain, shortness of breath',
  },
  {
    doctorId: doctors[2]._id, doctorName: 'Dr. Sunita Sharma', specialty: 'Pediatrician',
    patientId: patientUser._id, patientName: 'Rahul Verma',
    date: '2026-03-18', time: '09:30', status: 'scheduled',
    symptoms: 'Fever, cough',
  },
  {
    doctorId: doctors[1]._id, doctorName: 'Dr. Priya Nair', specialty: 'Dermatologist',
    patientId: patientUser._id, patientName: 'Rahul Verma',
    date: '2026-03-20', time: '11:00', status: 'pending',
    symptoms: 'Skin rash',
  },
  // Dr. Arjun's patient appointments
  {
    doctorId: doctors[0]._id, doctorName: 'Dr. Arjun Mehta', specialty: 'Cardiologist',
    patientId: aliceUser._id, patientName: 'Ananya Iyer',
    date: '2026-03-12', time: '09:00', status: 'scheduled',
    symptoms: 'High blood pressure, dizziness',
  },
  {
    doctorId: doctors[0]._id, doctorName: 'Dr. Arjun Mehta', specialty: 'Cardiologist',
    patientId: bobUser._id, patientName: 'Suresh Patel',
    date: '2026-03-12', time: '10:00', status: 'pending',
    symptoms: 'Irregular heartbeat',
  },
  {
    doctorId: doctors[0]._id, doctorName: 'Dr. Arjun Mehta', specialty: 'Cardiologist',
    patientId: carolUser._id, patientName: 'Meena Joshi',
    date: '2026-03-13', time: '14:00', status: 'in-progress',
    symptoms: 'Chest tightness after exercise',
  },
  {
    doctorId: doctors[0]._id, doctorName: 'Dr. Arjun Mehta', specialty: 'Cardiologist',
    patientId: davidUser._id, patientName: 'Kiran Rao',
    date: '2026-03-10', time: '11:00', status: 'completed',
    symptoms: 'Follow-up check for stent placement',
  },
]);
console.log(`Seeded ${appointments.length} appointments`);

// --- Seed Prescriptions ---
const prescriptions = await Prescription.insertMany([
  {
    appointmentId: appointments[0]._id,
    doctorName: 'Dr. Arjun Mehta', patientName: 'Rahul Verma',
    date: '2026-03-15', diagnosis: 'Mild angina pectoris',
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
    doctorName: 'Dr. Arjun Mehta', patientName: 'Kiran Rao',
    date: '2026-03-10', diagnosis: 'Post-stent follow-up — stable condition',
    symptoms: ['Routine follow-up', 'No acute symptoms'],
    medications: [
      { name: 'Clopidogrel', dosage: '75mg', duration: '90 days', instructions: 'Once daily after lunch' },
      { name: 'Rosuvastatin', dosage: '10mg', duration: '90 days', instructions: 'Once daily at bedtime' },
    ],
    notes: 'Stent site healing well. Continue dual antiplatelet therapy. Next follow-up in 3 months.',
  },
]);

await Appointment.findByIdAndUpdate(appointments[0]._id, { prescriptionId: prescriptions[0]._id });
await Appointment.findByIdAndUpdate(appointments[6]._id, { prescriptionId: prescriptions[1]._id });
console.log(`Seeded ${prescriptions.length} prescriptions`);

console.log('\n✅ Database seeded successfully!');
console.log('\nDemo login credentials:');
console.log('  Patient → rahul.verma@demo.com   | rahul@123');
console.log('  Doctor  → arjun.mehta@demo.com   | arjun@123');
console.log('\nAll patient credentials:');
console.log('  ananya.iyer@demo.com  | ananya@123');
console.log('  suresh.patel@demo.com | suresh@123');
console.log('  meena.joshi@demo.com  | meena@123');
console.log('  kiran.rao@demo.com    | kiran@123');

await mongoose.disconnect();
process.exit(0);
