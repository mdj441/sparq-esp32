'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { TutoringSession } from '@/types/session';
import type { ChatMessage, AIProvider } from '@/types/chat';
import type { ProjectPlan, Difficulty } from '@/types/project';

const MAX_CHAT_HISTORY = 40;

interface SessionStore {
  session: TutoringSession | null;

  // Session lifecycle
  createSession: (params: {
    childName?: string;
    difficulty: Difficulty;
    availableComponents: string[];
    projectIdea?: string;
    aiProvider?: AIProvider;
    aiModel?: string;
  }) => TutoringSession;
  clearSession: () => void;

  // Project plan
  setProjectPlan: (plan: ProjectPlan) => void;

  // Step navigation
  setCurrentStep: (index: number) => void;
  markStepComplete: (stepId: string) => void;

  // Chat
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  appendToLastAssistantMessage: (text: string) => void;
  clearChat: () => void;

  // Code
  setCode: (filename: string, code: string) => void;

  // AI settings
  setAIProvider: (provider: AIProvider, model: string) => void;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      session: null,

      createSession: (params) => {
        const session: TutoringSession = {
          id: nanoid(),
          childName: params.childName,
          difficulty: params.difficulty,
          availableComponents: params.availableComponents,
          projectIdea: params.projectIdea,
          projectPlan: undefined,
          currentStepIndex: 0,
          completedSteps: [],
          chatHistory: [],
          code: {},
          aiProvider: params.aiProvider ?? 'anthropic',
          aiModel: params.aiModel ?? 'claude-sonnet-4-6',
        };
        set({ session });
        return session;
      },

      clearSession: () => set({ session: null }),

      setProjectPlan: (plan) =>
        set((state) => ({
          session: state.session ? { ...state.session, projectPlan: plan, currentStepIndex: 0 } : null,
        })),

      setCurrentStep: (index) =>
        set((state) => ({
          session: state.session ? { ...state.session, currentStepIndex: index } : null,
        })),

      markStepComplete: (stepId) =>
        set((state) => {
          if (!state.session) return state;
          const completedSteps = state.session.completedSteps.includes(stepId)
            ? state.session.completedSteps
            : [...state.session.completedSteps, stepId];
          return { session: { ...state.session, completedSteps } };
        }),

      addMessage: (msg) =>
        set((state) => {
          if (!state.session) return state;
          const newMsg: ChatMessage = { ...msg, id: nanoid(), timestamp: Date.now() };
          // Keep first message + last MAX_CHAT_HISTORY-1 to preserve context
          const history = state.session.chatHistory;
          const trimmed =
            history.length >= MAX_CHAT_HISTORY
              ? [history[0], ...history.slice(-(MAX_CHAT_HISTORY - 1))]
              : history;
          return {
            session: { ...state.session, chatHistory: [...trimmed, newMsg] },
          };
        }),

      appendToLastAssistantMessage: (text) =>
        set((state) => {
          if (!state.session) return state;
          const history = [...state.session.chatHistory];
          const last = history[history.length - 1];
          if (last && last.role === 'assistant') {
            history[history.length - 1] = { ...last, content: last.content + text };
          }
          return { session: { ...state.session, chatHistory: history } };
        }),

      clearChat: () =>
        set((state) => ({
          session: state.session ? { ...state.session, chatHistory: [] } : null,
        })),

      setCode: (filename, code) =>
        set((state) => ({
          session: state.session
            ? { ...state.session, code: { ...state.session.code, [filename]: code } }
            : null,
        })),

      setAIProvider: (provider, model) =>
        set((state) => ({
          session: state.session ? { ...state.session, aiProvider: provider, aiModel: model } : null,
        })),
    }),
    {
      name: 'tutor-session-v1',
      storage:
        typeof window !== 'undefined'
          ? createJSONStorage(() => localStorage)
          : createJSONStorage(() => noopStorage),
      partialize: (state) => ({ session: state.session }),
      version: 1,
    }
  )
);
