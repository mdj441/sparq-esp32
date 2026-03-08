export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface PinConnection {
  fromComponent: string;
  fromPin: string;
  toComponent: string;
  toPin: string;
  wireColor: 'red' | 'black' | 'yellow' | 'green' | 'blue' | 'orange' | 'white';
  labelHe?: string;
}

export interface CodeStep {
  filename: string;
  code: string;
  explanationHe: string;
  lineExplanations?: Record<number, string>;
}

export interface ProjectStep {
  id: string;
  stepNumber: number;
  titleHe: string;
  descriptionHe: string;
  connections?: PinConnection[];
  wiringTextHe?: string;
  code?: CodeStep;
  testInstructionsHe?: string;
  successCriteriaHe: string;
  hintsHe: string[];
  estimatedMinutes: number;
}

export interface ProjectPlan {
  id: string;
  titleHe: string;
  descriptionHe: string;
  difficulty: Difficulty;
  requiredComponents: string[];
  steps: ProjectStep[];
}

export interface ProjectSuggestion {
  id: string;
  titleHe: string;
  descriptionHe: string;
  difficulty: Difficulty;
  requiredComponents: string[];
  estimatedMinutes: number;
  emoji: string;
}
