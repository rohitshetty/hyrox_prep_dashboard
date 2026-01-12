import type { Phase } from '@/lib/types';

interface PhaseBadgeProps {
  phase: Phase | string;
  size?: 'sm' | 'md' | 'lg';
}

const phaseColors: Record<string, string> = {
  Base: 'bg-phase-base text-white',
  Build: 'bg-phase-build text-bg-base',
  Recovery: 'bg-phase-recovery text-bg-base',
  Peak: 'bg-phase-peak text-white',
  Taper: 'bg-phase-taper text-white',
  Race: 'bg-phase-race text-white',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

export function PhaseBadge({ phase, size = 'md' }: PhaseBadgeProps) {
  const colorClass = phaseColors[phase] || 'bg-gray-600 text-white';

  return (
    <span
      className={`
        inline-block rounded-full font-semibold uppercase tracking-wider
        ${colorClass}
        ${sizeStyles[size]}
      `}
    >
      {phase}
    </span>
  );
}
