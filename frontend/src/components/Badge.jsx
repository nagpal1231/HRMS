export function StatusBadge({ status }) {
  const isPresent = status === 'Present';
  return (
    <span
      className={`badge ${
        isPresent
          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20'
          : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-500/20'
      }`}
    >
      <span
        className={`mr-1.5 w-1.5 h-1.5 rounded-full inline-block ${
          isPresent ? 'bg-emerald-500' : 'bg-red-500'
        }`}
      />
      {status}
    </span>
  );
}

export function DepartmentBadge({ department }) {
  const colorMap = {
    Engineering: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20',
    Design: 'bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400 ring-1 ring-inset ring-pink-500/20',
    Marketing: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20',
    HR: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 ring-1 ring-inset ring-purple-500/20',
    Sales: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 ring-1 ring-inset ring-cyan-500/20',
    Finance: 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 ring-1 ring-inset ring-teal-500/20',
  };

  const fallback =
    'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 ring-1 ring-inset ring-primary-500/20';

  return <span className={`badge ${colorMap[department] || fallback}`}>{department}</span>;
}
