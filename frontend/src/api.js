const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };

  const res = await fetch(url, config);

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    const message =
      data.detail ||
      (Array.isArray(data.detail)
        ? data.detail.map((e) => e.msg).join(', ')
        : 'Something went wrong');
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }

  return data;
}

export const api = {
  // Employees
  getEmployees: () => request('/employees'),
  createEmployee: (data) =>
    request('/employees', { method: 'POST', body: JSON.stringify(data) }),
  deleteEmployee: (empId) =>
    request(`/employees/${encodeURIComponent(empId)}`, { method: 'DELETE' }),

  // Attendance
  getAttendance: (params = {}) => {
    const query = new URLSearchParams();
    if (params.emp_id) query.set('emp_id', params.emp_id);
    if (params.date) query.set('date', params.date);
    const qs = query.toString();
    return request(`/attendance${qs ? '?' + qs : ''}`);
  },
  markAttendance: (data) =>
    request('/attendance', { method: 'POST', body: JSON.stringify(data) }),

  // Dashboard
  getDashboard: () => request('/dashboard'),
};
