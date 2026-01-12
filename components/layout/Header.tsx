'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDaysUntilRace, getCurrentWeek, TOTAL_WEEKS } from '@/lib/dates';

export function Header() {
  const pathname = usePathname();
  const daysUntilRace = getDaysUntilRace();
  const currentWeek = getCurrentWeek();

  return (
    <header className="sticky top-0 z-50 bg-bg-base/90 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo */}
          <Link href="/" className="font-display text-xl tracking-wide text-accent hover:text-accent-dim transition-colors">
            HYROX PREP
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink href="/" active={pathname === '/'}>
              Today
            </NavLink>
            <NavLink href={`/week/${Math.max(1, Math.min(currentWeek, TOTAL_WEEKS))}`} active={pathname.startsWith('/week')}>
              Week
            </NavLink>
            <NavLink href="/stats" active={pathname === '/stats'}>
              Stats
            </NavLink>
          </nav>

          {/* Countdown */}
          <div className="flex flex-col items-end">
            <span className="font-mono text-lg font-semibold text-accent">
              {daysUntilRace > 0 ? daysUntilRace : 'RACE DAY'}
            </span>
            <span className="text-xs uppercase tracking-wider text-gray-500">
              {daysUntilRace > 0 ? 'Days to Race' : daysUntilRace === 0 ? 'GO TIME!' : 'Complete'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
        active
          ? 'bg-bg-elevated text-accent border border-accent/30'
          : 'text-gray-400 hover:text-white hover:bg-bg-surface'
      }`}
    >
      {children}
    </Link>
  );
}
