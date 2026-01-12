import Link from 'next/link';
import { TOTAL_WEEKS } from '@/lib/dates';

interface WeekNavProps {
  currentWeek: number;
}

export function WeekNav({ currentWeek }: WeekNavProps) {
  const hasPrev = currentWeek > 1;
  const hasNext = currentWeek < TOTAL_WEEKS;

  return (
    <div className="flex items-center gap-4">
      {hasPrev ? (
        <Link
          href={`/week/${currentWeek - 1}`}
          className="px-3 py-1.5 bg-bg-surface border border-border rounded-sm text-sm hover:border-border-focus transition-colors"
        >
          &larr; Week {currentWeek - 1}
        </Link>
      ) : (
        <span className="px-3 py-1.5 text-sm text-gray-600 cursor-not-allowed">
          &larr; Week 0
        </span>
      )}

      <span className="font-mono font-semibold">
        Week {currentWeek}
      </span>

      {hasNext ? (
        <Link
          href={`/week/${currentWeek + 1}`}
          className="px-3 py-1.5 bg-bg-surface border border-border rounded-sm text-sm hover:border-border-focus transition-colors"
        >
          Week {currentWeek + 1} &rarr;
        </Link>
      ) : (
        <span className="px-3 py-1.5 text-sm text-gray-600 cursor-not-allowed">
          Week {TOTAL_WEEKS + 1} &rarr;
        </span>
      )}
    </div>
  );
}
