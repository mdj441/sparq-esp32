import { NextResponse } from 'next/server';
import { z } from 'zod';
import { initProviders, getProvider } from '@/lib/ai/providers';
import { buildSuggestSystemPrompt, buildSuggestUserMessage } from '@/lib/ai/prompts';
import { parseProjectSuggestions } from '@/lib/ai/parsers';
import { translateAIError } from '@/lib/ai/error-handler';

initProviders();

const RequestSchema = z.object({
  components: z.array(z.string()),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  aiProvider: z.string().default('anthropic'),
  aiModel: z.string().default('claude-sonnet-4-6'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { components, difficulty, aiProvider, aiModel } = RequestSchema.parse(body);

    const provider = getProvider(aiProvider);
    const text = await provider.complete({
      provider: aiProvider,
      model: aiModel,
      system: buildSuggestSystemPrompt(),
      messages: [{ role: 'user', content: buildSuggestUserMessage(components, difficulty) }],
      maxTokens: 2000,
    });

    const suggestions = parseProjectSuggestions(text);
    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error('[suggest]', err);
    return NextResponse.json(
      { error: translateAIError(err) },
      { status: 500 }
    );
  }
}
