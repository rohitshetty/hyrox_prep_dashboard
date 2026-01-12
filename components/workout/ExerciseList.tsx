import type { Exercise } from '@/lib/types';

interface ExerciseListProps {
  exercises: Exercise[];
  compact?: boolean;
}

export function ExerciseList({ exercises, compact = false }: ExerciseListProps) {
  return (
    <div className={`space-y-${compact ? '1' : '2'}`}>
      {exercises.map((exercise, index) => (
        <ExerciseItem key={index} exercise={exercise} compact={compact} />
      ))}
    </div>
  );
}

interface ExerciseItemProps {
  exercise: Exercise;
  compact?: boolean;
}

function ExerciseItem({ exercise, compact }: ExerciseItemProps) {
  const prescription = formatPrescription(exercise);

  return (
    <div
      className={`
        flex justify-between items-start gap-2
        ${compact ? 'py-1' : 'p-2 bg-bg-surface rounded-sm'}
      `}
    >
      <span className={`text-gray-100 ${compact ? 'text-sm' : ''}`}>
        {exercise.name}
      </span>
      {prescription && (
        <span className="font-mono text-sm text-gray-400 whitespace-nowrap">
          {prescription}
        </span>
      )}
    </div>
  );
}

function formatPrescription(exercise: Exercise): string {
  const parts: string[] = [];

  if (exercise.sets && exercise.reps) {
    parts.push(`${exercise.sets}x${exercise.reps}`);
  } else if (exercise.sets && exercise.duration) {
    parts.push(`${exercise.sets}x${exercise.duration}`);
  } else if (exercise.prescription) {
    return exercise.prescription;
  }

  if (exercise.weight) {
    parts.push(`@ ${exercise.weight}`);
  }

  return parts.join(' ');
}
