# BookMyDoc

A full-stack doctor appointment booking platform built with React, TypeScript, Node.js, Express, and MongoDB. Patients can search and filter doctors, book appointments, and track their health history. Doctors can manage their schedule, update appointment statuses, and issue prescriptions.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Seeding the Database](#seeding-the-database)
  - [Running the App](#running-the-app)
- [Demo Credentials](#demo-credentials)
- [API Reference](#api-reference)
  - [Auth](#auth)
  - [Doctors](#doctors)
  - [Appointments](#appointments)
  - [Prescriptions](#prescriptions)
  - [Profile](#profile)
- [Data Models](#data-models)
  - [User](#user)
  - [Doctor](#doctor)
  - [Appointment](#appointment)
  - [Prescription](#prescription)
- [Frontend Pages](#frontend-pages)
- [Authentication](#authentication)
- [Testing](#testing)

---

## Features

**Patients**
- Search and filter doctors by name, specialty, gender, and price range
- View doctor profiles with ratings, experience, location, working days, and hours
- Book appointments with available time slots
- Track appointment status (pending → scheduled → in-progress → completed)
- View prescriptions issued by doctors
- Manage personal profile settings

**Doctors**
- Dashboard with patient appointment overview
- Update appointment statuses
- Issue prescriptions linked to appointments
- Manage clinic profile, availability, and working schedule

**General**
- JWT-based authentication with role separation (patient / doctor)
- Responsive UI with light/dark theme support
- Animated hero section and specialty browsing on the home page

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui, Radix UI |
| Animations | Framer Motion |
| State / Data | TanStack Query, React Hook Form, Zod |
| Routing | React Router v6 |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Testing | Vitest, Testing Library, Playwright |

---

## Project Structure

```
bookmydoc/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # shadcn/ui primitives
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── DoctorCard.tsx
│   │   ├── BookingModal.tsx
│   │   ├── AppointmentTimeline.tsx
│   │   └── PrescriptionView.tsx
│   ├── hooks/
│   │   ├── useAuth.tsx      # Auth context and hook
│   │   └── use-mobile.tsx
│   ├── lib/
│   │   ├── api.ts           # Centralised API client
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── DoctorList.tsx
│   │   ├── DoctorProfile.tsx
│   │   ├── PatientDashboard.tsx
│   │   ├── PatientProfileSettings.tsx
│   │   ├── DoctorDashboard.tsx
│   │   ├── DoctorProfileSettings.tsx
│   │   ├── TrackAppointment.tsx
│   │   └── Login.tsx
│   ├── App.tsx
│   └── main.tsx
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   └── Prescription.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── doctors.js
│   │   ├── appointments.js
│   │   ├── prescriptions.js
│   │   └── profile.js
│   ├── middleware/
│   │   └── auth.js          # JWT protect middleware
│   ├── index.js             # Express app entry point
│   ├── seed.js              # Database seeder
│   └── .env.example
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Environment Variables

Copy the example file and fill in your values:

```bash
cp server/.env.example server/.env
```

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/bookmydoc
JWT_SECRET=your_super_secret_key_here
PORT=3000
CLIENT_URL=http://localhost:5173
```

The frontend reads one optional variable. Create a `.env` in the project root if you need to point to a non-default API URL:

```env
VITE_API_URL=http://localhost:3000/api
```

If `VITE_API_URL` is not set, the client defaults to `http://localhost:3000/api`.

### Installation

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd server && npm install
```

### Seeding the Database

Populate MongoDB with 6 doctors, 6 users, 7 appointments, and 2 prescriptions:

```bash
cd server && node seed.js
```

This will clear existing data and re-insert all demo records.

### Running the App

Start the backend server (port 3000):

```bash
cd server && npm run dev
```

Start the frontend dev server (port 5173):

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Patient | rahul.verma@demo.com | rahul@123 |
| Doctor | arjun.mehta@demo.com | arjun@123 |
| Patient | ananya.iyer@demo.com | ananya@123 |
| Patient | suresh.patel@demo.com | suresh@123 |
| Patient | meena.joshi@demo.com | meena@123 |
| Patient | kiran.rao@demo.com | kiran@123 |

---

## API Reference

All protected routes require the header:

```
Authorization: Bearer <token>
```

Base URL: `http://localhost:3000/api`

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login and receive a JWT |

**Register body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "patient | doctor",
  "dob": "string (optional)",
  "location": "string (optional)"
}
```

**Login body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (both):**
```json
{
  "token": "jwt_string",
  "user": { "id": "", "name": "", "email": "", "role": "" }
}
```

---

### Doctors

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/doctors` | No | List all doctors (supports query filters) |
| GET | `/doctors/:id` | No | Get a single doctor by ID |
| POST | `/doctors` | Yes | Create a new doctor record |
| PATCH | `/doctors/:id` | Yes | Update a doctor record |

**Query parameters for `GET /doctors`:**

| Param | Type | Description |
|---|---|---|
| `specialty` | string | Filter by specialty |
| `gender` | string | `Male` or `Female` |
| `available` | boolean | `true` or `false` |

---

### Appointments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/appointments` | Yes | Get appointments for the logged-in user |
| GET | `/appointments/:id` | Yes | Get a single appointment |
| POST | `/appointments` | Yes | Book a new appointment |
| PATCH | `/appointments/:id/status` | Yes | Update appointment status |
| DELETE | `/appointments/:id` | Yes | Cancel an appointment |

**Book appointment body:**
```json
{
  "doctorId": "string",
  "doctorName": "string",
  "specialty": "string",
  "patientName": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "symptoms": "string"
}
```

**Status values:** `pending` | `scheduled` | `in-progress` | `completed`

---

### Prescriptions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/prescriptions` | Yes | Get prescriptions for the logged-in user |
| GET | `/prescriptions/:id` | Yes | Get a single prescription |
| POST | `/prescriptions` | Yes | Create a prescription (doctor only) |

**Create prescription body:**
```json
{
  "appointmentId": "string",
  "doctorName": "string",
  "patientName": "string",
  "date": "YYYY-MM-DD",
  "diagnosis": "string",
  "symptoms": ["string"],
  "medications": [
    {
      "name": "string",
      "dosage": "string",
      "duration": "string",
      "instructions": "string"
    }
  ],
  "notes": "string"
}
```

Creating a prescription automatically marks the linked appointment as `completed`.

---

### Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/profile/me` | Yes | Get current user profile (+ doctor profile if applicable) |
| PATCH | `/profile/me` | Yes | Update user profile and/or doctor profile |

**PATCH body (doctor example):**
```json
{
  "name": "string",
  "location": "string",
  "doctorProfile": {
    "about": "string",
    "clinic": "string",
    "available": true,
    "workingDays": ["Mon", "Tue"],
    "workingHours": { "start": "09:00", "end": "17:00" }
  }
}
```

---

## Data Models

### User

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, unique, lowercase |
| `password` | String | Bcrypt hashed |
| `role` | String | `patient` or `doctor` |
| `doctorId` | ObjectId | Ref to Doctor (doctors only) |
| `dob` | String | Date of birth |
| `location` | String | City / region |

### Doctor

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `specialty` | String | Required |
| `fee` | Number | Consultation fee |
| `experience` | Number | Years of experience |
| `location` | String | Hospital / clinic location |
| `gender` | String | `Male` or `Female` |
| `available` | Boolean | Availability status |
| `rating` | Number | Average rating |
| `reviews` | Number | Total review count |
| `education` | String | Degree and institution |
| `about` | String | Bio / description |
| `clinic` | String | Clinic name and address |
| `slots` | [String] | Available time slots (e.g. `"09:00"`) |
| `workingDays` | [String] | e.g. `["Mon", "Tue", "Wed"]` |
| `workingHours` | Object | `{ start: "09:00", end: "17:00" }` |

### Appointment

| Field | Type | Notes |
|---|---|---|
| `doctorId` | ObjectId | Ref to Doctor |
| `doctorName` | String | Denormalised for display |
| `specialty` | String | |
| `patientId` | ObjectId | Ref to User |
| `patientName` | String | Denormalised for display |
| `date` | String | `YYYY-MM-DD` |
| `time` | String | `HH:MM` |
| `status` | String | `pending` / `scheduled` / `in-progress` / `completed` |
| `symptoms` | String | Patient-reported symptoms |
| `prescriptionId` | ObjectId | Ref to Prescription (set on completion) |

### Prescription

| Field | Type | Notes |
|---|---|---|
| `appointmentId` | ObjectId | Ref to Appointment |
| `doctorName` | String | |
| `patientName` | String | |
| `date` | String | Issue date |
| `diagnosis` | String | |
| `symptoms` | [String] | |
| `medications` | [Object] | `{ name, dosage, duration, instructions }` |
| `notes` | String | Additional doctor notes |

---

## Frontend Pages

| Route | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/doctors` | Doctor search & filter list | Public |
| `/doctors/:id` | Doctor profile & booking | Public |
| `/login` | Login / Register | Public |
| `/patient/dashboard` | Patient appointments & prescriptions | Patient |
| `/patient/profile-settings` | Edit patient profile | Patient |
| `/doctor/dashboard` | Doctor appointment management | Doctor |
| `/doctor/profile-settings` | Edit doctor profile & availability | Doctor |
| `/track-appointment` | Track appointment by ID | Public |

---

## Authentication

Authentication uses JWT stored in `localStorage`. The `useAuth` hook provides the auth context throughout the app:

```ts
const { isLoggedIn, role, user, login, logout } = useAuth();
```

- Tokens expire after 7 days
- The `protect` middleware on the server validates the `Authorization: Bearer <token>` header on all protected routes
- Role-based data filtering is applied server-side — doctors see their own patients' appointments, patients see only their own records

---

## Testing

Run unit tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run end-to-end tests (Playwright):

```bash
npx playwright test
```

Playwright config is in `playwright.config.ts`. Make sure both the frontend and backend are running before executing e2e tests.
