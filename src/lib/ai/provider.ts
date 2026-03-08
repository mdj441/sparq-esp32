export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIStreamOptions {
  provider: string;
  model: string;
  system: string;
  messages: AIMessage[];
  maxTokens?: number;
}

export interface AIProvider {
  name: string;
  availableModels: string[];
  stream(options: AIStreamOptions): Promise<ReadableStream<Uint8Array>>;
  complete(options: AIStreamOptions): Promise<string>;
}

// Provider registry
const providers = new Map<string, AIProvider>();

export function registerProvider(provider: AIProvider) {
  providers.set(provider.name, provider);
}

export function getProvider(name: string): AIProvider {
  const p = providers.get(name);
  if (!p) throw new Error(`AI provider "${name}" not found. Available: ${[...providers.keys()].join(', ')}`);
  return p;
}
