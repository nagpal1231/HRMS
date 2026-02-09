import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const Toast = ({ message, type = 'error', onClose }) => {
  const isError = type === 'error';
  return (
    <div
      className={`mb-6 flex items-center justify-between bg-white border-l-4 ${
        isError ? 'border-rose-500' : 'border-emerald-500'
      } shadow-sm p-4 rounded-r-xl`}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`p-2 rounded-lg ${
            isError ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
          }`}
        >
          {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
        </div>
        <p className="text-sm font-medium text-slate-700">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 p-1 ml-4 text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
