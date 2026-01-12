import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'active';
  accentColor?: 'run' | 'strength' | 'hyrox' | 'accent';
}

export function Card({ children, className = '', variant = 'default', accentColor }: CardProps) {
  const baseStyles = 'rounded-sm border transition-all duration-200';

  const variantStyles = {
    default: 'bg-bg-surface border-border hover:border-border-focus',
    elevated: 'bg-bg-elevated border-border hover:border-border-focus',
    active: 'bg-bg-elevated border-accent/30 border-l-[3px] border-l-accent',
  };

  const accentStyles = accentColor
    ? {
        run: 'border-l-[3px] border-l-type-run',
        strength: 'border-l-[3px] border-l-type-strength',
        hyrox: 'border-l-[3px] border-l-type-hyrox',
        accent: 'border-l-[3px] border-l-accent',
      }[accentColor]
    : '';

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${accentStyles} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-4 py-3 border-b border-border ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
