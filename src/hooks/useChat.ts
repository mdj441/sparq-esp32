'use client';

import { useState, useCallback } from 'react';
import { useSessionStore } from '@/store/sessionStore';

export function useChat() {
  const { session, addMessage, appendToLastAssistantMessage } = useSessionStore();
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!session || isStreaming || !userMessage.trim()) return;

      setError(null);
      setIsStreaming(true);

      // Add user message immediately
      addMessage({ role: 'user', content: userMessage });

      let placeholderAdded = false;
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionContext: session,
            userMessage,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'שגיאה בתקשורת' }));
          throw new Error(err.error ?? 'שגיאה');
        }

        if (!res.body) throw new Error('אין תשובה מהשרת');

        // Add placeholder for assistant message
        addMessage({ role: 'assistant', content: '' });
        placeholderAdded = true;

        // Read SSE stream
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          appendToLastAssistantMessage(chunk);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'שגיאה לא ידועה';
        setError(msg);
        // If a placeholder was already added, append the error to it;
        // otherwise add a new assistant message to avoid duplicate bubbles.
        if (placeholderAdded) {
          appendToLastAssistantMessage(`\n\n⚠️ שגיאה: ${msg}`);
        } else {
          addMessage({ role: 'assistant', content: `⚠️ שגיאה: ${msg}` });
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [session, isStreaming, addMessage, appendToLastAssistantMessage]
  );

  return { sendMessage, isStreaming, error };
}
