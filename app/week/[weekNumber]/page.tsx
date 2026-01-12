import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadPlan, getRunWeek, getStrengthWeek, getHyroxCycleForWeek, getWeeklyMileageByType } from '@/lib/plan';
import { formatWeekRange, getDateForDay, isCurrentWeek, isToday, TOTAL_WEEKS } from '@/lib/dates';
import { PhaseBadge } from '@/components/ui/PhaseBadge';
import { WeekNav } from '@/components/navigation/WeekNav';
import type { DayOfWeek, DayAbbrev } from '@/lib/types';

// Generate static params for all weeks
export function generateStaticParams() {
  return Array.from({ length: TOTAL_WEEKS }, (_, i) => ({
    weekNumber: String(i + 1),
  }));
}

interface PageProps {
  params: Promise<{ weekNumber: string }>;
}

export default async function WeekPage({ params }: PageProps) {
  const { weekNumber: weekNumberStr } = await params;
  const weekNumber = parseInt(weekNumberStr, 10);

  if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > TOTAL_WEEKS) {
    notFound();
  }

  const plan = loadPlan();
  const runWeek = getRunWeek(weekNumber);
  const strengthWeek = getStrengthWeek(weekNumber);
  const hyroxCycle = getHyroxCycleForWeek(weekNumber);
  const mileageByType = getWeeklyMileageByType(weekNumber);

  if (!runWeek) {
    notFound();
  }

  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayAbbrevMap: Record<DayOfWeek, DayAbbrev> = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  };

  const totalMileage = typeof runWeek.volume === 'number'
    ? runWeek.volume
    : parseInt(String(runWeek.volume).replace(/[^\d]/g, '')) || 0;

  const isCurrent = isCurrentWeek(weekNumber);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      {/* Week Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-3xl sm:text-4xl">{runWeek.name}</h1>
              {isCurrent && (
                <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs font-semibold rounded">
                  CURRENT
                </span>
              )}
            </div>
            <p className="font-mono text-sm text-gray-400">{formatWeekRange(weekNumber)}</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <PhaseBadge phase={runWeek.phase} size="lg" />
            <WeekNav currentWeek={weekNumber} />
          </div>
        </div>

        {/* Week Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Running Volume" value={`${totalMileage} km`} />
          <StatCard label="Run Sessions" value={String(runWeek.workouts.length)} />
          <StatCard label="Strength Phase" value={strengthWeek?.phase || 'N/A'} />
          <StatCard label="Hyrox Cycle" value={hyroxCycle?.cycle.name || 'N/A'} />
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="mb-12">
        <h2 className="font-display text-xl text-gray-400 mb-4">WEEKLY SCHEDULE</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {days.map((day) => {
            const dayDate = getDateForDay(weekNumber, day);
            const isTodayDate = isToday(dayDate);
            const runWorkout = runWeek.workouts.find((w) => w.day === dayAbbrevMap[day]);
            const strengthWorkout = strengthWeek?.[day];
            const isHyroxDay = day === 'tuesday';
            const isRestDay = day === 'sunday';

            return (
              <Link
                key={day}
                href={`/week/${weekNumber}/${day}`}
                className={`
                  block p-3 bg-bg-surface border rounded-sm transition-all hover:border-border-focus hover:-translate-y-0.5
                  ${isTodayDate ? 'border-accent shadow-[0_0_20px_rgba(212,245,5,0.15)]' : 'border-border'}
                `}
              >
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-border">
                  <span className={`font-semibold text-sm ${isTodayDate ? 'text-accent' : ''}`}>
                    {dayAbbrevMap[day]}
                  </span>
                  <span className="font-mono text-xs text-gray-500">
                    {dayDate.getDate()}
                  </span>
                </div>

                <div className="space-y-2 min-h-[120px]">
                  {isRestDay ? (
                    <DayActivity type="rest" title="Rest Day" subtitle="Recovery" />
                  ) : (
                    <>
                      {runWorkout && (
                        <DayActivity
                          type="run"
                          title={runWorkout.type}
                          subtitle={`${runWorkout.distance} km`}
                        />
                      )}
                      {strengthWorkout && (
                        <DayActivity
                          type="strength"
                          title={strengthWorkout.name.split(' - ')[0].replace('Day ', '')}
                          subtitle={strengthWorkout.duration}
                        />
                      )}
                      {isHyroxDay && hyroxCycle?.weekDetail?.tuesday && (
                        <DayActivity
                          type="hyrox"
                          title="Hyrox"
                          subtitle={hyroxCycle.weekDetail.tuesday.duration}
                        />
                      )}
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mileage Breakdown */}
      <div className="bg-bg-surface border border-border rounded-sm p-6">
        <h2 className="font-display text-lg mb-4">MILEAGE BY TYPE</h2>
        <div className="space-y-3">
          {Object.entries(mileageByType).map(([type, km]) => {
            const percentage = (km / totalMileage) * 100;
            const typeColor = getTypeColor(type);

            return (
              <div key={type} className="grid grid-cols-[80px_1fr_60px] gap-4 items-center">
                <span className="text-sm text-gray-400">{type}</span>
                <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${typeColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="font-mono text-sm text-right">{km} km</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-bg-surface border border-border rounded-sm">
      <p className="font-mono text-xl font-semibold">{value}</p>
      <p className="text-xs uppercase tracking-wider text-gray-500">{label}</p>
    </div>
  );
}

function DayActivity({ type, title, subtitle }: { type: 'run' | 'strength' | 'hyrox' | 'rest'; title: string; subtitle: string }) {
  const typeStyles = {
    run: 'bg-type-run/10 border-l-type-run',
    strength: 'bg-type-strength/10 border-l-type-strength',
    hyrox: 'bg-type-hyrox/10 border-l-type-hyrox',
    rest: 'bg-gray-600/10 border-l-gray-600',
  };

  return (
    <div className={`p-2 border-l-2 rounded-r-sm text-xs ${typeStyles[type]}`}>
      <p className="font-semibold truncate">{title}</p>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  );
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    Tempo: 'bg-orange-500',
    Intervals: 'bg-emerald-500',
    Easy: 'bg-cyan-400',
    'Long Run': 'bg-purple-500',
    Strides: 'bg-pink-500',
    Rest: 'bg-gray-500',
    RACE: 'bg-red-500',
  };
  return colors[type] || 'bg-gray-500';
}
