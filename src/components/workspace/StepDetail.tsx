'use client';

import type { ProjectStep } from '@/types/project';
import { WiringGuide } from '@/components/diagram/WiringGuide';
import { CodeSnippet } from '@/components/code/CodeSnippet';
import { Badge } from '@/components/ui/Badge';

interface Props {
  step: ProjectStep;
  totalSteps: number;
}

const DIFFICULTY_COLORS = {
  beginner: 'green',
  intermediate: 'yellow',
  advanced: 'red',
} as const;

export function StepDetail({ step, totalSteps }: Props) {
  return (
    <div className="space-y-6">
      {/* Step header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">
          {step.stepNumber}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="text-xl font-bold text-gray-800">{step.titleHe}</h2>
            <Badge color="gray">שלב {step.stepNumber} מתוך {totalSteps}</Badge>
            <Badge color="cyan">⏱ {step.estimatedMinutes} דקות</Badge>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{step.descriptionHe}</p>
        </div>
      </div>

      {/* Wiring */}
      {(step.connections || step.wiringTextHe) && (
        <section>
          <h3 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            🔌 חיבורי חוטים
          </h3>
          <WiringGuide
            connections={step.connections ?? []}
            wiringTextHe={step.wiringTextHe}
          />
        </section>
      )}

      {/* Code */}
      {step.code && (
        <section>
          <h3 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            💻 הקוד
          </h3>
          <CodeSnippet codeStep={step.code} />
        </section>
      )}

      {/* Test instructions */}
      {step.testInstructionsHe && (
        <section className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
            🧪 איך לבדוק?
          </h3>
          <p className="text-purple-700 text-sm leading-relaxed">{step.testInstructionsHe}</p>
        </section>
      )}

      {/* Success criteria */}
      <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
          🎯 כיצד תדע שהצלחת?
        </h3>
        <p className="text-emerald-700 text-sm leading-relaxed">{step.successCriteriaHe}</p>
      </section>

      {/* Hints (collapsed) */}
      {step.hintsHe.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-amber-600 flex items-center gap-2 select-none">
            <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
            רמזים (לחץ רק אם תקוע 😊)
          </summary>
          <div className="mt-3 space-y-2">
            {step.hintsHe.map((hint, i) => (
              <div key={i} className="flex gap-2 text-sm text-amber-800 bg-amber-50 rounded-xl p-3">
                <span className="flex-shrink-0">💡</span>
                <span>{hint}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
