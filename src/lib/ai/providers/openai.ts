import OpenAI from 'openai';
import type { AIProvider, AIStreamOptions } from '../provider';

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
  return new OpenAI({ apiKey });
}

export const openaiProvider: AIProvider = {
  name: 'openai',
  availableModels: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],

  async stream(options: AIStreamOptions): Promise<ReadableStream<Uint8Array>> {
    const client = getClient();
    const encoder = new TextEncoder();

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: options.system },
      ...options.messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ];

    const sdkStream = await client.chat.completions.create({
      model: options.model,
      max_tokens: options.maxTokens ?? 1024,
      messages,
      stream: true,
    });

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of sdkStream) {
            const text = chunk.choices[0]?.delta?.content ?? '';
            if (text) controller.enqueue(encoder.encode(text));
          }
        } finally {
          controller.close();
        }
      },
    });
  },

  async complete(options: AIStreamOptions): Promise<string> {
    const client = getClient();
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: options.system },
      ...options.messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ];
    const response = await client.chat.completions.create({
      model: options.model,
      max_tokens: options.maxTokens ?? 4096,
      messages,
    });
    return response.choices[0]?.message?.content ?? '';
  },
};
