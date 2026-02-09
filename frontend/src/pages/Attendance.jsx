import { useState, useEffect } from 'react';
import { CalendarCheck, Filter, Clock, UserCheck, UserX, Calendar, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  getEmployees,
  markAttendance,
  getEmployeeAttendance,
  getAttendanceByDate,
} from '../services/api';
import Card, { CardHeader, CardBody } from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Avatar from '../components/Avatar';
import { StatusBadge } from '../components/Badge';
import toast from 'react-hot-toast';

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Mark form
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStatus, setAttendanceStatus] = useState('Present');

  // View records
  const [viewMode, setViewMode] = useState('employee');
  const [viewEmployee, setViewEmployee] = useState('');
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDate, setFilterDate] = useState('');
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await getEmployees();
        setEmployees(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load employees');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }
    setSubmitting(true);
    try {
      await markAttendance({
        employee_id: selectedEmployee,
        date: attendanceDate,
        status: attendanceStatus,
      });
      toast.success('Attendance marked successfully');
      if (viewMode === 'employee' && viewEmployee === selectedEmployee) fetchRecords();
      else if (viewMode === 'date' && viewDate === attendanceDate) fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchRecords = async () => {
    setRecordsLoading(true);
    try {
      if (viewMode === 'employee' && viewEmployee) {
        const res = await getEmployeeAttendance(viewEmployee, filterDate || undefined);
        setRecords(res.data);
      } else if (viewMode === 'date' && viewDate) {
        const res = await getAttendanceByDate(viewDate);
        setRecords(res.data);
      }
    } catch {
      toast.error('Failed to fetch attendance records');
      setRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  };

  useEffect(() => {
    if ((viewMode === 'employee' && viewEmployee) || (viewMode === 'date' && viewDate)) {
      fetchRecords();
    } else {
      setRecords([]);
    }
  }, [viewMode, viewEmployee, viewDate, filterDate]);

  if (loading) return <LoadingSpinner message="Loading..." />;
  if (error) return <ErrorState message={error} />;

  if (employees.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Attendance</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-500">
            Track daily attendance for your team
          </p>
        </div>
        <Card>
          <EmptyState
            icon={CalendarCheck}
            title="No employees to track"
            description="Add employees first before marking attendance."
          />
        </Card>
      </motion.div>
    );
  }

  const selectedEmpName = employees.find((e) => e.employee_id === selectedEmployee)?.full_name;

  // Summary of current records
  const presentCount = records.filter((r) => r.status === 'Present').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Attendance</h2>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-500">
          Track daily attendance for your team
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column: Mark Attendance ─────────────── */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Mark Attendance</h3>
              </div>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleMarkAttendance} className="space-y-4">
                {/* Employee Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Employee <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="select-base pr-10"
                    >
                      <option value="">Select employee...</option>
                      {employees.map((emp) => (
                        <option key={emp.employee_id} value={emp.employee_id}>
                          {emp.full_name} ({emp.employee_id})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="input-base"
                  />
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label
                      className={`flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-semibold cursor-pointer transition-all duration-200 ${
                        attendanceStatus === 'Present'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-sm'
                          : 'border-gray-200 dark:border-surface-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-surface-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="Present"
                        checked={attendanceStatus === 'Present'}
                        onChange={(e) => setAttendanceStatus(e.target.value)}
                        className="sr-only"
                      />
                      <UserCheck className="h-4 w-4" />
                      Present
                    </label>
                    <label
                      className={`flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-semibold cursor-pointer transition-all duration-200 ${
                        attendanceStatus === 'Absent'
                          ? 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 shadow-sm'
                          : 'border-gray-200 dark:border-surface-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-surface-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="Absent"
                        checked={attendanceStatus === 'Absent'}
                        onChange={(e) => setAttendanceStatus(e.target.value)}
                        className="sr-only"
                      />
                      <UserX className="h-4 w-4" />
                      Absent
                    </label>
                  </div>
                </div>

                {/* Selected employee preview */}
                {selectedEmpName && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-surface-800/50 border border-gray-100 dark:border-surface-800">
                    <Avatar name={selectedEmpName} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedEmpName}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-600">
                        {attendanceDate} &middot; {attendanceStatus}
                      </p>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? 'Saving...' : 'Mark Attendance'}
                </button>
              </form>
            </CardBody>
          </Card>

          {/* Quick stats mini */}
          {records.length > 0 && (
            <Card>
              <CardBody>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600 mb-3">
                  Current Results
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/10 p-3 text-center">
                    <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{presentCount}</p>
                    <p className="text-[11px] font-medium text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
                      Present
                    </p>
                  </div>
                  <div className="rounded-xl bg-red-50 dark:bg-red-500/10 p-3 text-center">
                    <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">{absentCount}</p>
                    <p className="text-[11px] font-medium text-red-600/70 dark:text-red-400/70 mt-0.5">Absent</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* ── Right Column: View Records ─────────────── */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Attendance Records</h3>
              </div>
              <div className="flex gap-1.5 sm:ml-auto rounded-xl border border-gray-200 dark:border-surface-800 p-1 bg-white dark:bg-surface-900">
                <button
                  onClick={() => setViewMode('employee')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'employee'
                      ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  By Employee
                </button>
                <button
                  onClick={() => setViewMode('date')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === 'date'
                      ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  By Date
                </button>
              </div>
            </CardHeader>

            <CardBody className="flex-1 flex flex-col">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                {viewMode === 'employee' ? (
                  <>
                    <div className="relative flex-1">
                      <select
                        value={viewEmployee}
                        onChange={(e) => setViewEmployee(e.target.value)}
                        className="select-base pr-10"
                      >
                        <option value="">Select employee...</option>
                        {employees.map((emp) => (
                          <option key={emp.employee_id} value={emp.employee_id}>
                            {emp.full_name} ({emp.employee_id})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="relative">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <input
                          type="date"
                          value={filterDate}
                          onChange={(e) => setFilterDate(e.target.value)}
                          className="input-base pl-9 w-auto"
                        />
                      </div>
                      {filterDate && (
                        <button onClick={() => setFilterDate('')} className="btn-ghost text-xs whitespace-nowrap">
                          Clear
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <input
                    type="date"
                    value={viewDate}
                    onChange={(e) => setViewDate(e.target.value)}
                    className="input-base max-w-xs"
                  />
                )}
              </div>

              {/* Records */}
              <div className="flex-1">
                {recordsLoading ? (
                  <LoadingSpinner message="Loading records..." />
                ) : records.length === 0 ? (
                  <EmptyState
                    icon={CalendarCheck}
                    title="No attendance records"
                    description={
                      viewMode === 'employee' && !viewEmployee
                        ? 'Select an employee to view their attendance records.'
                        : 'No records found for the selected criteria.'
                    }
                  />
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-surface-800">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50/80 dark:bg-surface-800/50">
                          {viewMode === 'date' && (
                            <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                              Employee
                            </th>
                          )}
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                            Date
                          </th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-surface-800/50">
                        {records.map((record) => (
                          <tr
                            key={record.id}
                            className="hover:bg-gray-50/60 dark:hover:bg-surface-800/30 transition-colors"
                          >
                            {viewMode === 'date' && (
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar name={record.employee_name || 'U'} size="sm" />
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white text-[13px]">
                                      {record.employee_name}
                                    </div>
                                    <div className="text-[11px] text-gray-400 dark:text-gray-600 font-mono">
                                      {record.employee_id}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            )}
                            <td className="px-5 py-3 text-[13px] text-gray-600 dark:text-gray-400">
                              {new Date(record.date + 'T00:00:00').toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td className="px-5 py-3">
                              <StatusBadge status={record.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
