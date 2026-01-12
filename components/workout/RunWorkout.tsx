import type { RunWorkout as RunWorkoutType } from '@/lib/types';
import { WorkoutCard } from './WorkoutCard';

interface RunWorkoutProps {
  workout: RunWorkoutType;
  className?: string;
}

export function RunWorkout({ workout, className }: RunWorkoutProps) {
  const distance = typeof workout.distance === 'number'
    ? `${workout.distance} km`
    : workout.distance;

  // Estimate duration based on distance
  const distanceNum = typeof workout.distance === 'number'
    ? workout.distance
    : parseFloat(String(workout.distance)) || 0;

  const duration = distanceNum <= 6
    ? '30-40 min'
    : distanceNum <= 10
      ? '45-55 min'
      : '60-90 min';

  return (
    <WorkoutCard
      type="run"
      title={workout.type}
      subtitle={distance}
      duration={duration}
      className={className}
    >
      <div className="p-2 bg-bg-surface rounded-sm">
        <p className="text-sm text-gray-300">{workout.details}</p>
      </div>
    </WorkoutCard>
  );
}
