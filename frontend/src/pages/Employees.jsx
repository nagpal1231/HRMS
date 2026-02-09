import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Users,
  Search,
  LayoutGrid,
  List,
  Mail,
  Building,
  Hash,
  UserPlus,
  MoreVertical,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEmployees, createEmployee, deleteEmployee } from '../services/api';
import Card, { CardBody } from '../components/Card';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Avatar from '../components/Avatar';
import { DepartmentBadge } from '../components/Badge';
import toast from 'react-hot-toast';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [form, setForm] = useState({ employee_id: '', full_name: '', email: '', department: '' });
  const [formErrors, setFormErrors] = useState({});

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!form.employee_id.trim()) errors.employee_id = 'Employee ID is required';
    if (!form.full_name.trim()) errors.full_name = 'Full name is required';
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Invalid email format';
    }
    if (!form.department.trim()) errors.department = 'Department is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setSubmitting(true);
    try {
      await createEmployee(form);
      toast.success('Employee added successfully');
      setShowAddModal(false);
      setForm({ employee_id: '', full_name: '', email: '', department: '' });
      setFormErrors({});
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (employeeId, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${name}? This will also delete all their attendance records.`
      )
    )
      return;
    try {
      await deleteEmployee(employeeId);
      toast.success(`${name} has been removed`);
      setEmployees((prev) => prev.filter((e) => e.employee_id !== employeeId));
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete employee');
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingSpinner message="Loading employees..." />;
  if (error) return <ErrorState message={error} onRetry={fetchEmployees} />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Team Members</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-500">
            {employees.length} employee{employees.length !== 1 ? 's' : ''} in your organization
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {/* ── Search + View Toggle ───────────────────────── */}
      {employees.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base pl-11"
            />
          </div>
          <div className="flex rounded-xl border border-gray-200 dark:border-surface-800 p-1 bg-white dark:bg-surface-900 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
          </div>
        </div>
      )}

      {/* ── Empty State ────────────────────────────────── */}
      {employees.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users}
            title="No employees yet"
            description="Get started by adding your first team member to the system."
            action={
              <button onClick={() => setShowAddModal(true)} className="btn-primary">
                <UserPlus className="h-4 w-4" />
                Add First Employee
              </button>
            }
          />
        </Card>
      ) : viewMode === 'grid' ? (
        /* ── Grid View ──────────────────────────────────── */
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filteredEmployees.map((emp) => (
              <motion.div
                key={emp.employee_id}
                variants={fadeUp}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card hover className="group relative">
                  <CardBody>
                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(emp.employee_id, emp.full_name)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <Avatar name={emp.full_name} size="lg" />
                    <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{emp.full_name}</h3>
                    <p className="text-[11px] text-gray-400 dark:text-gray-600 font-mono mt-0.5">
                      {emp.employee_id}
                    </p>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-400">
                        <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-600" />
                        <span className="truncate">{emp.email}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-surface-800/50">
                      <DepartmentBadge department={emp.department} />
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredEmployees.length === 0 && searchQuery && (
            <div className="col-span-full py-16 text-center text-sm text-gray-400 dark:text-gray-600">
              No employees match "<span className="font-medium text-gray-500">{searchQuery}</span>"
            </div>
          )}
        </motion.div>
      ) : (
        /* ── List View ──────────────────────────────────── */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-surface-800">
                  <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                    Employee
                  </th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                    Email
                  </th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                    Department
                  </th>
                  <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-surface-800/50">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.employee_id}
                    className="group hover:bg-gray-50/60 dark:hover:bg-surface-800/30 transition-colors"
                  >
                    <td className="px-6 py-3.5">
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
                    <td className="px-6 py-3.5 text-[13px] text-gray-500 dark:text-gray-400">{emp.email}</td>
                    <td className="px-6 py-3.5">
                      <DepartmentBadge department={emp.department} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(emp.employee_id, emp.full_name)}
                        className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && searchQuery && (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center text-sm text-gray-400 dark:text-gray-600">
                      No employees match "<span className="font-medium text-gray-500">{searchQuery}</span>"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Add Employee Modal ─────────────────────────── */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setFormErrors({});
        }}
        title="Add New Employee"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Employee ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={form.employee_id}
                onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                placeholder="e.g. EMP001"
                className={`input-base pl-11 ${
                  formErrors.employee_id ? 'border-red-300 dark:border-red-500 focus:ring-red-500/40' : ''
                }`}
              />
            </div>
            {formErrors.employee_id && (
              <p className="mt-1.5 text-xs text-red-500">{formErrors.employee_id}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="e.g. Aarav Sharma"
                className={`input-base pl-11 ${
                  formErrors.full_name ? 'border-red-300 dark:border-red-500 focus:ring-red-500/40' : ''
                }`}
              />
            </div>
            {formErrors.full_name && <p className="mt-1.5 text-xs text-red-500">{formErrors.full_name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. aarav@company.com"
                className={`input-base pl-11 ${
                  formErrors.email ? 'border-red-300 dark:border-red-500 focus:ring-red-500/40' : ''
                }`}
              />
            </div>
            {formErrors.email && <p className="mt-1.5 text-xs text-red-500">{formErrors.email}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Department <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="e.g. Engineering"
                className={`input-base pl-11 ${
                  formErrors.department ? 'border-red-300 dark:border-red-500 focus:ring-red-500/40' : ''
                }`}
              />
            </div>
            {formErrors.department && (
              <p className="mt-1.5 text-xs text-red-500">{formErrors.department}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setFormErrors({});
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
