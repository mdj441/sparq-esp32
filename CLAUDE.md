# ספארק – ESP32 AI Tutor for Kids

## Project Overview
Web app that guides children (ages 8-14) step-by-step through ESP32 Arduino projects.
AI tutor named "ספארק" covers wiring, incremental code, testing, and debugging in Hebrew.

## Stack
- Next.js 16 (App Router, TypeScript)
- Zustand with `persist` middleware → localStorage (stateless server)
- Multi-AI: Anthropic (primary), OpenAI, Gemini via abstract provider interface
- Tailwind CSS v4 (`@import "tailwindcss"` in globals.css — no tailwind.config.ts)
- Hebrew RTL UI (`dir="rtl"` on `<html>`, Heebo font)
- Zod v4: `z.record(key, value)` requires TWO arguments
- Deployed to Vercel: sparq-esp32.vercel.app → GitHub: mdj441/sparq-esp32

## Architecture
- Server is completely stateless — no session store server-side
- All state in Zustand persisted to localStorage under key `tutor-session-v1`
- Every API call receives full `sessionContext` in request body
- `_hasHydrated` flag in store prevents redirect before localStorage loads

## Key Files
- `src/store/sessionStore.ts` — Zustand store, single source of truth
- `src/types/project.ts` — ProjectPlan, ProjectStep, PinConnection, CodeStep
- `src/types/session.ts` — TutoringSession + SessionContextSchema (Zod)
- `src/lib/ai/provider.ts` — AIProvider interface + registry
- `src/lib/ai/providers/` — anthropic.ts, openai.ts, gemini.ts
- `src/lib/ai/prompts.ts` — buildTutorSystemPrompt, buildPlanSystemPrompt, etc.
- `src/lib/ai/parsers.ts` — JSON extraction + Zod validation
- `src/app/api/chat/route.ts` — SSE streaming chat (stateless)
- `src/app/api/project/plan/route.ts` — generates ProjectPlan JSON, maxTokens: 8192
- `src/app/api/project/suggest/route.ts` — 3 project suggestions
- `src/hooks/useChat.ts` — streaming chat hook (ReadableStream reader)
- `src/components/chat/ChatPanel.tsx` — full chat UI with streaming
- `src/components/workspace/StepDetail.tsx` — step instructions + wiring + code
- `src/components/diagram/WiringGuide.tsx` — pin connection table
- `src/components/code/CodeSnippet.tsx` — syntax highlighting + line explanations
- `src/app/onboarding/page.tsx` — multi-step form: components → idea → planning
- `src/app/session/[sessionId]/page.tsx` — workspace: sidebar + step detail + chat

## Known Fixes (don't revert)
- Zod optional fields use `.nullish()` not `.optional()` (Claude returns null)
- `z.record()` needs two args in Zod v4
- `_hasHydrated` guard in session page prevents redirect before localStorage hydrates
- Plan prompt requests 4-5 steps max, fields ≤2 sentences (prevents JSON truncation)

## Planned Features
- Phase 2: SVG circuit diagrams, Monaco Editor, language switcher HE/EN, AI provider selector
- Phase 3: Wokwi iframe simulation, web search (Serper), DebugWizard, Upstash Redis
