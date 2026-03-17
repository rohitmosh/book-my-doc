const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data as T;
}

type AuthResponse = { token: string; user: { id: string; name: string; email: string; role: string } };

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (body: { name: string; email: string; password: string; role: string; dob?: string; location?: string }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  // Doctors
  getDoctors: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/doctors${qs}`);
  },
  getDoctor: (id: string) => request(`/doctors/${id}`),

  // Appointments
  getAppointments: () => request('/appointments'),
  getAppointmentById: (id: string) => request(`/appointments/${id}`),
  bookAppointment: (body: object) =>
    request('/appointments', { method: 'POST', body: JSON.stringify(body) }),
  updateAppointmentStatus: (id: string, status: string) =>
    request(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  cancelAppointment: (id: string) =>
    request(`/appointments/${id}`, { method: 'DELETE' }),

  // Prescriptions
  getPrescriptions: () => request('/prescriptions'),
  getPrescription: (id: string) => request(`/prescriptions/${id}`),
  createPrescription: (body: object) =>
    request('/prescriptions', { method: 'POST', body: JSON.stringify(body) }),
};
