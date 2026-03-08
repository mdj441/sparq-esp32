'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/store/sessionStore';
import { StepTracker } from '@/components/workspace/StepTracker';
import { StepDetail } from '@/components/workspace/StepDetail';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

const DIFFICULTY_MAP = {
  beginner: { label: 'מתחיל', color: 'green' as const },
  intermediate: { label: 'בינוני', color: 'yellow' as const },
  advanced: { label: 'מתקדם', color: 'red' as const },
};

export default function SessionPage() {
  const router = useRouter();
  const { session, _hasHydrated, setCurrentStep, markStepComplete } = useSessionStore();

  // Wait for Zustand to hydrate from localStorage before redirecting
  useEffect(() => {
    if (!_hasHydrated) return;
    if (!session || !session.projectPlan) {
      router.replace('/');
    }
  }, [_hasHydrated, session, router]);

  // Show spinner while hydrating or if no session yet
  if (!_hasHydrated || !session || !session.projectPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">⚡</div>
      </div>
    );
  }

  const plan = session.projectPlan;
  const currentStep = plan.steps[session.currentStepIndex];
  const isFirstStep = session.currentStepIndex === 0;
  const isLastStep = session.currentStepIndex === plan.steps.length - 1;
  const isCurrentCompleted = session.completedSteps.includes(currentStep?.id ?? '');
  const diff = DIFFICULTY_MAP[session.difficulty];

  const handlePrev = () => {
    if (!isFirstStep) setCurrentStep(session.currentStepIndex - 1);
  };

  const handleNext = () => {
    if (currentStep && !isCurrentCompleted) markStepComplete(currentStep.id);
    if (!isLastStep) setCurrentStep(session.currentStepIndex + 1);
  };

  const handleComplete = () => {
    if (currentStep) markStepComplete(currentStep.id);
  };

  const progressPercent = Math.round(
    (session.completedSteps.length / plan.steps.length) * 100
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← יציאה
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-gray-800 text-sm">{plan.titleHe}</h1>
          <p className="text-xs text-gray-400">{plan.descriptionHe}</p>
        </div>
        <Badge color={diff.color}>{diff.label}</Badge>
        <div className="text-xs text-gray-500">
          {session.completedSteps.length}/{plan.steps.length} שלבים
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-1 bg-indigo-500 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: step tracker */}
        <aside className="w-56 bg-white border-l border-gray-200 p-3 overflow-y-auto hidden md:block flex-shrink-0">
          <StepTracker
            steps={plan.steps}
            currentIndex={session.currentStepIndex}
            completedSteps={session.completedSteps}
            onStepClick={setCurrentStep}
          />
        </aside>

        {/* Center: step detail */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {currentStep ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <StepDetail step={currentStep} totalSteps={plan.steps.length} />

              {/* Navigation */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={isFirstStep}
                >
                  → שלב קודם
                </Button>

                <div className="flex-1" />

                {!isCurrentCompleted && (
                  <Button variant="secondary" size="sm" onClick={handleComplete}>
                    ✓ סיימתי שלב זה!
                  </Button>
                )}

                {!isLastStep ? (
                  <Button size="sm" onClick={handleNext}>
                    שלב הבא ←
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleComplete}
                    disabled={isCurrentCompleted}
                  >
                    🏆 סיימתי את הפרויקט!
                  </Button>
                )}
              </div>

              {/* Completion celebration */}
              {isLastStep && isCurrentCompleted && (
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-3">🏆</div>
                  <h2 className="text-2xl font-black mb-2">כל הכבוד! סיימת!</h2>
                  <p className="text-indigo-100 text-sm mb-4">בנית פרויקט ESP32 שלם – זה ממש מדהים!</p>
                  <Link href="/">
                    <Button variant="outline" className="border-white text-white hover:bg-white/20">
                      בנה פרויקט נוסף ←
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">שלב לא נמצא</div>
          )}
        </main>

        {/* Right: chat panel */}
        <aside id="chat" className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 hidden lg:flex overflow-hidden">
          <ChatPanel />
        </aside>
      </div>

      {/* Mobile chat toggle button */}
      <div className="lg:hidden fixed bottom-4 left-4">
        <Link href="#chat">
          <button className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center text-xl">
            💬
          </button>
        </Link>
      </div>
    </div>
  );
}
