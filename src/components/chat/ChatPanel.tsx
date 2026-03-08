'use client';

import { useRef, useEffect, useState, KeyboardEvent } from 'react';
import { useChat } from '@/hooks/useChat';
import { useSessionStore } from '@/store/sessionStore';
import { cn } from '@/lib/utils/cn';
import { Spinner } from '@/components/ui/Spinner';

function ChatMessage({ role, content, isLast, isStreaming }: {
  role: 'user' | 'assistant';
  content: string;
  isLast: boolean;
  isStreaming: boolean;
}) {
  const isUser = role === 'user';
  return (
    <div className={cn('flex gap-2 max-w-[90%]', isUser ? 'flex-row-reverse ms-auto' : 'flex-row me-auto')}>
      {/* Avatar */}
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm',
        isUser ? 'bg-indigo-600 text-white' : 'bg-amber-100 text-amber-700'
      )}>
        {isUser ? '👤' : '⚡'}
      </div>

      {/* Bubble */}
      <div className={cn(
        'rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
        isUser
          ? 'bg-indigo-600 text-white chat-bubble-user rounded-tl-sm'
          : 'bg-white border border-gray-100 text-gray-800 chat-bubble-assistant rounded-tr-sm',
        isLast && isStreaming && !isUser && 'streaming-cursor'
      )}>
        {/* Render content with code blocks in LTR */}
        {content.split(/(```[\s\S]*?```)/g).map((part, i) =>
          part.startsWith('```') ? (
            <pre key={i} className="bg-gray-900 text-green-400 rounded-lg p-3 mt-2 mb-2 overflow-x-auto text-xs ltr-text">
              {part.replace(/```\w*\n?/, '').replace(/```$/, '')}
            </pre>
          ) : (
            <span key={i} className="whitespace-pre-wrap">{part}</span>
          )
        )}
      </div>
    </div>
  );
}

export function ChatPanel() {
  const { session } = useSessionStore();
  const { sendMessage, isStreaming } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messages = session?.chatHistory ?? [];

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isStreaming]);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || isStreaming) return;
    setInput('');
    await sendMessage(msg);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-white rounded-t-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">ספארק</h3>
            <p className="text-xs text-gray-400">המורה שלך לESP32</p>
          </div>
          {isStreaming && <Spinner className="mr-auto h-4 w-4" />}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            <div className="text-4xl mb-3">👋</div>
            <p>שלום! אני ספארק, המורה שלך לESP32.</p>
            <p>שאל אותי כל שאלה על הפרויקט!</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            isLast={i === messages.length - 1}
            isStreaming={isStreaming}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      {messages.length === 0 && session?.projectPlan && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap bg-gray-50">
          {['מה אני צריך לעשות עכשיו?', 'הסבר לי את הקוד', 'לא עובד לי, תעזור?'].map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={isStreaming}
              className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 rounded-b-2xl">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="שאל שאלה..."
            rows={1}
            disabled={isStreaming}
            className="flex-1 resize-none px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-indigo-400 outline-none text-sm text-gray-800 disabled:opacity-50 max-h-[120px]"
            style={{ height: 'auto', minHeight: '42px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            {isStreaming ? <Spinner className="h-4 w-4 text-white" /> : '↑'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1 text-center">Enter לשליחה · Shift+Enter לשורה חדשה</p>
      </div>
    </div>
  );
}
