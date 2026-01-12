import {
  differenceInDays,
  addDays,
  addWeeks,
  format,
  startOfWeek,
  isAfter,
  isBefore,
  isSameDay,
} from 'date-fns';
import type { DayOfWeek } from './types';

// Plan starts on Monday, January 13, 2026
export const PLAN_START = new Date('2026-01-13T00:00:00');

// Race day is April 12, 2026 (Sunday of Week 13)
export const RACE_DATE = new Date('2026-04-12T00:00:00');

// Total weeks in the plan
export const TOTAL_WEEKS = 13;

/**
 * Get the current week number based on today's date
 * Returns 0 if before plan start, or TOTAL_WEEKS if after plan end
 */
export function getCurrentWeek(date: Date = new Date()): number {
  if (isBefore(date, PLAN_START)) {
    return 0; // Plan hasn't started yet
  }

  if (isAfter(date, RACE_DATE)) {
    return TOTAL_WEEKS + 1; // Plan is complete
  }

  const diffDays = differenceInDays(date, PLAN_START);
  return Math.min(Math.floor(diffDays / 7) + 1, TOTAL_WEEKS);
}

/**
 * Get the start and end dates for a specific week number
 */
export function getWeekDates(weekNumber: number): { start: Date; end: Date } {
  const start = addWeeks(PLAN_START, weekNumber - 1);
  const end = addDays(start, 6);
  return { start, end };
}

/**
 * Get the date for a specific day in a specific week
 */
export function getDateForDay(weekNumber: number, day: DayOfWeek): Date {
  const dayIndex: Record<DayOfWeek, number> = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
    saturday: 5,
    sunday: 6,
  };

  const weekStart = addWeeks(PLAN_START, weekNumber - 1);
  return addDays(weekStart, dayIndex[day]);
}

/**
 * Get the day of week name (lowercase) from a date
 */
export function getDayOfWeek(date: Date): DayOfWeek {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
}

/**
 * Get days until race
 */
export function getDaysUntilRace(date: Date = new Date()): number {
  const days = differenceInDays(RACE_DATE, date);
  return Math.max(0, days);
}

/**
 * Format date for display
 */
export function formatDate(date: Date, formatStr: string = 'MMMM d, yyyy'): string {
  return format(date, formatStr);
}

/**
 * Format date range for week display
 */
export function formatWeekRange(weekNumber: number): string {
  const { start, end } = getWeekDates(weekNumber);
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Check if a date is in the current week
 */
export function isCurrentWeek(weekNumber: number): boolean {
  return getCurrentWeek() === weekNumber;
}

/**
 * Get the day index (0-6, Monday=0) for navigation
 */
export function getDayIndex(day: DayOfWeek): number {
  const index: Record<DayOfWeek, number> = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
    saturday: 5,
    sunday: 6,
  };
  return index[day];
}

/**
 * Get the previous day
 */
export function getPreviousDay(day: DayOfWeek): { day: DayOfWeek; crossedWeek: boolean } {
  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const currentIndex = days.indexOf(day);

  if (currentIndex === 0) {
    return { day: 'sunday', crossedWeek: true };
  }
  return { day: days[currentIndex - 1], crossedWeek: false };
}

/**
 * Get the next day
 */
export function getNextDay(day: DayOfWeek): { day: DayOfWeek; crossedWeek: boolean } {
  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const currentIndex = days.indexOf(day);

  if (currentIndex === 6) {
    return { day: 'monday', crossedWeek: true };
  }
  return { day: days[currentIndex + 1], crossedWeek: false };
}

/**
 * Get plan status
 */
export function getPlanStatus(date: Date = new Date()): 'not_started' | 'in_progress' | 'completed' {
  if (isBefore(date, PLAN_START)) {
    return 'not_started';
  }
  if (isAfter(date, RACE_DATE)) {
    return 'completed';
  }
  return 'in_progress';
}
