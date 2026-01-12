// Training Plan Types - matching combined_plan.yml structure

export interface TrainingPlan {
  meta: PlanMeta;
  runPlan: RunPlan;
  strengthPlan: StrengthPlan;
  hyroxPlan: HyroxPlan;
}

export interface PlanMeta {
  targetRace: string;
  goalTime: string;
  duration: string;
  startDate: string;
}

// ============================================================================
// RUNNING PLAN
// ============================================================================

export interface RunPlan {
  paces: Pace[];
  weeks: RunWeek[];
}

export interface Pace {
  zone: string;
  name: string;
  pace: string;
  purpose: string;
}

export interface RunWeek {
  name: string;
  dates: string;
  phase: Phase;
  volume: number | string;
  workouts: RunWorkout[];
}

export interface RunWorkout {
  day: DayAbbrev;
  type: RunType;
  distance: number | string;
  details: string;
}

export type RunType = 'Tempo' | 'Easy' | 'Intervals' | 'Long Run' | 'Strides' | 'Rest' | 'RACE';
export type DayAbbrev = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type Phase = 'Base' | 'Build' | 'Recovery' | 'Peak' | 'Taper' | 'Race';

// ============================================================================
// STRENGTH PLAN
// ============================================================================

export interface StrengthPlan {
  maxes: Maxes;
  periodization: Periodization;
  weeks: StrengthWeek[];
  cycleProgression?: CycleProgression;
}

export interface Maxes {
  squat: number;
  deadlift: number;
  bench: number;
}

export interface Periodization {
  [key: string]: {
    name: string;
    squat: string;
    bench: string;
    deadlift: string;
  };
}

export interface CycleProgression {
  cycle2?: { weeks: string; squat: string; bench: string; deadlift: string };
  cycle3?: { weeks: string; notes: string };
}

export interface StrengthWeek {
  week: number;
  phase: string;
  monday?: DayWorkout;
  tuesday?: DayWorkout;
  wednesday?: DayWorkout;
  thursday?: DayWorkout;
  friday?: DayWorkout;
  saturday?: DayWorkout;
  sunday?: DayWorkout;
}

export interface DayWorkout {
  name: string;
  duration: string;
  exercises: Exercise[];
  hyrox?: HyroxExercise[];
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number | string;
  weight?: string | number;
  duration?: string;
  notes?: string;
  exercises?: string; // For compound exercises like "Dead bugs 10/side + Bird dogs 10/side"
  prescription?: string;
}

export interface HyroxExercise {
  name: string;
  sets?: number;
  reps?: number;
  prescription?: string;
  duration?: string;
}

// ============================================================================
// HYROX PLAN
// ============================================================================

export interface HyroxPlan {
  raceSpec: RaceSpec;
  cycles: HyroxCycle[];
  raceDayStrategy: RaceDayStrategy;
}

export interface RaceSpec {
  runDistance: string;
  stations: Station[];
}

export interface Station {
  name: string;
  distance?: string;
  reps?: number;
  weight?: string | number;
  targetTime: string;
}

export interface HyroxCycle {
  name: string;
  weeks: string;
  focus: string;
  week1?: HyroxWeekDetail;
  week2?: HyroxWeekDetail;
  week3?: HyroxWeekDetail;
  week4?: HyroxWeekDetail;
  week5?: HyroxWeekDetail;
  week6?: HyroxWeekDetail;
  week7?: HyroxWeekDetail;
  week8?: HyroxWeekDetail;
  week9?: HyroxWeekDetail;
  week10?: HyroxWeekDetail;
  week11?: HyroxWeekDetail;
  week12?: HyroxWeekDetail;
}

export interface HyroxWeekDetail {
  theme: string;
  tuesday?: HyroxSession;
  saturday?: HyroxSession;
}

export interface HyroxSession {
  name: string;
  duration: string;
  notes?: string;
  workout?: HyroxBlock[];
}

export interface HyroxBlock {
  block: string;
  notes?: string;
  exercises: HyroxBlockExercise[];
}

export interface HyroxBlockExercise {
  name: string;
  prescription?: string;
  rest?: string;
  notes?: string;
}

export interface RaceDayStrategy {
  target: string;
  runPace: string;
  stationTargets: StationTarget[];
  mantra: string;
}

export interface StationTarget {
  station: string;
  target: string;
  strategy: string;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const DAY_ABBREV_MAP: Record<DayOfWeek, DayAbbrev> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

export const PHASE_COLORS: Record<Phase, string> = {
  Base: 'phase-base',
  Build: 'phase-build',
  Recovery: 'phase-recovery',
  Peak: 'phase-peak',
  Taper: 'phase-taper',
  Race: 'phase-race',
};
