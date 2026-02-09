import React from 'react';
import { Building2, LayoutDashboard, Users, CalendarCheck, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
];

const Sidebar = ({ activeTab, onTabChange }) => (
  <div className="w-72 bg-white border-r border-slate-200 flex flex-col p-8 h-full">
    {/* Logo */}
    <div className="flex items-center space-x-3 mb-12">
      <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
        <Building2 size={22} strokeWidth={2.5} />
      </div>
      <div>
        <h1 className="text-lg font-bold leading-tight">
          HRMS <span className="text-indigo-600">Lite</span>
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Management System
        </p>
      </div>
    </div>

    {/* Navigation */}
    <nav className="space-y-1.5 flex-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-4">
        Menu
      </p>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
            activeTab === item.id
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center space-x-3">
            <item.icon
              size={20}
              className={
                activeTab === item.id
                  ? 'text-white'
                  : 'text-slate-400 group-hover:text-slate-700'
              }
            />
            <span className="font-semibold text-sm">{item.label}</span>
          </div>
          {activeTab === item.id && <ChevronRight size={14} className="opacity-60" />}
        </button>
      ))}
    </nav>

    {/* Footer Card */}
    <div className="mt-auto bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">
        Logged In
      </p>
      <p className="text-sm font-bold">Administrator</p>
      <div className="flex items-center mt-3 text-[10px] text-slate-400">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse" />
        Online
      </div>
    </div>
  </div>
);

export default Sidebar;
