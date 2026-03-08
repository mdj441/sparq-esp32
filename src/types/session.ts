import { z } from 'zod';
import type { ChatMessage, AIProvider } from './chat';
import type { ProjectPlan, Difficulty } from './project';

export interface TutoringSession {
  id: string;
  childName?: string;
  difficulty: Difficulty;
  availableComponents: string[];
  projectIdea?: string;
  projectPlan?: ProjectPlan;
  currentStepIndex: number;
  completedSteps: string[];
  chatHistory: ChatMessage[];
  code: Record<string, string>;
  aiProvider: AIProvider;
  aiModel: string;
}

// Zod schema used by API routes to validate incoming sessionContext
export const SessionContextSchema = z.object({
  id: z.string(),
  childName: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  availableComponents: z.array(z.string()),
  projectIdea: z.string().optional(),
  projectPlan: z
    .object({
      id: z.string(),
      titleHe: z.string(),
      descriptionHe: z.string(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
      requiredComponents: z.array(z.string()),
      steps: z.array(z.any()),
    })
    .optional(),
  currentStepIndex: z.number(),
  completedSteps: z.array(z.string()),
  chatHistory: z.array(
    z.object({
      id: z.string(),
      role: z.enum(['user', 'assistant']),
      content: z.string(),
      timestamp: z.number(),
    })
  ),
  code: z.record(z.string(), z.string()),
  aiProvider: z.enum(['anthropic', 'openai', 'gemini']),
  aiModel: z.string(),
});

export type SessionContext = z.infer<typeof SessionContextSchema>;
