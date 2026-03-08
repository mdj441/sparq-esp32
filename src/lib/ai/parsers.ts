import { z } from 'zod';
import { nanoid } from 'nanoid';
import type { ProjectPlan, ProjectSuggestion } from '@/types/project';

function extractJson(text: string): string {
  // Try to extract from ```json ... ``` block
  const match = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (match) return match[1];
  // Fallback: find first { or [
  const start = text.search(/[\[{]/);
  if (start !== -1) return text.slice(start);
  return text;
}

// .nullish() = optional + nullable, handles Claude returning null for missing fields
const PinConnectionSchema = z.object({
  fromComponent: z.string(),
  fromPin: z.string(),
  toComponent: z.string(),
  toPin: z.string(),
  wireColor: z.string(),
  labelHe: z.string().nullish(),
});

const CodeStepSchema = z.object({
  filename: z.string(),
  code: z.string(),
  explanationHe: z.string(),
  lineExplanations: z.record(z.string(), z.string()).nullish(),
});

const ProjectStepSchema = z.object({
  id: z.string().default(() => nanoid()),
  stepNumber: z.number(),
  titleHe: z.string(),
  descriptionHe: z.string(),
  connections: z.array(PinConnectionSchema).nullish(),
  wiringTextHe: z.string().nullish(),
  code: CodeStepSchema.nullish(),
  testInstructionsHe: z.string().nullish(),
  successCriteriaHe: z.string(),
  hintsHe: z.array(z.string()).default([]),
  estimatedMinutes: z.number().default(15),
});

const ProjectPlanSchema = z.object({
  id: z.string().default(() => nanoid()),
  titleHe: z.string(),
  descriptionHe: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  requiredComponents: z.array(z.string()),
  steps: z.array(ProjectStepSchema),
});

const SuggestionSchema = z.object({
  id: z.string().default(() => nanoid()),
  titleHe: z.string(),
  descriptionHe: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  requiredComponents: z.array(z.string()),
  estimatedMinutes: z.number(),
  emoji: z.string().default('🔌'),
});

export function parseProjectPlan(aiText: string): ProjectPlan {
  const json = extractJson(aiText);
  const raw = JSON.parse(json);
  return ProjectPlanSchema.parse(raw) as ProjectPlan;
}

export function parseProjectSuggestions(aiText: string): ProjectSuggestion[] {
  const json = extractJson(aiText);
  const raw = JSON.parse(json);
  const arr = Array.isArray(raw) ? raw : [raw];
  return z.array(SuggestionSchema).parse(arr) as ProjectSuggestion[];
}
