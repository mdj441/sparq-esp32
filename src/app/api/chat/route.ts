import { z } from 'zod';
import { initProviders, getProvider } from '@/lib/ai/providers';
import { buildTutorSystemPrompt } from '@/lib/ai/prompts';
import { SessionContextSchema } from '@/types/session';
import { translateAIError } from '@/lib/ai/error-handler';

initProviders();

const RequestSchema = z.object({
  sessionContext: SessionContextSchema,
  userMessage: z.string().min(1).max(2000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionContext, userMessage } = RequestSchema.parse(body);

    const provider = getProvider(sessionContext.aiProvider);
    const system = buildTutorSystemPrompt(sessionContext);

    // Build message history for the LLM (last 20 messages for context)
    const history = sessionContext.chatHistory.slice(-20);
    const messages = [
      ...history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: userMessage },
    ];

    const stream = await provider.stream({
      provider: sessionContext.aiProvider,
      model: sessionContext.aiModel,
      system,
      messages,
      maxTokens: 800,
    });

    // Return SSE stream
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err) {
    console.error('[chat]', err);
    return new Response(
      JSON.stringify({ error: translateAIError(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
