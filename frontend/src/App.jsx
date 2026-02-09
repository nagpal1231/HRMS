import React, { useState, useEffect, useCallback } from 'react';
import { Building2, Menu, X } from 'lucide-react';
import { api } from './api';
import LoadingScreen from './components/LoadingScreen';
import Toast from './components/Toast';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import Attendance from './components/Attendance';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({
    total_employees: 0,
    present_today: 0,
    absent_today: 0,
    attendance_rate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ── Toast helper ────────────────────────────────────── */
  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type });
    if (type === 'success') {
      setTimeout(() => setToast(null), 3000);
    }
  }, []);

  /* ── Data fetching ───────────────────────────────────── */
  const fetchData = useCallback(async () => {
    try {
      const [emps, atts, dash] = await Promise.all([
        api.getEmployees(),
        api.getAttendance(),
        api.getDashboard(),
      ]);
      setEmployees(emps);
      setAttendance(atts);
      setStats(dash);
    } catch (err) {
      showToast('Failed to load data. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ── Handlers ────────────────────────────────────────── */
  const handleAddEmployee = async (data) => {
    try {
      await api.createEmployee(data);
      await fetchData();
      showToast('Employee added successfully!', 'success');
      return true;
    } catch (err) {
      showToast(err.message);
      return false;
    }
  };

  const handleDeleteEmployee = async (empId) => {
    try {
      await api.deleteEmployee(empId);
      await fetchData();
      showToast('Employee removed.', 'success');
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleMarkAttendance = async (data) => {
    try {
      await api.markAttendance(data);
      await fetchData();
      showToast('Attendance marked!', 'success');
      return true;
    } catch (err) {
      showToast(err.message);
      return false;
    }
  };

  /* ── Loading ─────────────────────────────────────────── */
  if (isLoading) return <LoadingScreen />;

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-white">
            <Building2 size={18} />
          </div>
          <h1 className="text-lg font-bold">
            HRMS <span className="text-indigo-600">Lite</span>
          </h1>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-72 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pt-20 pb-8 lg:px-12 lg:pt-10 lg:pb-10">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard stats={stats} attendance={attendance} onNavigate={setActiveTab} />
        )}

        {activeTab === 'employees' && (
          <Employees
            employees={employees}
            onAdd={handleAddEmployee}
            onDelete={handleDeleteEmployee}
          />
        )}

        {activeTab === 'attendance' && (
          <Attendance employees={employees} attendance={attendance} onMark={handleMarkAttendance} />
        )}
      </main>
    </div>
  );
};

export default App;