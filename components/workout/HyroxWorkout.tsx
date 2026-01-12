import { WorkoutCard } from './WorkoutCard';

interface HyroxWorkoutProps {
  cycleName: string;
  theme: string;
  session: {
    name: string;
    duration: string;
    notes?: string;
    workout?: Array<{
      block: string;
      notes?: string;
      exercises: Array<{
        name: string;
        prescription?: string;
        rest?: string;
        notes?: string;
      }>;
    }>;
  };
  compact?: boolean;
  className?: string;
}

export function HyroxWorkout({ cycleName, theme, session, compact = false, className }: HyroxWorkoutProps) {
  if (compact) {
    return (
      <WorkoutCard
        type="hyrox"
        title={session.name}
        subtitle={`${cycleName} Cycle`}
        duration={session.duration}
        className={className}
      >
        <div className="p-2 bg-bg-surface rounded-sm">
          <p className="text-sm text-gray-300">{theme}</p>
        </div>
      </WorkoutCard>
    );
  }

  return (
    <WorkoutCard
      type="hyrox"
      title={session.name}
      subtitle={`${cycleName} Cycle`}
      duration={session.duration}
      className={className}
    >
      <p className="text-sm text-gray-400 mb-4">{theme}</p>

      {session.workout && session.workout.map((block, blockIndex) => (
        <div key={blockIndex} className="mb-4 last:mb-0">
          <h4 className="text-sm font-semibold text-type-hyrox mb-2">{block.block}</h4>
          {block.notes && (
            <p className="text-xs text-gray-500 italic mb-2">{block.notes}</p>
          )}
          <div className="space-y-2">
            {block.exercises.map((exercise, exIndex) => (
              <div key={exIndex} className="p-2 bg-bg-surface rounded-sm border-l-2 border-l-type-hyrox">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm font-medium">{exercise.name}</span>
                  {exercise.rest && (
                    <span className="font-mono text-xs text-gray-500 bg-bg-elevated px-2 py-0.5 rounded">
                      Rest: {exercise.rest}
                    </span>
                  )}
                </div>
                {exercise.prescription && (
                  <pre className="font-mono text-xs text-gray-400 mt-1 whitespace-pre-wrap">
                    {exercise.prescription}
                  </pre>
                )}
                {exercise.notes && (
                  <p className="text-xs text-gray-500 italic mt-1">{exercise.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </WorkoutCard>
  );
}
