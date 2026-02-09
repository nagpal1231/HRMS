import React, { useState } from 'react';
import { UserPlus, Search, Users, Trash2, Loader2 } from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Marketing',
  'Human Resources',
  'Sales',
  'Finance',
];

const INPUT =
  'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 focus:outline-none transition-all';

/* ── Field Wrapper ─────────────────────────────────────── */
const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-0.5">
      {label}
      {required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

/* ── Employees Component ───────────────────────────────── */
const Employees = ({ employees, onAdd, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    emp_id: '',
    name: '',
    email: '',
    department: 'Engineering',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const filtered = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.emp_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await onAdd(form);
    if (ok) setForm({ emp_id: '', name: '', email: '', department: 'Engineering' });
    setIsSubmitting(false);
  };

  const handleDelete = async (empId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    setDeletingId(empId);
    await onDelete(empId);
    setDeletingId(null);
  };

  const presenceRate = (emp) => {
    if (!emp.total_days) return 0;
    return Math.round((emp.present_days / emp.total_days) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Employees</h2>
          <p className="text-slate-500 mt-1">
            {employees.length} employee{employees.length !== 1 ? 's' : ''} registered.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search name, ID, or dept…"
            className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 focus:outline-none w-full md:w-72 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Add Employee Form ── */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <UserPlus size={20} />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Add Employee</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Employee ID" required>
                <input
                  required
                  className={INPUT}
                  placeholder="e.g. EMP-001"
                  value={form.emp_id}
                  onChange={(e) => setForm({ ...form, emp_id: e.target.value })}
                />
              </Field>

              <Field label="Full Name" required>
                <input
                  required
                  className={INPUT}
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>

              <Field label="Email Address" required>
                <input
                  required
                  type="email"
                  className={INPUT}
                  placeholder="e.g. john@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Field>

              <Field label="Department">
                <select
                  className={`${INPUT} appearance-none cursor-pointer`}
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Adding…</span>
                  </>
                ) : (
                  <span>Add Employee</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ── Employee Table ── */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-slate-300" size={28} />
                </div>
                <p className="text-slate-500 font-semibold">
                  {employees.length === 0 ? 'No employees yet' : 'No matching employees'}
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  {employees.length === 0
                    ? 'Add your first employee using the form.'
                    : 'Try a different search term.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Attendance</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((emp) => {
                      const rate = presenceRate(emp);
                      return (
                        <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                                {emp.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 truncate">
                                  {emp.name}
                                </p>
                                <p className="text-[11px] text-slate-400 truncate">
                                  {emp.emp_id} · {emp.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap">
                              {emp.department}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex-1 h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    rate >= 70
                                      ? 'bg-emerald-500'
                                      : rate >= 40
                                      ? 'bg-amber-500'
                                      : emp.total_days === 0
                                      ? 'bg-slate-200'
                                      : 'bg-rose-500'
                                  }`}
                                  style={{ width: `${emp.total_days === 0 ? 0 : rate}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-400 whitespace-nowrap w-14 text-right">
                                {emp.present_days}/{emp.total_days}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDelete(emp.emp_id)}
                              disabled={deletingId === emp.emp_id}
                              className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50"
                              title="Delete employee"
                            >
                              {deletingId === emp.emp_id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;
