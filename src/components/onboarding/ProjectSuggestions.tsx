'use client';

import type { ProjectSuggestion } from '@/types/project';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

const DIFFICULTY_MAP = {
  beginner: { label: 'מתחיל', color: 'green' as const },
  intermediate: { label: 'בינוני', color: 'yellow' as const },
  advanced: { label: 'מתקדם', color: 'red' as const },
};

interface Props {
  suggestions: ProjectSuggestion[];
  onSelect: (suggestion: ProjectSuggestion) => void;
  loading?: boolean;
}

export function ProjectSuggestions({ suggestions, onSelect, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-2xl h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {suggestions.map((s) => {
        const diff = DIFFICULTY_MAP[s.difficulty];
        return (
          <Card
            key={s.id}
            hover
            onClick={() => onSelect(s)}
            className="flex flex-col gap-3 border-2 hover:border-indigo-400"
          >
            <div className="text-4xl text-center">{s.emoji}</div>
            <h3 className="text-lg font-bold text-gray-800 text-center">{s.titleHe}</h3>
            <p className="text-sm text-gray-600 leading-relaxed flex-1">{s.descriptionHe}</p>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <Badge color={diff.color}>{diff.label}</Badge>
              <span className="text-xs text-gray-400">⏱ {s.estimatedMinutes} דקות</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
