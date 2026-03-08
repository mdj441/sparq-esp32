'use client';

import { cn } from '@/lib/utils/cn';
import type { ProjectStep } from '@/types/project';

interface Props {
  steps: ProjectStep[];
  currentIndex: number;
  completedSteps: string[];
  onStepClick: (index: number) => void;
}

export function StepTracker({ steps, currentIndex, completedSteps, onStepClick }: Props) {
  return (
    <div className="flex flex-col gap-1 overflow-y-auto">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">שלבים</h3>
      {steps.map((step, i) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = i === currentIndex;
        const isLocked = !isCompleted && i > currentIndex;

        return (
          <button
            key={step.id}
            onClick={() => !isLocked && onStepClick(i)}
            disabled={isLocked}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right text-sm transition-all duration-150',
              isCurrent && 'bg-indigo-600 text-white font-semibold shadow-md',
              isCompleted && !isCurrent && 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
              !isCompleted && !isCurrent && !isLocked && 'text-gray-600 hover:bg-gray-100',
              isLocked && 'text-gray-300 cursor-not-allowed'
            )}
          >
            {/* Step icon */}
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                isCurrent && 'bg-white text-indigo-600',
                isCompleted && !isCurrent && 'bg-emerald-500 text-white',
                !isCompleted && !isCurrent && !isLocked && 'bg-gray-200 text-gray-600',
                isLocked && 'bg-gray-100 text-gray-300'
              )}
            >
              {isCompleted ? '✓' : step.stepNumber}
            </div>
            <span className="flex-1 text-right leading-tight">{step.titleHe}</span>
            <span className="text-xs opacity-60 flex-shrink-0">{step.estimatedMinutes}′</span>
          </button>
        );
      })}
    </div>
  );
}
