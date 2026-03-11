export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  reviews: number;
  fee: number;
  experience: number;
  location: string;
  gender: "Male" | "Female";
  available: boolean;
  education: string;
  about: string;
  clinic: string;
  slots: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: "pending" | "scheduled" | "in-progress" | "completed";
  patientName: string;
  symptoms?: string;
  prescriptionId?: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorName: string;
  patientName: string;
  date: string;
  diagnosis: string;
  symptoms: string[];
  medications: { name: string; dosage: string; duration: string; instructions: string }[];
  notes: string;
}

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Sarah Mitchell",
    specialty: "Cardiologist",
    image: "",
    rating: 4.8,
    reviews: 124,
    fee: 150,
    experience: 12,
    location: "Downtown Medical Center",
    gender: "Female",
    available: true,
    education: "MD, Harvard Medical School",
    about: "Dr. Mitchell is a board-certified cardiologist specializing in preventive cardiology and heart failure management with over 12 years of clinical experience.",
    clinic: "HeartCare Clinic, 5th Avenue",
    slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"],
  },
  {
    id: "d2",
    name: "Dr. James Wilson",
    specialty: "Dermatologist",
    image: "",
    rating: 4.6,
    reviews: 89,
    fee: 120,
    experience: 8,
    location: "Westside Health Plaza",
    gender: "Male",
    available: true,
    education: "MD, Johns Hopkins University",
    about: "Specializing in medical and cosmetic dermatology, Dr. Wilson treats conditions ranging from acne to skin cancer with evidence-based approaches.",
    clinic: "SkinFirst Dermatology, Oak Street",
    slots: ["10:00", "10:30", "11:00", "11:30", "15:00", "15:30", "16:00"],
  },
  {
    id: "d3",
    name: "Dr. Priya Sharma",
    specialty: "Pediatrician",
    image: "",
    rating: 4.9,
    reviews: 210,
    fee: 100,
    experience: 15,
    location: "Children's Medical Hub",
    gender: "Female",
    available: true,
    education: "MD, Stanford University",
    about: "Dr. Sharma is a compassionate pediatrician dedicated to providing comprehensive care for children from newborn to adolescence.",
    clinic: "Little Stars Pediatrics, Elm Road",
    slots: ["08:00", "08:30", "09:00", "09:30", "10:00", "13:00", "13:30", "14:00"],
  },
  {
    id: "d4",
    name: "Dr. Michael Chen",
    specialty: "Orthopedic",
    image: "",
    rating: 4.7,
    reviews: 156,
    fee: 200,
    experience: 18,
    location: "Sports Medicine Institute",
    gender: "Male",
    available: true,
    education: "MD, Yale School of Medicine",
    about: "Expert in sports medicine and joint replacement surgery with 18 years of surgical experience and research in minimally invasive procedures.",
    clinic: "OrthoPlus Center, Park Avenue",
    slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  },
  {
    id: "d5",
    name: "Dr. Emily Roberts",
    specialty: "Neurologist",
    image: "",
    rating: 4.5,
    reviews: 67,
    fee: 180,
    experience: 10,
    location: "Neuro Health Center",
    gender: "Female",
    available: false,
    education: "MD, Columbia University",
    about: "Dr. Roberts specializes in headache disorders, epilepsy, and neurodegenerative diseases, utilizing cutting-edge diagnostic technologies.",
    clinic: "BrainHealth Neurology, River Street",
    slots: [],
  },
  {
    id: "d6",
    name: "Dr. Robert Kim",
    specialty: "General Physician",
    image: "",
    rating: 4.4,
    reviews: 198,
    fee: 80,
    experience: 20,
    location: "Community Health Clinic",
    gender: "Male",
    available: true,
    education: "MD, University of Chicago",
    about: "A seasoned general practitioner providing primary care, preventive medicine, and chronic disease management for the whole family.",
    clinic: "HealthFirst Family Practice, Main Street",
    slots: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"],
  },
];

export const specialties = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedic",
  "Neurologist",
  "Gynecologist",
  "Ophthalmologist",
  "ENT Specialist",
  "Psychiatrist",
];

export const patientAppointments: Appointment[] = [
  {
    id: "a1",
    doctorId: "d1",
    doctorName: "Dr. Sarah Mitchell",
    specialty: "Cardiologist",
    date: "2026-03-15",
    time: "10:00",
    status: "completed",
    patientName: "John Doe",
    symptoms: "Chest pain, shortness of breath",
    prescriptionId: "p1",
  },
  {
    id: "a2",
    doctorId: "d3",
    doctorName: "Dr. Priya Sharma",
    specialty: "Pediatrician",
    date: "2026-03-18",
    time: "09:30",
    status: "scheduled",
    patientName: "John Doe",
    symptoms: "Fever, cough",
  },
  {
    id: "a3",
    doctorId: "d2",
    doctorName: "Dr. James Wilson",
    specialty: "Dermatologist",
    date: "2026-03-20",
    time: "11:00",
    status: "pending",
    patientName: "John Doe",
    symptoms: "Skin rash",
  },
];

export const doctorAppointments: Appointment[] = [
  {
    id: "da1",
    doctorId: "d1",
    doctorName: "Dr. Sarah Mitchell",
    specialty: "Cardiologist",
    date: "2026-03-12",
    time: "09:00",
    status: "scheduled",
    patientName: "Alice Johnson",
    symptoms: "High blood pressure, dizziness",
  },
  {
    id: "da2",
    doctorId: "d1",
    doctorName: "Dr. Sarah Mitchell",
    specialty: "Cardiologist",
    date: "2026-03-12",
    time: "10:00",
    status: "pending",
    patientName: "Bob Martinez",
    symptoms: "Irregular heartbeat",
  },
  {
    id: "da3",
    doctorId: "d1",
    doctorName: "Dr. Sarah Mitchell",
    specialty: "Cardiologist",
    date: "2026-03-13",
    time: "14:00",
    status: "in-progress",
    patientName: "Carol Davis",
    symptoms: "Chest tightness after exercise",
  },
  {
    id: "da4",
    doctorId: "d1",
    doctorName: "Dr. Sarah Mitchell",
    specialty: "Cardiologist",
    date: "2026-03-10",
    time: "11:00",
    status: "completed",
    patientName: "David Lee",
    symptoms: "Follow-up check for stent placement",
    prescriptionId: "p2",
  },
];

export const prescriptions: Prescription[] = [
  {
    id: "p1",
    appointmentId: "a1",
    doctorName: "Dr. Sarah Mitchell",
    patientName: "John Doe",
    date: "2026-03-15",
    diagnosis: "Mild angina pectoris",
    symptoms: ["Chest pain", "Shortness of breath", "Fatigue"],
    medications: [
      { name: "Aspirin", dosage: "75mg", duration: "30 days", instructions: "Once daily after breakfast" },
      { name: "Atorvastatin", dosage: "20mg", duration: "30 days", instructions: "Once daily at bedtime" },
      { name: "Metoprolol", dosage: "25mg", duration: "14 days", instructions: "Twice daily with meals" },
    ],
    notes: "Patient should follow a low-sodium diet and engage in moderate exercise. Follow-up in 4 weeks.",
  },
  {
    id: "p2",
    appointmentId: "da4",
    doctorName: "Dr. Sarah Mitchell",
    patientName: "David Lee",
    date: "2026-03-10",
    diagnosis: "Post-stent follow-up — stable condition",
    symptoms: ["Routine follow-up", "No acute symptoms"],
    medications: [
      { name: "Clopidogrel", dosage: "75mg", duration: "90 days", instructions: "Once daily after lunch" },
      { name: "Rosuvastatin", dosage: "10mg", duration: "90 days", instructions: "Once daily at bedtime" },
    ],
    notes: "Stent site healing well. Continue dual antiplatelet therapy. Next follow-up in 3 months.",
  },
];
