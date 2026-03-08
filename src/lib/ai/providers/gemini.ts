import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIProvider, AIStreamOptions } from '../provider';

function getClient() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY is not set');
  return new GoogleGenerativeAI(apiKey);
}

function buildHistory(messages: AIStreamOptions['messages']) {
  const nonSystem = messages.filter((m) => m.role !== 'system');
  // Gemini history excludes the last message (sent as current turn)
  return nonSystem.slice(0, -1).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}

export const geminiProvider: AIProvider = {
  name: 'gemini',
  availableModels: ['gemini-1.5-pro', 'gemini-1.5-flash'],

  async stream(options: AIStreamOptions): Promise<ReadableStream<Uint8Array>> {
    const genAI = getClient();
    const encoder = new TextEncoder();
    const model = genAI.getGenerativeModel({
      model: options.model,
      systemInstruction: options.system,
    });

    const nonSystem = options.messages.filter((m) => m.role !== 'system');
    const lastMsg = nonSystem[nonSystem.length - 1]?.content ?? '';
    const history = buildHistory(options.messages);

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMsg);

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });
  },

  async complete(options: AIStreamOptions): Promise<string> {
    const genAI = getClient();
    const model = genAI.getGenerativeModel({
      model: options.model,
      systemInstruction: options.system,
    });

    const nonSystem = options.messages.filter((m) => m.role !== 'system');
    const lastMsg = nonSystem[nonSystem.length - 1]?.content ?? '';
    const history = buildHistory(options.messages);

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMsg);
    return result.response.text();
  },
};
