# Hyrox Training Dashboard - Specification

## Overview

A personal training dashboard for Hyrox race preparation. Displays daily workouts from a 12-week training plan covering running, strength, and Hyrox station work. All data is derived from `combined_plan.yml` at build time.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts (lightweight, React-native charting)
- **YAML Parsing**: `js-yaml` (parse at build time)
- **Date Handling**: `date-fns`
- **Deployment**: Static export (compatible with Netlify, Vercel, etc.)

## Data Strategy

- Parse `combined_plan.yml` at build time using `js-yaml`
- Generate static pages for all routes
- Plan updates require rebuild/redeploy
- No runtime data fetching, no database, no API routes needed

## Pages & Routes

### 1. Home / Today's Workout (`/`)

**Purpose**: Quick view of what to do today

**Content**:
- Current date display
- Current week number and phase (Base/Build/Recovery/Peak/Taper)
- Today's workouts from all three plans:
  - Running workout (if scheduled)
  - Strength workout (if scheduled)
  - Hyrox station work (if scheduled)
- Weekly mileage summary (current week)
- Quick navigation to previous/next day

**Logic**:
- Determine current date
- Map date to week number (Week 1 starts Jan 13, 2026)
- Find workouts for current day of week (Mon-Sun)

### 2. Weekly View (`/week/[weekNumber]`)

**Purpose**: See all workouts for a specific week

**Content**:
- Week number, date range, phase name
- Phase philosophy/description
- 7-day grid showing all workouts:
  - Monday: Tempo Run + Squat Focus
  - Tuesday: Hyrox Endurance Day
  - Wednesday: Easy Run + Upper Hypertrophy
  - Thursday: Bench Focus + Light Hyrox
  - Friday: Intervals + Lower Hypertrophy
  - Saturday: Long Run + Deadlift Focus
  - Sunday: Rest
- Weekly totals:
  - Running mileage
  - Strength session count
  - Hyrox session count
- Navigation: Previous/Next week

**Routes**: `/week/1` through `/week/13` (12 weeks + race week)

### 3. Day Detail (`/week/[weekNumber]/[day]`)

**Purpose**: Full workout details for a specific day

**Content**:
- Day and date
- Full workout details with all sets, reps, weights, notes
- Pace targets for runs
- Exercise-by-exercise breakdown for strength
- Station prescriptions for Hyrox days
- Back to week view link

**Routes**: e.g., `/week/3/monday`, `/week/5/saturday`

### 4. Stats Overview (`/stats`)

**Purpose**: Bird's-eye view of the entire training plan

**Content**:

**Charts**:
- Weekly running mileage (line chart, 13 data points)
- Mileage by workout type (stacked bar: Tempo, Easy, Intervals, Long Run)
- Training phases timeline (visual blocks showing Base/Build/Recovery/Peak/Taper)

**Summary Stats**:
- Total program mileage
- Average weekly mileage
- Peak week mileage
- Workout count by type

**Tables**:
- Week-by-week breakdown: Week | Phase | Volume | Key Workouts

## Data Model

### Parsed from YAML

```typescript
interface TrainingPlan {
  meta: {
    targetRace: string;
    goalTime: string;
    duration: string;
    startDate: string;
  };
  runPlan: {
    paces: Pace[];
    weeks: RunWeek[];
  };
  strengthPlan: {
    maxes: Maxes;
    periodization: Periodization;
    weeks: StrengthWeek[];
  };
  hyroxPlan: {
    raceSpec: RaceSpec;
    cycles: HyroxCycle[];
    raceDayStrategy: RaceDayStrategy;
  };
}

interface RunWeek {
  name: string;
  dates: string;
  phase: string;
  volume: number | string;
  workouts: RunWorkout[];
}

interface RunWorkout {
  day: string;        // "Mon", "Wed", "Fri", "Sat"
  type: string;       // "Tempo", "Easy", "Intervals", "Long Run"
  distance: number | string;
  details: string;
}

interface StrengthWeek {
  week: number;
  phase: string;
  monday?: DayWorkout;
  tuesday?: DayWorkout;
  wednesday?: DayWorkout;
  thursday?: DayWorkout;
  friday?: DayWorkout;
  saturday?: DayWorkout;
}

interface DayWorkout {
  name: string;
  duration: string;
  exercises: Exercise[];
  hyrox?: HyroxExercise[];
}

interface Exercise {
  name: string;
  sets?: number;
  reps?: number | string;
  weight?: string | number;
  duration?: string;
  notes?: string;
}
```

## Components

### Layout Components

- `Header` - Navigation, current week indicator
- `Footer` - Links, race countdown

### Page Components

- `TodayView` - Today's workout card with all plan types
- `WeekGrid` - 7-day week layout with workout summaries
- `DayDetail` - Full workout breakdown
- `StatsCharts` - Recharts visualizations

### Shared Components

- `WorkoutCard` - Display a single workout (run/strength/hyrox)
- `ExerciseList` - List of exercises with sets/reps
- `WeekNav` - Previous/Next week navigation
- `DayNav` - Previous/Next day navigation
- `PhaseBadge` - Colored badge showing current phase
- `MileageStat` - Weekly/total mileage display
- `Chart` wrappers - LineChart, BarChart for stats

## Date/Week Mapping Logic

```typescript
const PLAN_START = new Date('2026-01-13'); // Monday, Week 1

function getCurrentWeek(date: Date): number {
  const diffDays = differenceInDays(date, PLAN_START);
  return Math.floor(diffDays / 7) + 1;
}

function getWeekDates(weekNumber: number): { start: Date; end: Date } {
  const start = addWeeks(PLAN_START, weekNumber - 1);
  const end = addDays(start, 6);
  return { start, end };
}

function getDayOfWeek(date: Date): string {
  // Returns "monday", "tuesday", etc.
  return format(date, 'EEEE').toLowerCase();
}
```

## Build-Time Data Loading

```typescript
// lib/plan.ts
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

export function loadPlan(): TrainingPlan {
  const filePath = path.join(process.cwd(), 'combined_plan.yml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContents) as TrainingPlan;
}

// Usage in page components (server components)
// Data is loaded at build time for static export
```

## Static Generation

```typescript
// app/week/[weekNumber]/page.tsx
export function generateStaticParams() {
  return Array.from({ length: 13 }, (_, i) => ({
    weekNumber: String(i + 1),
  }));
}

// app/week/[weekNumber]/[day]/page.tsx
export function generateStaticParams() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const params = [];
  for (let week = 1; week <= 13; week++) {
    for (const day of days) {
      params.push({ weekNumber: String(week), day });
    }
  }
  return params;
}
```

## File Structure

```
hyrox-prep/
├── combined_plan.yml          # Source data
├── spec.md                    # This file
├── app/
│   ├── layout.tsx             # Root layout with header/footer
│   ├── page.tsx               # Home - today's workout
│   ├── stats/
│   │   └── page.tsx           # Stats overview with charts
│   └── week/
│       └── [weekNumber]/
│           ├── page.tsx       # Weekly view
│           └── [day]/
│               └── page.tsx   # Day detail view
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── workout/
│   │   ├── WorkoutCard.tsx
│   │   ├── ExerciseList.tsx
│   │   ├── RunWorkout.tsx
│   │   ├── StrengthWorkout.tsx
│   │   └── HyroxWorkout.tsx
│   ├── navigation/
│   │   ├── WeekNav.tsx
│   │   └── DayNav.tsx
│   ├── stats/
│   │   ├── MileageChart.tsx
│   │   ├── WorkoutTypeChart.tsx
│   │   └── PhaseTimeline.tsx
│   └── ui/
│       ├── PhaseBadge.tsx
│       ├── MileageStat.tsx
│       └── Card.tsx
├── lib/
│   ├── plan.ts                # YAML loading & parsing
│   ├── dates.ts               # Date/week utilities
│   └── types.ts               # TypeScript interfaces
├── tailwind.config.ts
├── next.config.js             # Static export config
└── package.json
```

## Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // Static export
  images: {
    unoptimized: true,        // For static export
  },
};

module.exports = nextConfig;
```

## UI/UX Guidelines

### Design Principles
- Clean, minimal interface focused on information clarity
- Mobile-responsive (workouts often checked at gym)
- High contrast for readability
- Phase-based color coding for quick visual reference

### Phase Colors
- Base: Blue (`bg-blue-100`, `text-blue-800`)
- Build: Green (`bg-green-100`, `text-green-800`)
- Recovery: Yellow (`bg-yellow-100`, `text-yellow-800`)
- Peak: Orange (`bg-orange-100`, `text-orange-800`)
- Taper: Purple (`bg-purple-100`, `text-purple-800`)
- Race: Red (`bg-red-100`, `text-red-800`)

### Workout Type Colors
- Running: Blue shades
- Strength: Green shades
- Hyrox: Orange shades

## Implementation Order

1. **Setup**: Initialize Next.js project, Tailwind, dependencies
2. **Data Layer**: Implement YAML parsing, types, date utilities
3. **Home Page**: Today's workout view
4. **Week View**: Weekly grid with all workouts
5. **Day Detail**: Full workout breakdown
6. **Stats Page**: Charts and summary tables
7. **Navigation**: Header, week/day navigation
8. **Polish**: Responsive design, loading states, edge cases

## Edge Cases

- **Before plan start** (before Jan 13, 2026): Show Week 1 preview
- **After plan end** (after April 12, 2026): Show race complete message
- **Rest days**: Display "Rest Day" with recovery tips
- **Race day**: Special race day display with strategy
