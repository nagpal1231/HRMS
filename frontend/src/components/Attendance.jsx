import React, { useState } from 'react';
import { CalendarCheck, Activity, Loader2, X } from 'lucide-react';

const Attendance = ({ employees, attendance, onMark }) => {
  const [form, setForm] = useState({
    emp_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [empFilter, setEmpFilter] = useState('');

  const filtered = attendance.filter((att) => {
    if (dateFilter && att.date !== dateFilter) return false;
    if (empFilter && att.emp_id !== empFilter) return false;
    return true;
  });

  const hasFilters = dateFilter || empFilter;

  const clearFilters = () => {
    setDateFilter('');
    setEmpFilter('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await onMark(form);
    if (ok) setForm({ ...form, emp_id: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Attendance</h2>
          <p className="text-slate-500 mt-1">Track daily employee attendance.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="date"
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 focus:outline-none"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            title="Filter by date"
          />
          <select
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 focus:outline-none appearance-none cursor-pointer"
            value={empFilter}
            onChange={(e) => setEmpFilter(e.target.value)}
          >
            <option value="">All Employees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.emp_id}>
                {emp.name}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Clear filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Mark Attendance Form ── */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl sticky top-6 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                <Activity size={20} />
              </div>
              <h3 className="font-bold text-lg">Mark Attendance</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Employee
                </label>
                <select
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-white appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none transition-all"
                  value={form.emp_id}
                  onChange={(e) => setForm({ ...form, emp_id: e.target.value })}
                >
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.emp_id}>
                      {emp.name} ({emp.emp_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Status</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800 rounded-xl border border-slate-700">
                  {['Present', 'Absent'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setForm({ ...form, status })}
                      className={`py-2.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${
                        form.status === status
                          ? status === 'Present'
                            ? 'bg-emerald-600 text-white shadow-lg'
                            : 'bg-rose-600 text-white shadow-lg'
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <span>Mark Attendance</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ── Attendance Records ── */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {hasFilters && (
              <div className="px-6 py-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                <p className="text-xs font-medium text-indigo-600">
                  {filtered.length} record{filtered.length !== 1 ? 's' : ''}
                  {dateFilter && ` for ${dateFilter}`}
                  {empFilter &&
                    ` · ${employees.find((e) => e.emp_id === empFilter)?.name || empFilter}`}
                </p>
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-indigo-500 hover:underline"
                >
                  Clear
                </button>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <CalendarCheck className="mx-auto text-slate-200 mb-3" size={40} />
                <p className="text-slate-500 font-semibold">
                  {attendance.length === 0
                    ? 'No attendance records yet'
                    : 'No records match your filters'}
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  {attendance.length === 0
                    ? 'Mark attendance using the form.'
                    : 'Try different filter settings.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((att) => (
                      <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-500">{att.date}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                              {att.employee_name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-800 block truncate">
                                {att.employee_name}
                              </span>
                              <span className="text-[11px] text-slate-400">{att.emp_id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                              att.status === 'Present'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-rose-50 text-rose-700 border-rose-100'
                            }`}
                          >
                            {att.status}
                          </span>
                        </td>
                      </tr>
                    ))}
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

export default Attendance;
