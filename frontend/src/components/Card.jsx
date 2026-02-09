export default function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`glass-card ${
        hover ? 'hover:shadow-md hover:-translate-y-0.5 cursor-default' : ''
      } transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100/80 dark:border-surface-800/50 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}
