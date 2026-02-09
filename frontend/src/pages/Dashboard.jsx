import { useState, useEffect } from 'react';
import { Users, CalendarCheck, Building2, UserX, Activity, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDashboard, getEmployees } from '../services/api';
import Card, { CardBody, CardHeader } from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import Avatar from '../components/Avatar';

/* ── animation variants ────────────────────────────────── */
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

/* ── animated number counter ───────────────────────────── */
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const end = parseInt(value) || 0;
    if (end === 0) {
      setDisplay(0);
      return;
    }
    let start = 0;
    const step = Math.max(1, Math.floor(end / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 25);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
}

/* ── stat card ─────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, gradient, shadowColor }) {
  return (
    <motion.div variants={fadeUp}>
      <Card hover>
        <CardBody>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">{label}</p>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                <AnimatedNumber value={value} />
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center shadow-lg ${shadowColor}`}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

/* ── main dashboard page ───────────────────────────────── */
export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, empRes] = await Promise.all([getDashboard(), getEmployees()]);
      setDashboard(dashRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const attendanceRate =
    dashboard.total_employees > 0
      ? Math.round((dashboard.total_present_today / dashboard.total_employees) * 100)
      : 0;

  const stats = [
    {
      label: 'Total Employees',
      value: dashboard.total_employees,
      icon: Users,
      gradient: 'bg-gradient-to-br from-primary-500 to-indigo-600',
      shadowColor: 'shadow-primary-500/30',
    },
    {
      label: 'Present Today',
      value: dashboard.total_present_today,
      icon: CalendarCheck,
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      shadowColor: 'shadow-emerald-500/30',
    },
    {
      label: 'Absent Today',
      value: dashboard.total_absent_today,
      icon: UserX,
      gradient: 'bg-gradient-to-br from-red-500 to-rose-600',
      shadowColor: 'shadow-red-500/30',
    },
    {
      label: 'Departments',
      value: dashboard.department_count,
      icon: Building2,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-500/30',
    },
  ];

  /* — department breakdown — */
  const deptMap = {};
  employees.forEach((e) => {
    deptMap[e.department] = (deptMap[e.department] || 0) + 1;
  });
  const deptData = Object.entries(deptMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  const maxDept = Math.max(...deptData.map((d) => d.count), 1);

  const barColors = [
    'from-primary-500 to-indigo-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-cyan-500 to-blue-500',
    'from-violet-500 to-purple-500',
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* ── Welcome Banner ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-purple-600 to-indigo-700 p-6 sm:p-8 mb-6"
      >
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back!
          </h1>
          <p className="mt-2 text-primary-100 text-sm sm:text-base max-w-xl leading-relaxed">
            Here's what's happening with your team today. You have{' '}
            <span className="font-semibold text-white">{dashboard.total_employees} employees</span> with{' '}
            <span className="font-semibold text-white">{attendanceRate}% attendance</span> rate.
          </p>
        </div>
        {/* decorative */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 right-24 w-44 h-44 bg-white/5 rounded-full translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <Activity className="absolute top-6 right-8 w-28 h-28 text-white/[0.07] hidden sm:block" />
      </motion.div>

      {/* ── Stats Grid ─────────────────────────────────── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </motion.div>

      {/* ── Bottom Row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance ring + department bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Circular ring */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Today's Attendance</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col items-center">
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-gray-100 dark:text-surface-800"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      strokeWidth="10"
                      strokeLinecap="round"
                      stroke="url(#ring-grad)"
                      strokeDasharray={`${attendanceRate * 3.14} ${314 - attendanceRate * 3.14}`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{attendanceRate}%</span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-600 font-medium">Present</span>
                  </div>
                </div>
                <div className="mt-5 w-full space-y-2.5">
                  {[
                    { label: 'Present', value: dashboard.total_present_today, color: 'bg-emerald-500' },
                    { label: 'Absent', value: dashboard.total_absent_today, color: 'bg-red-500' },
                    { label: 'Total', value: dashboard.total_employees, color: 'bg-gray-300 dark:bg-gray-600' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${row.color}`} />
                        <span className="text-[13px] text-gray-500 dark:text-gray-400">{row.label}</span>
                      </div>
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-white">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Department breakdown */}
          {deptData.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Departments</h2>
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-600">
                    {deptData.length} total
                  </span>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-3.5">
                  {deptData.map((dept, i) => (
                    <div key={dept.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300">{dept.name}</span>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {dept.count} member{dept.count > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-surface-800 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(dept.count / maxDept) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                          className={`h-full rounded-full bg-gradient-to-r ${barColors[i % barColors.length]}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </motion.div>

        {/* Employee table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="h-full flex flex-col">
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary-500" />
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Employee Overview</h2>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-surface-800 text-gray-500 dark:text-gray-400">
                {employees.length} members
              </span>
            </CardHeader>
            <div className="flex-1 overflow-x-auto">
              {employees.length === 0 ? (
                <div className="px-6 py-16 text-center text-sm text-gray-400 dark:text-gray-600">
                  No employees added yet. Head to the Employees page to get started.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-surface-800">
                      <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                        Department
                      </th>
                      <th className="px-6 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                        Present
                      </th>
                      <th className="px-6 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                        Absent
                      </th>
                      <th className="px-6 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                        Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-surface-800/50">
                    {employees.map((emp) => {
                      const total = emp.total_present + emp.total_absent;
                      const rate = total > 0 ? Math.round((emp.total_present / total) * 100) : 0;
                      return (
                        <tr
                          key={emp.employee_id}
                          className="hover:bg-gray-50/60 dark:hover:bg-surface-800/30 transition-colors"
                        >
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar name={emp.full_name} size="sm" />
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white text-[13px]">
                                  {emp.full_name}
                                </div>
                                <div className="text-[11px] text-gray-400 dark:text-gray-600 font-mono">
                                  {emp.employee_id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-[13px] text-gray-500 dark:text-gray-400">
                            {emp.department}
                          </td>
                          <td className="px-6 py-3 text-center">
                            <span className="inline-flex items-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              {emp.total_present}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <span className="inline-flex items-center rounded-lg bg-red-50 dark:bg-red-500/10 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:text-red-400">
                              {emp.total_absent}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="inline-flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-surface-800 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    rate >= 75
                                      ? 'bg-emerald-500'
                                      : rate >= 50
                                      ? 'bg-amber-500'
                                      : 'bg-red-500'
                                  }`}
                                  style={{ width: `${rate}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 w-8 text-right">
                                {rate}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
