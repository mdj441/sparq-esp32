import { registerProvider, getProvider } from '../provider';
import { anthropicProvider } from './anthropic';
import { openaiProvider } from './openai';
import { geminiProvider } from './gemini';

let initialized = false;

export function initProviders() {
  if (initialized) return;
  registerProvider(anthropicProvider);
  registerProvider(openaiProvider);
  registerProvider(geminiProvider);
  initialized = true;
}

export { getProvider };
