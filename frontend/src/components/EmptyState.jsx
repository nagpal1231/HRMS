import { Inbox } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-surface-800 flex items-center justify-center">
          <Icon className="h-7 w-7 text-gray-400 dark:text-gray-600" />
        </div>
        <div className="absolute -inset-2 rounded-2xl bg-gray-100/50 dark:bg-surface-800/50 blur-xl -z-10" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-500 max-w-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
