import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider, AIStreamOptions } from '../provider';

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  return new Anthropic({ apiKey });
}

function toAnthropicMessages(messages: AIStreamOptions['messages']) {
  return messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
}

export const anthropicProvider: AIProvider = {
  name: 'anthropic',
  availableModels: ['claude-sonnet-4-6', 'claude-opus-4-6', 'claude-haiku-4-5-20251001'],

  async stream(options: AIStreamOptions): Promise<ReadableStream<Uint8Array>> {
    const client = getClient();
    const encoder = new TextEncoder();

    const sdkStream = await client.messages.stream({
      model: options.model,
      max_tokens: options.maxTokens ?? 1024,
      system: options.system,
      messages: toAnthropicMessages(options.messages),
    });

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of sdkStream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });
  },

  async complete(options: AIStreamOptions): Promise<string> {
    const client = getClient();
    const response = await client.messages.create({
      model: options.model,
      max_tokens: options.maxTokens ?? 4096,
      system: options.system,
      messages: toAnthropicMessages(options.messages),
    });
    const block = response.content[0];
    return block.type === 'text' ? block.text : '';
  },
};
