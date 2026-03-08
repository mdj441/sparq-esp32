'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { CodeStep } from '@/types/project';

interface Props {
  codeStep: CodeStep;
}

export function CodeSnippet({ codeStep }: Props) {
  const [copied, setCopied] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeStep.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = codeStep.code.split('\n');
  const hasLineExplanations =
    codeStep.lineExplanations && Object.keys(codeStep.lineExplanations).length > 0;

  return (
    <div className="space-y-3">
      {/* File name bar */}
      <div className="flex items-center justify-between bg-gray-800 rounded-t-xl px-4 py-2">
        <span className="text-gray-400 text-sm font-mono">{codeStep.filename}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          {copied ? '✓ הועתק!' : '📋 העתק'}
        </button>
      </div>

      {/* Code block */}
      <div className="rounded-b-xl overflow-hidden -mt-2">
        <SyntaxHighlighter
          language="python"
          style={vscDarkPlus}
          customStyle={{ margin: 0, borderRadius: '0 0 0.75rem 0.75rem', fontSize: '13px' }}
          showLineNumbers
          wrapLines
        >
          {codeStep.code}
        </SyntaxHighlighter>
      </div>

      {/* General explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900 leading-relaxed">
        <div className="flex gap-2 items-start">
          <span className="text-xl flex-shrink-0">💡</span>
          <p>{codeStep.explanationHe}</p>
        </div>
      </div>

      {/* Line-by-line explanations (accordion) */}
      {hasLineExplanations && (
        <div>
          <button
            onClick={() => setShowExplanations(!showExplanations)}
            className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:text-indigo-800"
          >
            <span>{showExplanations ? '▲' : '▼'}</span>
            הסבר שורה-אחר-שורה
          </button>

          {showExplanations && (
            <div className="mt-3 space-y-2">
              {Object.entries(codeStep.lineExplanations!).map(([lineNum, explanation]) => {
                const lineIndex = parseInt(lineNum) - 1;
                const lineCode = lines[lineIndex];
                if (!lineCode) return null;
                return (
                  <div key={lineNum} className="flex gap-3 text-sm">
                    <div className="flex-shrink-0 w-7 h-7 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-xs font-mono font-bold">
                      {lineNum}
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 mb-1 ltr-text">
                        {lineCode.trim()}
                      </div>
                      <p className="text-gray-600">{explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
