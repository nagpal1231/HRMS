import { motion } from 'framer-motion';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        className="w-11 h-11 rounded-full border-[3px] border-primary-100 dark:border-primary-950 border-t-primary-600 dark:border-t-primary-400"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      <p className="mt-4 text-sm text-gray-400 dark:text-gray-600 font-medium">{message}</p>
    </div>
  );
}
