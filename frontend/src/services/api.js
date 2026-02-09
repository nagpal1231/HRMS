import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://staffly-lf7u.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Dashboard ───────────────────────────────────────────────
export const getDashboard = () => api.get('/api/dashboard/');

// ─── Employees ───────────────────────────────────────────────
export const getEmployees = () => api.get('/api/employees/');
export const getEmployee = (id) => api.get(`/api/employees/${id}`);
export const createEmployee = (data) => api.post('/api/employees/', data);
export const deleteEmployee = (id) => api.delete(`/api/employees/${id}`);

// ─── Attendance ──────────────────────────────────────────────
export const markAttendance = (data) => api.post('/api/attendance/', data);
export const getEmployeeAttendance = (employeeId, date) => {
  const params = date ? { date } : {};
  return api.get(`/api/attendance/employee/${employeeId}`, { params });
};
export const getAttendanceByDate = (date) => api.get(`/api/attendance/date/${date}`);

export default api;
