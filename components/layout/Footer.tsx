import { RACE_DATE, formatDate } from '@/lib/dates';

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-base py-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-500 text-sm">
          Hyrox Training Dashboard
        </p>
        <p className="font-mono text-xs text-gray-600 mt-2">
          Race Day: {formatDate(RACE_DATE, 'MMMM d, yyyy')}
        </p>
      </div>
    </footer>
  );
}
