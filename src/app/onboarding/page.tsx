'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ComponentInventory } from '@/components/onboarding/ComponentInventory';
import { ProjectSuggestions } from '@/components/onboarding/ProjectSuggestions';
import { Button } from '@/components/ui/Button';
import { useSessionStore } from '@/store/sessionStore';
import type { Difficulty } from '@/types/project';
import type { ProjectSuggestion, ProjectPlan } from '@/types/project';

type Step = 'components' | 'idea' | 'suggestions' | 'planning';

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as 'idea' | 'suggest' | null;

  const { createSession, setProjectPlan } = useSessionStore();

  const [step, setStep] = useState<Step>('components');
  const [components, setComponents] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [childName, setChildName] = useState('');
  const [projectIdea, setProjectIdea] = useState('');
  const [suggestions, setSuggestions] = useState<ProjectSuggestion[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const difficultyOptions: { value: Difficulty; label: string; emoji: string }[] = [
    { value: 'beginner', label: 'מתחיל – זו הפעם הראשונה שלי', emoji: '🌱' },
    { value: 'intermediate', label: 'בינוני – כבר ניסיתי כמה דברים', emoji: '🌿' },
    { value: 'advanced', label: 'מתקדם – אני יודע לתכנת', emoji: '🌳' },
  ];

  const handleComponentsNext = () => {
    if (components.length === 0) {
      setError('יש לבחור לפחות רכיב אחד');
      return;
    }
    if (!components.includes('esp32')) {
      setError('חובה לבחור לוח ESP32 כדי להתחיל!');
      return;
    }
    setError('');
    setStep(mode === 'suggest' ? 'suggestions' : 'idea');
    if (mode === 'suggest') fetchSuggestions();
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/project/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components, difficulty }),
      });
      if (!res.ok) throw new Error('שגיאה בקבלת הצעות');
      const data = await res.json();
      setSuggestions(data.suggestions);
    } catch {
      setError('לא הצלחתי להביא הצעות. נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionSelect = async (suggestion: ProjectSuggestion) => {
    setProjectIdea(suggestion.titleHe);
    await generatePlan(suggestion.titleHe);
  };

  const handleIdeaNext = async () => {
    if (!projectIdea.trim()) {
      setError('ספר לי מה אתה רוצה לבנות!');
      return;
    }
    setError('');
    await generatePlan(projectIdea);
  };

  const generatePlan = async (idea: string) => {
    setStep('planning');
    setLoading(true);
    try {
      const res = await fetch('/api/project/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectIdea: idea, components, difficulty, childName }),
      });
      if (!res.ok) throw new Error('שגיאה ביצירת תוכנית');
      const data = await res.json();
      const plan: ProjectPlan = data.plan;

      const session = createSession({
        childName: childName || undefined,
        difficulty,
        availableComponents: components,
        projectIdea: idea,
      });
      setProjectPlan(plan);
      router.push(`/session/${session.id}`);
    } catch {
      setError('לא הצלחתי ליצור תוכנית. נסה שוב.');
      setStep(mode === 'idea' ? 'idea' : 'suggestions');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {['components', mode === 'suggest' ? 'suggestions' : 'idea', 'planning'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className="h-0.5 w-8 bg-gray-200" />}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step === s
                    ? 'bg-indigo-600 text-white'
                    : ['components', 'idea', 'suggestions', 'planning'].indexOf(step) > i
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          {/* Step: Components */}
          {step === 'components' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">שלום! מה שמך?</h2>
                <input
                  type="text"
                  placeholder="השם שלי הוא... (אופציונלי)"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full mt-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-indigo-400 outline-none text-gray-800 text-sm"
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">איזו רמה מתאימה לך?</h3>
                <div className="space-y-2">
                  {difficultyOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDifficulty(opt.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-right transition-all ${
                        difficulty === opt.value
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="text-xl">{opt.emoji}</span>
                      <span className="font-medium text-sm">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">אילו רכיבים יש לך?</h3>
                <ComponentInventory selected={components} onChange={setComponents} />
              </div>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <Button onClick={handleComponentsNext} className="w-full">
                הבא ←
              </Button>
            </div>
          )}

          {/* Step: Idea input */}
          {step === 'idea' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">מה אתה רוצה לבנות?</h2>
                <p className="text-gray-500 text-sm mb-4">
                  תאר את הפרויקט שחלמת עליו – למשל: &quot;רוצה להדליק נורה עם לחצן&quot; או &quot;משחק מהירות עם כפתורים&quot;
                </p>
                <textarea
                  placeholder="כתוב כאן את הרעיון שלך..."
                  value={projectIdea}
                  onChange={(e) => setProjectIdea(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 outline-none text-gray-800 resize-none"
                />
              </div>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('components')}>
                  → חזרה
                </Button>
                <Button onClick={handleIdeaNext} className="flex-1">
                  בואו נבנה! 🚀
                </Button>
              </div>
            </div>
          )}

          {/* Step: Suggestions */}
          {step === 'suggestions' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">הנה פרויקטים מגניבים עבורך!</h2>
                <p className="text-gray-500 text-sm">בחר פרויקט שמעניין אותך ונתחיל לבנות</p>
              </div>

              <ProjectSuggestions
                suggestions={suggestions}
                onSelect={handleSuggestionSelect}
                loading={loading}
              />

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <Button variant="outline" onClick={() => setStep('components')}>
                → חזרה
              </Button>
            </div>
          )}

          {/* Step: Planning (loading) */}
          {step === 'planning' && (
            <div className="text-center py-12 space-y-4">
              <div className="text-6xl animate-bounce">⚡</div>
              <h2 className="text-2xl font-bold text-gray-800">ספארק בונה את תוכנית הפרויקט שלך...</h2>
              <p className="text-gray-500">זה יקח כמה שניות</p>
              {error && (
                <div className="text-red-500 text-sm font-medium mt-4">{error}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-4xl animate-bounce">⚡</div></div>}>
      <OnboardingContent />
    </Suspense>
  );
}
