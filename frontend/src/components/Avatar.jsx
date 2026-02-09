const colorPairs = [
  { bg: 'bg-primary-100 dark:bg-primary-500/20', text: 'text-primary-700 dark:text-primary-300' },
  { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300' },
  { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-300' },
  { bg: 'bg-cyan-100 dark:bg-cyan-500/20', text: 'text-cyan-700 dark:text-cyan-300' },
  { bg: 'bg-pink-100 dark:bg-pink-500/20', text: 'text-pink-700 dark:text-pink-300' },
  { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-300' },
  { bg: 'bg-rose-100 dark:bg-rose-500/20', text: 'text-rose-700 dark:text-rose-300' },
  { bg: 'bg-violet-100 dark:bg-violet-500/20', text: 'text-violet-700 dark:text-violet-300' },
];

function hashStr(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export default function Avatar({ name, size = 'md' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const idx = hashStr(name) % colorPairs.length;
  const { bg, text } = colorPairs[idx];

  const sizes = {
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-14 h-14 text-lg',
  };

  return (
    <div
      className={`${sizes[size]} ${bg} ${text} rounded-xl flex items-center justify-center font-bold shrink-0 select-none`}
    >
      {initials}
    </div>
  );
}
