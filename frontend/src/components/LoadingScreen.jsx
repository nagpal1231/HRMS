import React from 'react';
import { Building2 } from 'lucide-react';

const LoadingScreen = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
    <div className="relative flex items-center justify-center">
      <div className="absolute w-20 h-20 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin" />
      <Building2 className="text-indigo-600" size={28} />
    </div>
    <p className="mt-8 text-slate-400 font-medium text-sm">Loading HRMS Lite…</p>
  </div>
);

export default LoadingScreen;
