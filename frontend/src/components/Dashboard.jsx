import React from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Activity,
  CalendarCheck,
} from 'lucide-react';

/* ── Stat Card ─────────────────────────────────────────── */
const COLORS = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', value: 'text-indigo-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', value: 'text-emerald-600' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', value: 'text-rose-600' },
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const c = COLORS[color];
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-5">
        <div className={`p-3 ${c.bg} ${c.text} rounded-xl w-fit`}>
          <Icon size={22} />
        </div>
      </div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className={`text-3xl font-extrabold mt-1 ${c.value}`}>{value}</p>
    </div>
  );
};

/* ── Status Badge ──────────────────────────────────────── */
const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
      status === 'Present'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
        : 'bg-rose-50 text-rose-700 border-rose-100'
    }`}
  >
    {status}
  </span>
);

/* ── Dashboard ─────────────────────────────────────────── */
const Dashboard = ({ stats, attendance, onNavigate }) => (
  <div className="space-y-10">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
      <div>
        <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-1">
          Overview
        </p>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h2>
      </div>
      <p className="text-sm font-semibold text-slate-500 hidden sm:block">
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard icon={Users} label="Total Employees" value={stats.total_employees} color="indigo" />
      <StatCard
        icon={CheckCircle}
        label="Present Today"
        value={stats.present_today}
        color="emerald"
      />
      <StatCard icon={XCircle} label="Absent Today" value={stats.absent_today} color="rose" />

      {/* Dark accent card */}
      <div className="bg-slate-900 p-6 rounded-2xl shadow-xl">
        <div className="mb-5">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl w-fit">
            <Activity size={22} />
          </div>
        </div>
        <p className="text-indigo-300/70 text-xs font-bold uppercase tracking-wider">
          Attendance Rate
        </p>
        <p className="text-3xl font-extrabold mt-1 text-white">{stats.attendance_rate}%</p>
      </div>
    </div>

    {/* Bottom Section */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Recent Attendance Table */}
      <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm">Recent Attendance</h3>
          <button
            onClick={() => onNavigate('attendance')}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            View All
          </button>
        </div>

        {attendance.length === 0 ? (
          <div className="py-20 text-center">
            <CalendarCheck className="mx-auto text-slate-200 mb-3" size={40} />
            <p className="text-slate-400 text-sm font-medium">No attendance records yet.</p>
            <p className="text-slate-300 text-xs mt-1">Mark attendance to see records here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {attendance.slice(0, 6).map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {att.employee_name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-700">{att.employee_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{att.date}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={att.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h4 className="text-xl font-bold mb-2">Quick Actions</h4>
          <p className="text-indigo-100 text-sm opacity-80">
            Manage your team efficiently.
          </p>
        </div>
        <div className="relative z-10 mt-6 space-y-3">
          <button
            onClick={() => onNavigate('employees')}
            className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all"
          >
            Add Employee
          </button>
          <button
            onClick={() => onNavigate('attendance')}
            className="w-full bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-400 transition-all"
          >
            Mark Attendance
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
