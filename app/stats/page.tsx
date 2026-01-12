import { loadPlan, getProgramStats, getWeeklyMileageByType } from '@/lib/plan';
import { formatWeekRange, TOTAL_WEEKS } from '@/lib/dates';
import { MileageChart } from '@/components/stats/MileageChart';
import { WorkoutTypeChart } from '@/components/stats/WorkoutTypeChart';
import { PhaseTimeline } from '@/components/stats/PhaseTimeline';
import { PhaseBadge } from '@/components/ui/PhaseBadge';

export default function StatsPage() {
  const plan = loadPlan();
  const stats = getProgramStats();

  // Prepare data for charts
  const mileageData = plan.runPlan.weeks.map((week, index) => ({
    week: index + 1,
    phase: week.phase,
    volume: typeof week.volume === 'number' ? week.volume : parseInt(String(week.volume).replace(/[^\d]/g, '')) || 0,
  }));

  const typeData = plan.runPlan.weeks.map((week, index) => {
    const byType = getWeeklyMileageByType(index + 1);
    return {
      week: index + 1,
      Tempo: byType['Tempo'] || 0,
      Easy: byType['Easy'] || 0,
      Intervals: byType['Intervals'] || 0,
      'Long Run': byType['Long Run'] || 0,
    };
  });

  const phaseData = plan.runPlan.weeks.map((week, index) => ({
    week: index + 1,
    phase: week.phase,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="font-display text-4xl mb-2">TRAINING STATS</h1>
        <p className="text-gray-400">Overview of your 12-week Hyrox preparation program</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard
          label="Total Mileage"
          value={`${stats.totalMileage}`}
          unit="km"
          highlight
        />
        <StatCard
          label="Average Weekly"
          value={`${stats.averageMileage}`}
          unit="km"
        />
        <StatCard
          label="Peak Week"
          value={`${stats.peakMileage}`}
          unit="km"
        />
        <StatCard
          label="Program Length"
          value={`${stats.weekCount}`}
          unit="weeks"
        />
      </div>

      {/* Training Phases Timeline */}
      <section className="mb-12">
        <SectionHeader title="Training Phases" />
        <div className="bg-bg-surface border border-border rounded-sm p-6">
          <PhaseTimeline phases={phaseData} />
        </div>
      </section>

      {/* Weekly Mileage Chart */}
      <section className="mb-12">
        <SectionHeader title="Weekly Running Volume" />
        <div className="bg-bg-surface border border-border rounded-sm p-6">
          <MileageChart data={mileageData} />
        </div>
      </section>

      {/* Mileage by Type Chart */}
      <section className="mb-12">
        <SectionHeader title="Volume by Workout Type" />
        <div className="bg-bg-surface border border-border rounded-sm p-6">
          <WorkoutTypeChart data={typeData} />
        </div>
      </section>

      {/* Week-by-Week Table */}
      <section>
        <SectionHeader title="Week-by-Week Breakdown" />
        <div className="bg-bg-surface border border-border rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg-elevated border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Week</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Phase</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Volume</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Key Workouts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {plan.runPlan.weeks.map((week, index) => {
                  const weekNum = index + 1;
                  const keyWorkouts = week.workouts
                    .filter(w => w.type !== 'Easy' && w.type !== 'Rest')
                    .map(w => `${w.type} (${w.distance}km)`)
                    .join(', ');

                  return (
                    <tr
                      key={weekNum}
                      className="hover:bg-bg-elevated/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <a
                          href={`/week/${weekNum}`}
                          className="font-mono text-accent hover:text-accent-dim transition-colors"
                        >
                          Week {weekNum}
                        </a>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-gray-400">
                        {week.dates}
                      </td>
                      <td className="px-4 py-3">
                        <PhaseBadge phase={week.phase} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        {week.volume} km
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate">
                        {keyWorkouts || 'Rest/Recovery'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Race Spec Summary */}
      <section className="mt-12">
        <SectionHeader title="Race Specifications" />
        <div className="bg-bg-surface border border-border rounded-sm p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-display text-lg mb-4 text-type-hyrox">RACE STATIONS</h3>
              <div className="space-y-2">
                {plan.hyroxPlan.raceSpec.stations.map((station, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-bg-elevated rounded-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-display text-lg text-type-hyrox/50">{index + 1}</span>
                      <span className="font-medium">{station.name}</span>
                    </div>
                    <span className="font-mono text-sm text-gray-400">
                      {station.distance || `${station.reps} reps`}
                      {station.weight && ` @ ${station.weight}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg mb-4 text-accent">RACE DAY STRATEGY</h3>
              <div className="space-y-4">
                <div className="p-4 bg-bg-elevated rounded-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Target Time</p>
                  <p className="font-mono text-2xl text-accent">{plan.hyroxPlan.raceDayStrategy.target}</p>
                </div>
                <div className="p-4 bg-bg-elevated rounded-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Run Pace</p>
                  <p className="font-mono text-lg">{plan.hyroxPlan.raceDayStrategy.runPace}</p>
                </div>
                <div className="p-4 bg-accent/10 border border-accent/30 rounded-sm">
                  <p className="text-xs text-accent uppercase tracking-wider mb-2">Race Mantra</p>
                  <p className="font-display text-lg text-accent">
                    &ldquo;{plan.hyroxPlan.raceDayStrategy.mantra}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="font-display text-xl text-gray-400 mb-4">{title.toUpperCase()}</h2>
  );
}

function StatCard({
  label,
  value,
  unit,
  highlight = false,
}: {
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-sm border ${highlight ? 'bg-accent/10 border-accent/30' : 'bg-bg-surface border-border'}`}>
      <p className={`font-mono text-3xl font-semibold ${highlight ? 'text-accent' : ''}`}>
        {value}
        <span className="text-sm text-gray-500 ml-1">{unit}</span>
      </p>
      <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">{label}</p>
    </div>
  );
}
