import type { DayWorkout } from '@/lib/types';
import { WorkoutCard } from './WorkoutCard';
import { ExerciseList } from './ExerciseList';

interface StrengthWorkoutProps {
  workout: DayWorkout;
  phase?: string;
  className?: string;
}

export function StrengthWorkout({ workout, phase, className }: StrengthWorkoutProps) {
  return (
    <WorkoutCard
      type="strength"
      title={workout.name}
      subtitle={phase ? `${phase} Phase` : undefined}
      duration={workout.duration}
      className={className}
    >
      <ExerciseList exercises={workout.exercises.slice(0, 5)} />
      {workout.exercises.length > 5 && (
        <p className="text-xs text-gray-500 mt-2">
          +{workout.exercises.length - 5} more exercises
        </p>
      )}
    </WorkoutCard>
  );
}
