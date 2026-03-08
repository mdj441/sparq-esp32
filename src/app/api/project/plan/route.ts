import { NextResponse } from 'next/server';
import { z } from 'zod';
import { initProviders, getProvider } from '@/lib/ai/providers';
import { buildPlanSystemPrompt, buildPlanUserMessage } from '@/lib/ai/prompts';
import { parseProjectPlan } from '@/lib/ai/parsers';
import { translateAIError } from '@/lib/ai/error-handler';

initProviders();

const RequestSchema = z.object({
  projectIdea: z.string().min(1),
  components: z.array(z.string()),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  childName: z.string().optional(),
  aiProvider: z.string().default('anthropic'),
  aiModel: z.string().default('claude-sonnet-4-6'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectIdea, components, difficulty, childName, aiProvider, aiModel } =
      RequestSchema.parse(body);

    const provider = getProvider(aiProvider);
    const text = await provider.complete({
      provider: aiProvider,
      model: aiModel,
      system: buildPlanSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: buildPlanUserMessage(projectIdea, components, difficulty, childName),
        },
      ],
      maxTokens: 8192,
    });

    const plan = parseProjectPlan(text);
    return NextResponse.json({ plan });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error('[plan] ERROR:', detail);
    return NextResponse.json(
      { error: translateAIError(err), detail },
      { status: 500 }
    );
  }
}
