import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Info,
  Database,
  BrainCircuit,
  Lightbulb,
  FileQuestion,
  CornerDownRight,
} from 'lucide-react';
import { AskMemoryResponse, Memory } from '../types/memory';
import { getSourceIcon } from './MemoryCard';

interface AskMemoryViewProps {
  initialQuery?: string;
  onOpenMemoryDetail: (memoryId: string) => void;
  onCaptureNewPrompt?: (prompt: string) => void;
}

export const AskMemoryView: React.FC<AskMemoryViewProps> = ({
  initialQuery = '',
  onOpenMemoryDetail,
  onCaptureNewPrompt,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AskMemoryResponse | null>(null);
  const [history, setHistory] = useState<{ query: string; response: AskMemoryResponse }[]>([]);

  const sampleQueries = [
    'What was that AI project idea I saved?',
    'Find my DBMS assignment deadline.',
    'What did I decide about my website project?',
    'Show everything related to Java.',
    'When did I save that driving school idea?',
    'What are the details for my Tokyo flight?',
  ];

  const handleSearch = async (questionToAsk: string) => {
    const q = questionToAsk.trim();
    if (!q) return;

    setIsLoading(true);
    setQuery(q);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });

      const data: AskMemoryResponse = await res.json();
      setResponse(data);
      setHistory((prev) => [{ query: q, response: data }, ...prev]);
    } catch (err) {
      console.error('Ask error:', err);
      setResponse({
        answer: 'Failed to search personal memory store. Please try again.',
        storedFacts: [],
        aiInterpretation: '',
        inference: '',
        confidenceScore: 0,
        retrievedMemories: [],
        insufficientInfo: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Search Input Bar */}
      <form onSubmit={onSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your memory anything..."
            className="w-full pl-11 pr-12 py-3.5 text-sm bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-400 dark:focus:ring-stone-600 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 shadow-xs"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-2 p-2 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 disabled:opacity-40 transition-transform active:scale-95"
            aria-label="Submit query"
          >
            {isLoading ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>

      {/* Suggested Inspiration Queries if no current response */}
      {!response && !isLoading && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            Try Asking
          </p>
          <div className="flex flex-col gap-1.5">
            {sampleQueries.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(sample)}
                className="flex items-center justify-between p-3 rounded-xl bg-stone-100/50 hover:bg-stone-200/50 dark:bg-stone-900/40 dark:hover:bg-stone-900/80 border border-stone-200/40 dark:border-stone-800/60 text-left text-xs font-medium text-stone-700 dark:text-stone-300 transition-colors group"
              >
                <span>“{sample}”</span>
                <CornerDownRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-200 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="p-6 rounded-2xl bg-stone-100/40 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800/60 text-center space-y-2">
          <Sparkles className="w-5 h-5 mx-auto animate-spin text-stone-400" />
          <p className="text-xs font-medium text-stone-600 dark:text-stone-400">
            Searching personal memories and synthesizing context...
          </p>
        </div>
      )}

      {/* Retrieved Memory Answer Card */}
      {response && !isLoading && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Main Answer Block */}
          <div className="p-5 rounded-2xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800/80 space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500 mb-2">
                <BrainCircuit className="w-4 h-4" />
                <span>Second Brain Retrieval</span>
              </div>
              <h2 className="text-base font-medium text-stone-900 dark:text-stone-100 leading-relaxed">
                {response.answer}
              </h2>
            </div>

            {/* Sources / Citations */}
            {response.retrievedMemories && response.retrievedMemories.length > 0 && (
              <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800/60 space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span className="font-medium">
                    Based on {response.retrievedMemories.length}{' '}
                    {response.retrievedMemories.length === 1 ? 'memory' : 'memories'}:
                  </span>
                  <span className="font-mono text-[10px]">
                    {(response.confidenceScore * 100).toFixed(0)}% grounded
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {response.retrievedMemories.map((src) => (
                    <button
                      key={src.id}
                      onClick={() => onOpenMemoryDetail(src.id)}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-stone-200/50 hover:bg-stone-200 dark:bg-stone-800/50 dark:hover:bg-stone-800/80 border border-stone-300/40 dark:border-stone-700/50 text-left transition-colors group"
                    >
                      <div className="p-1 rounded bg-stone-100 dark:bg-stone-900 text-stone-500 shrink-0">
                        {getSourceIcon(src.sourceType)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 truncate group-hover:text-stone-950 dark:group-hover:text-white">
                            {src.title}
                          </span>
                          <ExternalLink className="w-3 h-3 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 shrink-0 ml-1" />
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                          {src.snippet}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trust & Transparency Separation: Stored Fact vs Interpretation vs Inference */}
            <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800/60 space-y-3 text-xs">
              {/* Stored Facts */}
              {response.storedFacts && response.storedFacts.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-stone-700 dark:text-stone-300">
                    <Database className="w-3.5 h-3.5 text-stone-400" />
                    <span>Stored Facts (Ground Truth)</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-stone-600 dark:text-stone-400 pl-1">
                    {response.storedFacts.map((fact, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Interpretation */}
              {response.aiInterpretation && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center gap-1.5 font-semibold text-stone-700 dark:text-stone-300">
                    <BrainCircuit className="w-3.5 h-3.5 text-stone-400" />
                    <span>AI Interpretation</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {response.aiInterpretation}
                  </p>
                </div>
              )}

              {/* Inference / Next Step */}
              {response.inference && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center gap-1.5 font-semibold text-stone-700 dark:text-stone-300">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Inference & Next Action</span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {response.inference}
                  </p>
                </div>
              )}

              {/* Insufficient info notice */}
              {response.insufficientInfo && (
                <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 space-y-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Info className="w-4 h-4" />
                    <span>No sufficient personal memory found</span>
                  </div>
                  <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                    Second Brain only answers from what you have captured. Would you like to capture this note now so you never forget it?
                  </p>
                  {onCaptureNewPrompt && (
                    <button
                      onClick={() => onCaptureNewPrompt(query)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                    >
                      + Capture "{query}" into memory
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
