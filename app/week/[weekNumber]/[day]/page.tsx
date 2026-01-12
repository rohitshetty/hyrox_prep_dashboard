import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadPlan, getDayData, getStrengthWeek, getHyroxWorkoutForDay } from '@/lib/plan';
import { formatDate, getDateForDay, isToday, TOTAL_WEEKS } from '@/lib/dates';
import { PhaseBadge } from '@/components/ui/PhaseBadge';
import { ExerciseList } from '@/components/workout/ExerciseList';
import { HyroxWorkout } from '@/components/workout/HyroxWorkout';
import type { DayOfWeek } from '@/lib/types';

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// Generate static params for all week/day combinations
export function generateStaticParams() {
  const params = [];
  for (let week = 1; week <= TOTAL_WEEKS; week++) {
    for (const day of DAYS) {
      params.push({ weekNumber: String(week), day });
    }
  }
  return params;
}

interface PageProps {
  params: Promise<{ weekNumber: string; day: string }>;
}

export default async function DayPage({ params }: PageProps) {
  const { weekNumber: weekNumberStr, day: dayParam } = await params;
  const weekNumber = parseInt(weekNumberStr, 10);
  const day = dayParam as DayOfWeek;

  if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > TOTAL_WEEKS) {
    notFound();
  }

  if (!DAYS.includes(day)) {
    notFound();
  }

  const plan = loadPlan();
  const dayData = getDayData(weekNumber, day);
  const strengthWeek = getStrengthWeek(weekNumber);
  const hyroxData = getHyroxWorkoutForDay(weekNumber, day);
  const dayDate = getDateForDay(weekNumber, day);
  const isTodayDate = isToday(dayDate);
  const runWeek = plan.runPlan.weeks[weekNumber - 1];

  // Navigation helpers
  const prevDay = getPreviousDay(day, weekNumber);
  const nextDay = getNextDay(day, weekNumber);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Day Header */}
      <div className="mb-8">
        <Link
          href={`/week/${weekNumber}`}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-4 inline-block"
        >
          &larr; Back to Week {weekNumber}
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-4xl sm:text-5xl capitalize">{day}</h1>
              {isTodayDate && (
                <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs font-semibold rounded">
                  TODAY
                </span>
              )}
            </div>
            <p className="font-mono text-gray-400">{formatDate(dayDate)}</p>
          </div>
          <div className="text-left sm:text-right">
            <PhaseBadge phase={runWeek.phase} />
            <p className="font-mono text-sm text-gray-400 mt-2">
              Week {weekNumber} of {TOTAL_WEEKS}
            </p>
          </div>
        </div>
      </div>

      {/* Workout Content */}
      <div className="space-y-8">
        {day === 'sunday' ? (
          <RestDayContent />
        ) : (
          <>
            {/* Running Workout */}
            {dayData.run && (
              <section className="reveal-item">
                <SectionHeader type="run" title="RUNNING" />
                <div className="bg-bg-surface border border-border rounded-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{dayData.run.type}</h3>
                      <p className="font-mono text-type-run">{dayData.run.distance} km</p>
                    </div>
                    <PaceReference paces={plan.runPlan.paces} />
                  </div>
                  <div className="p-4 bg-bg-elevated rounded-sm font-mono text-sm">
                    {dayData.run.details}
                  </div>
                </div>
              </section>
            )}

            {/* Strength Workout */}
            {dayData.strength && (
              <section className="reveal-item">
                <SectionHeader type="strength" title="STRENGTH" />
                <div className="bg-bg-surface border border-border rounded-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{dayData.strength.name}</h3>
                      <p className="font-mono text-type-strength">{strengthWeek?.phase} Phase</p>
                    </div>
                    <span className="font-mono text-sm text-gray-500">{dayData.strength.duration}</span>
                  </div>
                  <ExerciseList exercises={dayData.strength.exercises} />

                  {/* Hyrox exercises within strength day */}
                  {dayData.strength.hyrox && dayData.strength.hyrox.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <h4 className="text-sm font-display text-type-hyrox mb-3">HYROX STATION WORK</h4>
                      <div className="space-y-2">
                        {dayData.strength.hyrox.map((exercise, index) => (
                          <div key={index} className="p-3 bg-bg-elevated rounded-sm border-l-2 border-l-type-hyrox">
                            <p className="font-medium">{exercise.name}</p>
                            {exercise.prescription && (
                              <p className="font-mono text-sm text-gray-400">{exercise.prescription}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Hyrox Workout (Tuesday) */}
            {hyroxData && (
              <section className="reveal-item">
                <SectionHeader type="hyrox" title="HYROX STATION WORK" />
                <HyroxWorkout
                  cycleName={hyroxData.cycleName}
                  theme={hyroxData.theme}
                  session={hyroxData.session}
                />
              </section>
            )}

            {/* No workouts scheduled */}
            {!dayData.run && !dayData.strength && !hyroxData && (
              <RestDayContent />
            )}
          </>
        )}
      </div>

      {/* Day Navigation */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="flex justify-between items-center">
          {prevDay ? (
            <Link
              href={`/week/${prevDay.week}/${prevDay.day}`}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              &larr; {prevDay.day.charAt(0).toUpperCase() + prevDay.day.slice(1)}
              {prevDay.week !== weekNumber && ` (Week ${prevDay.week})`}
            </Link>
          ) : (
            <span className="text-sm text-gray-600">&larr; Start of Plan</span>
          )}

          {nextDay ? (
            <Link
              href={`/week/${nextDay.week}/${nextDay.day}`}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {nextDay.day.charAt(0).toUpperCase() + nextDay.day.slice(1)}
              {nextDay.week !== weekNumber && ` (Week ${nextDay.week})`} &rarr;
            </Link>
          ) : (
            <span className="text-sm text-gray-600">End of Plan &rarr;</span>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ type, title }: { type: 'run' | 'strength' | 'hyrox'; title: string }) {
  const colors = {
    run: 'text-type-run',
    strength: 'text-type-strength',
    hyrox: 'text-type-hyrox',
  };

  return (
    <h2 className={`font-display text-lg mb-3 ${colors[type]}`}>{title}</h2>
  );
}

function RestDayContent() {
  return (
    <div className="bg-bg-surface border border-border rounded-sm p-12 text-center">
      <p className="text-5xl mb-4">&#128716;</p>
      <h2 className="font-display text-2xl mb-2">REST DAY</h2>
      <p className="text-gray-400 max-w-md mx-auto">
        Full recovery day. Rest is when adaptation happens. Optional light stretching, walking, or mobility work.
      </p>
      <div className="mt-8 p-4 bg-bg-elevated rounded-sm inline-block">
        <h3 className="text-sm font-semibold mb-2">Recovery Tips</h3>
        <ul className="text-sm text-gray-400 text-left space-y-1">
          <li>&bull; Sleep 7-9 hours</li>
          <li>&bull; Stay hydrated</li>
          <li>&bull; Light foam rolling</li>
          <li>&bull; Protein-rich meals</li>
        </ul>
      </div>
    </div>
  );
}

function PaceReference({ paces }: { paces: Array<{ zone: string; name: string; pace: string }> }) {
  return (
    <div className="text-right">
      <p className="text-xs text-gray-500 mb-1">Pace Reference</p>
      <div className="flex flex-wrap justify-end gap-2">
        {paces.slice(0, 3).map((pace) => (
          <span key={pace.zone} className="text-xs font-mono bg-bg-elevated px-2 py-1 rounded">
            {pace.zone}: {pace.pace}
          </span>
        ))}
      </div>
    </div>
  );
}

function getPreviousDay(day: DayOfWeek, week: number): { day: DayOfWeek; week: number } | null {
  const dayIndex = DAYS.indexOf(day);

  if (dayIndex === 0) {
    // Monday - go to previous week's Sunday
    if (week > 1) {
      return { day: 'sunday', week: week - 1 };
    }
    return null;
  }

  return { day: DAYS[dayIndex - 1], week };
}

function getNextDay(day: DayOfWeek, week: number): { day: DayOfWeek; week: number } | null {
  const dayIndex = DAYS.indexOf(day);

  if (dayIndex === 6) {
    // Sunday - go to next week's Monday
    if (week < TOTAL_WEEKS) {
      return { day: 'monday', week: week + 1 };
    }
    return null;
  }

  return { day: DAYS[dayIndex + 1], week };
}
