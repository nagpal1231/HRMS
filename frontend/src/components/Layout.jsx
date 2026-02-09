import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Menu,
  X,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Bell,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & stats' },
  { to: '/employees', label: 'Employees', icon: Users, desc: 'Manage team' },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck, desc: 'Track records' },
];

const pageNames = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/attendance': 'Attendance',
};

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const currentPage = pageNames[location.pathname] || 'Dashboard';

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-950">
      {/* ── Desktop Sidebar ───────────────────────────────── */}
      <aside
        className={`hidden lg:flex flex-col ${
          collapsed ? 'w-[76px]' : 'w-[264px]'
        } shrink-0 bg-white dark:bg-surface-900 border-r border-gray-200/80 dark:border-surface-800 transition-all duration-300 ease-in-out`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-100 dark:border-surface-800 shrink-0">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 shadow-lg shadow-primary-500/25 shrink-0">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-bold text-gray-900 dark:text-white tracking-tight"
            >
              <span className="gradient-text">HRMS</span>
            </motion.span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-600">
              Menu
            </p>
          )}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-surface-800 hover:text-gray-800 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-500/20'
                        : 'bg-gray-100 dark:bg-surface-800 group-hover:bg-gray-200/70 dark:group-hover:bg-surface-700'
                    }`}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                  </div>
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{item.label}</div>
                      <div className="text-[11px] font-normal text-gray-400 dark:text-gray-600 truncate">
                        {item.desc}
                      </div>
                    </div>
                  )}
                  {!collapsed && isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-100 dark:border-surface-800 space-y-1 shrink-0">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-surface-800 transition-all duration-200"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-surface-800 shrink-0">
              {theme === 'light' ? (
                <Moon className="h-[18px] w-[18px]" />
              ) : (
                <Sun className="h-[18px] w-[18px]" />
              )}
            </div>
            {!collapsed && <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-surface-800 transition-all duration-200"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-surface-800 shrink-0">
              {collapsed ? (
                <ChevronRight className="h-[18px] w-[18px]" />
              ) : (
                <ChevronLeft className="h-[18px] w-[18px]" />
              )}
            </div>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar Overlay ────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-surface-900 border-r border-gray-200 dark:border-surface-800 z-50 lg:hidden flex flex-col shadow-2xl"
            >
              {/* Mobile Logo */}
              <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100 dark:border-surface-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 shadow-lg shadow-primary-500/25">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                    <span className="gradient-text">HRMS</span>
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* Mobile Nav */}
              <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
                <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-600">
                  Menu
                </p>
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-surface-800'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
                            isActive
                              ? 'bg-primary-100 dark:bg-primary-500/20'
                              : 'bg-gray-100 dark:bg-surface-800'
                          }`}
                        >
                          <item.icon className="h-[18px] w-[18px]" />
                        </div>
                        <div className="flex-1">
                          <div>{item.label}</div>
                          <div className="text-[11px] font-normal text-gray-400 dark:text-gray-600">
                            {item.desc}
                          </div>
                        </div>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
              {/* Mobile Bottom */}
              <div className="p-3 border-t border-gray-100 dark:border-surface-800 shrink-0">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-surface-800 transition-all"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-surface-800">
                    {theme === 'light' ? (
                      <Moon className="h-[18px] w-[18px]" />
                    ) : (
                      <Sun className="h-[18px] w-[18px]" />
                    )}
                  </div>
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Area ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-surface-800 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                {currentPage}
              </h1>
              <p className="text-[11px] text-gray-400 dark:text-gray-600 hidden sm:block mt-0.5">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button className="relative p-2.5 rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors">
              <Search className="h-[18px] w-[18px]" />
            </button>
            <button className="relative p-2.5 rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-white dark:ring-surface-900" />
            </button>
            <div className="ml-1 w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary-500/20 cursor-pointer">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
