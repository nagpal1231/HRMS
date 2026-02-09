import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <div className="absolute -inset-2 rounded-2xl bg-red-50/50 dark:bg-red-500/5 blur-xl -z-10" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-gray-900 dark:text-white">Something went wrong</h3>
      <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-500 max-w-sm leading-relaxed">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-5">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </motion.div>
  );
}
