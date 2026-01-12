import Link from 'next/link';
import { loadPlan, getDayData, getWeeklyMileage } from '@/lib/plan';
import { getCurrentWeek, getDayOfWeek, formatDate, getDateForDay, TOTAL_WEEKS, getPlanStatus } from '@/lib/dates';
import { PhaseBadge } from '@/components/ui/PhaseBadge';
import { RunWorkout } from '@/components/workout/RunWorkout';
import { StrengthWorkout } from '@/components/workout/StrengthWorkout';
import { HyroxWorkout } from '@/components/workout/HyroxWorkout';
import { WorkoutCard } from '@/components/workout/WorkoutCard';
import type { DayOfWeek } from '@/lib/types';

export default function HomePage() {
  const plan = loadPlan();
  const today = new Date();
  const planStatus = getPlanStatus(today);

  // Handle edge cases
  if (planStatus === 'not_started') {
    return <PrePlanView plan={plan} />;
  }

  if (planStatus === 'completed') {
    return <PostPlanView />;
  }

  const currentWeek = getCurrentWeek(today);
  const dayOfWeek = getDayOfWeek(today);
  const weekData = plan.runPlan.weeks[currentWeek - 1];
  const dayData = getDayData(currentWeek, dayOfWeek);
  const weeklyMileage = getWeeklyMileage(currentWeek);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Today Header */}
      <div className="mb-8 reveal-item">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Today</p>
            <h1 className="font-display text-4xl sm:text-6xl capitalize">{dayOfWeek}</h1>
            <p className="font-mono text-gray-400 mt-1">{formatDate(today)}</p>
          </div>
          <div className="text-left sm:text-right">
            <PhaseBadge phase={weekData.phase} size="lg" />
            <p className="font-mono text-sm text-gray-400 mt-2">
              Week {currentWeek} of {TOTAL_WEEKS}
            </p>
          </div>
        </div>

        {/* Week Stats Bar */}
        <div className="flex flex-wrap gap-6 p-4 bg-bg-surface rounded-sm border border-border">
          <div>
            <p className="font-mono text-2xl font-semibold">{weeklyMileage} <span className="text-sm text-gray-500">km</span></p>
            <p className="text-xs uppercase tracking-wider text-gray-500">Weekly Volume</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-semibold">{weekData.workouts.length}</p>
            <p className="text-xs uppercase tracking-wider text-gray-500">Run Sessions</p>
          </div>
          <div className="ml-auto">
            <Link
              href={`/week/${currentWeek}`}
              className="text-sm text-accent hover:text-accent-dim transition-colors"
            >
              View Full Week &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Today's Workouts */}
      <div className="space-y-4">
        <h2 className="font-display text-xl text-gray-400 reveal-item">TODAY&apos;S TRAINING</h2>

        {dayOfWeek === 'sunday' ? (
          <RestDayCard />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dayData.run && (
              <div className="reveal-item">
                <RunWorkout workout={dayData.run} />
              </div>
            )}

            {dayData.strength && (
              <div className="reveal-item">
                <StrengthWorkout
                  workout={dayData.strength}
                  phase={plan.strengthPlan.weeks.find(w => w.week === currentWeek)?.phase}
                />
              </div>
            )}

            {dayData.hyrox && (
              <div className="reveal-item">
                <HyroxWorkout
                  cycleName={dayData.hyrox.cycleName}
                  theme={dayData.hyrox.theme}
                  session={dayData.hyrox.session}
                  compact
                />
              </div>
            )}

            {!dayData.run && !dayData.strength && !dayData.hyrox && (
              <RestDayCard />
            )}
          </div>
        )}
      </div>

      {/* Quick Navigation */}
      <div className="mt-12 pt-8 border-t border-border reveal-item">
        <div className="flex justify-between items-center">
          <NavigationLink
            href={`/week/${currentWeek}/${getPreviousDay(dayOfWeek)}`}
            direction="prev"
            label={formatPreviousDayLabel(dayOfWeek, currentWeek)}
          />
          <Link
            href={`/week/${currentWeek}/${dayOfWeek}`}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Full Day Details
          </Link>
          <NavigationLink
            href={`/week/${currentWeek}/${getNextDay(dayOfWeek)}`}
            direction="next"
            label={formatNextDayLabel(dayOfWeek, currentWeek)}
          />
        </div>
      </div>
    </div>
  );
}

function RestDayCard() {
  return (
    <WorkoutCard type="rest" title="Rest Day" className="md:col-span-2 lg:col-span-3">
      <div className="text-center py-8">
        <p className="text-4xl mb-4">&#128716;</p>
        <p className="text-gray-400">Full recovery. Optional light stretching or walk.</p>
      </div>
    </WorkoutCard>
  );
}

function PrePlanView({ plan }: { plan: ReturnType<typeof loadPlan> }) {
  const week1 = plan.runPlan.weeks[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <h1 className="font-display text-4xl mb-4">Training Starts Soon</h1>
      <p className="text-gray-400 mb-8">
        Your 12-week Hyrox preparation program begins on January 13, 2026.
      </p>
      <div className="bg-bg-surface border border-border rounded-sm p-6 text-left">
        <h2 className="font-display text-xl mb-4">Week 1 Preview</h2>
        <PhaseBadge phase={week1.phase} />
        <p className="font-mono text-sm text-gray-400 mt-2">{week1.volume} km total volume</p>
        <Link
          href="/week/1"
          className="inline-block mt-4 text-accent hover:text-accent-dim transition-colors"
        >
          View Week 1 Details &rarr;
        </Link>
      </div>
    </div>
  );
}

function PostPlanView() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <h1 className="font-display text-5xl text-accent mb-4">RACE COMPLETE!</h1>
      <p className="text-gray-400 mb-8">
        Congratulations on completing your Hyrox training program.
      </p>
      <Link
        href="/stats"
        className="inline-block px-6 py-3 bg-accent text-bg-base font-semibold rounded-sm hover:bg-accent-dim transition-colors"
      >
        View Training Stats
      </Link>
    </div>
  );
}

function NavigationLink({ href, direction, label }: { href: string; direction: 'prev' | 'next'; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm text-gray-400 hover:text-white transition-colors"
    >
      {direction === 'prev' && <span>&larr; </span>}
      {label}
      {direction === 'next' && <span> &rarr;</span>}
    </Link>
  );
}

function getPreviousDay(day: DayOfWeek): DayOfWeek {
  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const index = days.indexOf(day);
  return days[index === 0 ? 6 : index - 1];
}

function getNextDay(day: DayOfWeek): DayOfWeek {
  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const index = days.indexOf(day);
  return days[index === 6 ? 0 : index + 1];
}

function formatPreviousDayLabel(day: DayOfWeek, week: number): string {
  const prevDay = getPreviousDay(day);
  if (day === 'monday') {
    return week > 1 ? `Week ${week - 1} Sunday` : 'Sunday';
  }
  return prevDay.charAt(0).toUpperCase() + prevDay.slice(1);
}

function formatNextDayLabel(day: DayOfWeek, week: number): string {
  const nextDay = getNextDay(day);
  if (day === 'sunday') {
    return week < TOTAL_WEEKS ? `Week ${week + 1} Monday` : 'Monday';
  }
  return nextDay.charAt(0).toUpperCase() + nextDay.slice(1);
}
