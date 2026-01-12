import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import type {
  TrainingPlan,
  RunWeek,
  RunWorkout,
  StrengthWeek,
  DayWorkout,
  DayOfWeek,
  DayAbbrev,
  DAY_ABBREV_MAP,
  HyroxCycle,
  HyroxWeekDetail,
} from './types';

let cachedPlan: TrainingPlan | null = null;

/**
 * Load and parse the training plan from YAML
 * Cached to avoid repeated file reads during build
 */
export function loadPlan(): TrainingPlan {
  if (cachedPlan) {
    return cachedPlan;
  }

  const filePath = path.join(process.cwd(), 'combined_plan.yml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  cachedPlan = yaml.load(fileContents) as TrainingPlan;
  return cachedPlan;
}

/**
 * Get a specific run week by week number (1-indexed)
 */
export function getRunWeek(weekNumber: number): RunWeek | null {
  const plan = loadPlan();
  return plan.runPlan.weeks[weekNumber - 1] || null;
}

/**
 * Get run workout for a specific day
 */
export function getRunWorkoutForDay(weekNumber: number, dayAbbrev: DayAbbrev): RunWorkout | null {
  const week = getRunWeek(weekNumber);
  if (!week) return null;
  return week.workouts.find((w) => w.day === dayAbbrev) || null;
}

/**
 * Get a specific strength week by week number (1-indexed)
 */
export function getStrengthWeek(weekNumber: number): StrengthWeek | null {
  const plan = loadPlan();
  return plan.strengthPlan.weeks.find((w) => w.week === weekNumber) || null;
}

/**
 * Get strength workout for a specific day
 */
export function getStrengthWorkoutForDay(weekNumber: number, day: DayOfWeek): DayWorkout | null {
  const week = getStrengthWeek(weekNumber);
  if (!week) return null;
  return week[day] || null;
}

/**
 * Get the Hyrox cycle for a given week number
 */
export function getHyroxCycleForWeek(weekNumber: number): { cycle: HyroxCycle; weekDetail: HyroxWeekDetail | null } | null {
  const plan = loadPlan();

  // Foundation: weeks 1-4
  // Build: weeks 5-8
  // Peak and Taper: weeks 9-12/13
  let cycle: HyroxCycle;
  let weekKey: string;

  if (weekNumber <= 4) {
    cycle = plan.hyroxPlan.cycles.find((c) => c.name === 'Foundation')!;
    weekKey = `week${weekNumber}`;
  } else if (weekNumber <= 8) {
    cycle = plan.hyroxPlan.cycles.find((c) => c.name === 'Build')!;
    weekKey = `week${weekNumber}`;
  } else {
    cycle = plan.hyroxPlan.cycles.find((c) => c.name === 'Peak and Taper')!;
    weekKey = `week${weekNumber}`;
  }

  if (!cycle) return null;

  const weekDetail = (cycle as unknown as Record<string, HyroxWeekDetail | undefined>)[weekKey];

  return {
    cycle,
    weekDetail: weekDetail || null,
  };
}

/**
 * Get Hyrox session for a specific day (usually Tuesday)
 */
export function getHyroxWorkoutForDay(weekNumber: number, day: DayOfWeek): { cycleName: string; theme: string; session: NonNullable<HyroxWeekDetail['tuesday']> } | null {
  const result = getHyroxCycleForWeek(weekNumber);
  if (!result || !result.weekDetail) return null;

  const session = result.weekDetail[day as 'tuesday' | 'saturday'];
  if (!session) return null;

  return {
    cycleName: result.cycle.name,
    theme: result.weekDetail.theme,
    session,
  };
}

/**
 * Calculate total mileage for a week
 */
export function getWeeklyMileage(weekNumber: number): number {
  const week = getRunWeek(weekNumber);
  if (!week) return 0;

  if (typeof week.volume === 'number') {
    return week.volume;
  }
  // Handle strings like "~14 km"
  const match = String(week.volume).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Get mileage breakdown by workout type for a week
 */
export function getWeeklyMileageByType(weekNumber: number): Record<string, number> {
  const week = getRunWeek(weekNumber);
  if (!week) return {};

  const byType: Record<string, number> = {};
  for (const workout of week.workouts) {
    const distance = typeof workout.distance === 'number' ? workout.distance : parseFloat(String(workout.distance)) || 0;
    byType[workout.type] = (byType[workout.type] || 0) + distance;
  }
  return byType;
}

/**
 * Get total program stats
 */
export function getProgramStats() {
  const plan = loadPlan();
  const weeks = plan.runPlan.weeks;

  let totalMileage = 0;
  let peakMileage = 0;
  const mileageByWeek: number[] = [];

  for (const week of weeks) {
    const volume = typeof week.volume === 'number' ? week.volume : parseInt(String(week.volume).replace(/[^\d]/g, '')) || 0;
    totalMileage += volume;
    peakMileage = Math.max(peakMileage, volume);
    mileageByWeek.push(volume);
  }

  return {
    totalMileage,
    peakMileage,
    averageMileage: Math.round(totalMileage / weeks.length),
    weekCount: weeks.length,
    mileageByWeek,
  };
}

/**
 * Get all data for a specific day across all plan types
 */
export function getDayData(weekNumber: number, day: DayOfWeek) {
  const dayAbbrevMap: Record<DayOfWeek, DayAbbrev> = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  };

  const runWeek = getRunWeek(weekNumber);
  const strengthWeek = getStrengthWeek(weekNumber);
  const hyroxData = getHyroxWorkoutForDay(weekNumber, day);

  return {
    week: runWeek,
    run: runWeek?.workouts.find((w) => w.day === dayAbbrevMap[day]) || null,
    strength: strengthWeek?.[day] || null,
    hyrox: hyroxData,
  };
}
