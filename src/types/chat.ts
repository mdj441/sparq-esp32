export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
}

export type AIProvider = 'anthropic' | 'openai' | 'gemini';

export interface AIModelOption {
  provider: AIProvider;
  model: string;
  labelHe: string;
}

export const AI_MODEL_OPTIONS: AIModelOption[] = [
  { provider: 'anthropic', model: 'claude-sonnet-4-6', labelHe: 'Claude Sonnet (Anthropic)' },
  { provider: 'anthropic', model: 'claude-haiku-4-5-20251001', labelHe: 'Claude Haiku (Anthropic, מהיר)' },
  { provider: 'openai', model: 'gpt-4o', labelHe: 'GPT-4o (OpenAI)' },
  { provider: 'openai', model: 'gpt-4o-mini', labelHe: 'GPT-4o Mini (OpenAI, מהיר)' },
  { provider: 'gemini', model: 'gemini-1.5-pro', labelHe: 'Gemini 1.5 Pro (Google)' },
  { provider: 'gemini', model: 'gemini-1.5-flash', labelHe: 'Gemini 1.5 Flash (Google, מהיר)' },
];
