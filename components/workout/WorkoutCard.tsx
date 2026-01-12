import { ReactNode } from 'react';

type WorkoutType = 'run' | 'strength' | 'hyrox' | 'rest';

interface WorkoutCardProps {
  type: WorkoutType;
  title: string;
  subtitle?: string;
  duration?: string;
  children: ReactNode;
  className?: string;
}

const typeStyles: Record<WorkoutType, { header: string; label: string; labelText: string }> = {
  run: {
    header: 'bg-gradient-to-r from-type-run/15 to-transparent',
    label: 'text-type-run',
    labelText: 'RUNNING',
  },
  strength: {
    header: 'bg-gradient-to-r from-type-strength/15 to-transparent',
    label: 'text-type-strength',
    labelText: 'STRENGTH',
  },
  hyrox: {
    header: 'bg-gradient-to-r from-type-hyrox/15 to-transparent',
    label: 'text-type-hyrox',
    labelText: 'HYROX',
  },
  rest: {
    header: 'bg-gradient-to-r from-gray-600/15 to-transparent',
    label: 'text-gray-500',
    labelText: 'REST DAY',
  },
};

export function WorkoutCard({ type, title, subtitle, duration, children, className = '' }: WorkoutCardProps) {
  const styles = typeStyles[type];

  return (
    <div className={`bg-bg-elevated border border-border rounded-sm overflow-hidden hover:border-border-focus transition-all ${className}`}>
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between border-b border-border ${styles.header}`}>
        <span className={`font-display text-sm tracking-wide ${styles.label}`}>
          {styles.labelText}
        </span>
        {duration && (
          <span className="font-mono text-xs text-gray-500">
            {duration}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        {subtitle && (
          <p className="font-mono text-sm text-gray-400 mb-3">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
}
