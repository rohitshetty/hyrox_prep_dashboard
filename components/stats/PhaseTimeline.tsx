'use client';

import { getCurrentWeek, TOTAL_WEEKS } from '@/lib/dates';

interface PhaseTimelineProps {
  phases: Array<{
    week: number;
    phase: string;
  }>;
}

const phaseColors: Record<string, string> = {
  Base: 'bg-phase-base',
  Build: 'bg-phase-build',
  Recovery: 'bg-phase-recovery',
  Peak: 'bg-phase-peak',
  Taper: 'bg-phase-taper',
  Race: 'bg-phase-race',
};

export function PhaseTimeline({ phases }: PhaseTimelineProps) {
  const currentWeek = getCurrentWeek();

  // Group consecutive weeks by phase
  const phaseBlocks: Array<{ phase: string; startWeek: number; endWeek: number }> = [];

  let currentPhase = phases[0]?.phase;
  let startWeek = 1;

  phases.forEach((item, index) => {
    if (item.phase !== currentPhase || index === phases.length - 1) {
      // Push the previous block
      if (index === phases.length - 1 && item.phase === currentPhase) {
        phaseBlocks.push({ phase: currentPhase, startWeek, endWeek: index + 1 });
      } else {
        phaseBlocks.push({ phase: currentPhase, startWeek, endWeek: index });
        if (index === phases.length - 1) {
          phaseBlocks.push({ phase: item.phase, startWeek: index + 1, endWeek: index + 1 });
        }
      }
      currentPhase = item.phase;
      startWeek = index + 1;
    }
  });

  return (
    <div className="space-y-4">
      {/* Timeline bar */}
      <div className="relative">
        <div className="flex h-12 rounded-sm overflow-hidden">
          {phaseBlocks.map((block, index) => {
            const width = ((block.endWeek - block.startWeek + 1) / TOTAL_WEEKS) * 100;
            const isCurrentPhase = currentWeek >= block.startWeek && currentWeek <= block.endWeek;

            return (
              <div
                key={index}
                className={`${phaseColors[block.phase]} relative flex items-center justify-center transition-opacity ${
                  isCurrentPhase ? 'opacity-100' : 'opacity-70'
                }`}
                style={{ width: `${width}%` }}
              >
                <span className="font-display text-xs tracking-wide text-white/90 mix-blend-difference">
                  {block.phase.toUpperCase()}
                </span>
                {isCurrentPhase && (
                  <div className="absolute inset-0 border-2 border-accent animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        {/* Current week marker */}
        {currentWeek > 0 && currentWeek <= TOTAL_WEEKS && (
          <div
            className="absolute top-0 w-0.5 h-full bg-accent"
            style={{ left: `${((currentWeek - 0.5) / TOTAL_WEEKS) * 100}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-accent text-bg-base text-xs font-semibold px-2 py-0.5 rounded">
              W{currentWeek}
            </div>
          </div>
        )}
      </div>

      {/* Week numbers */}
      <div className="flex justify-between px-1">
        {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map((week) => (
          <span
            key={week}
            className={`text-xs font-mono ${
              week === currentWeek ? 'text-accent font-semibold' : 'text-gray-500'
            }`}
          >
            {week}
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        {Object.entries(phaseColors).map(([phase, color]) => (
          <div key={phase} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-xs text-gray-400">{phase}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
