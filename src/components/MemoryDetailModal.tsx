import React, { useState } from 'react';
import {
  X,
  Clock,
  Sparkles,
  Network,
  Trash2,
  Calendar,
  Layers,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { Memory } from '../types/memory';
import { getSourceIcon, formatRelativeTime } from './MemoryCard';

interface MemoryDetailModalProps {
  memory: Memory | null;
  allMemories: Memory[];
  onClose: () => void;
  onSelectMemory: (id: string) => void;
  onDeleteMemory: (id: string) => void;
  onAskAboutMemory: (query: string) => void;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  memory,
  allMemories,
  onClose,
  onSelectMemory,
  onDeleteMemory,
  onAskAboutMemory,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'intelligence'>('details');
  const [flashcards, setFlashcards] = useState<{ q: string; a: string }[] | null>(null);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!memory) return null;

  // Resolve related memories
  const relatedItems = (memory.relationships || []).map((rel) => {
    const target = allMemories.find((m) => m.id === rel.targetMemoryId);
    return {
      relationship: rel,
      memory: target,
    };
  }).filter((item) => item.memory !== undefined);

  // Generate flashcards study tool
  const handleGenerateFlashcards = () => {
    setIsGeneratingFlashcards(true);
    setTimeout(() => {
      setFlashcards([
        {
          q: `What is the core subject of ${memory.title}?`,
          a: memory.summary || memory.content.slice(0, 100),
        },
        {
          q: `What are key dates or deadlines detected in this memory?`,
          a: memory.detectedDates.length > 0 ? memory.detectedDates.join(', ') : 'No hard deadline recorded',
        },
        {
          q: `How does this relate to other stored memories?`,
          a: memory.relationships.length > 0 ? memory.relationships[0].reason : 'Direct standalone memory item',
        },
      ]);
      setIsGeneratingFlashcards(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(`${memory.title}\n\n${memory.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-900 dark:text-stone-100 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span className="p-1 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              {getSourceIcon(memory.sourceType)}
            </span>
            <span className="capitalize font-medium">{memory.sourceType}</span>
            <span aria-hidden="true">·</span>
            <span>Captured {formatRelativeTime(memory.createdAt)}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              title="Copy content"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onDeleteMemory(memory.id)}
              title="Delete memory"
              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/50">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-stone-900 text-stone-900 dark:border-stone-100 dark:text-stone-100'
                : 'border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            Memory Overview
          </button>
          <button
            onClick={() => setActiveTab('intelligence')}
            className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'intelligence'
                ? 'border-stone-900 text-stone-900 dark:border-stone-100 dark:text-stone-100'
                : 'border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            Intelligence & Study
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {activeTab === 'details' ? (
            <>
              {/* Title */}
              <div>
                <h1 className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug">
                  {memory.title}
                </h1>
                {/* Zero-Pill Unboxed Topic List */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500 dark:text-stone-400 mt-2 font-medium">
                  {memory.topics.map((t, idx) => (
                    <React.Fragment key={idx}>
                      <span>{t}</span>
                      {idx < memory.topics.length - 1 && (
                        <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* AI Summary Block */}
              <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-950/70 border border-stone-200/80 dark:border-stone-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300">
                  <Sparkles className="w-3.5 h-3.5 text-stone-500" />
                  <span>AI Summary</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {memory.summary}
                </p>
              </div>

              {/* Key Facts */}
              {memory.keyFacts && memory.keyFacts.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                    Key Facts
                  </h2>
                  <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400 pl-1">
                    {memory.keyFacts.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-stone-400 select-none">•</span>
                        <span className="leading-relaxed">{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Detected Dates & Deadlines */}
              {memory.detectedDates && memory.detectedDates.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold block mb-0.5">Detected Dates & Deadlines</span>
                    <div className="space-y-0.5">
                      {memory.detectedDates.map((dateStr, idx) => (
                        <div key={idx} className="font-mono text-[11px]">
                          {dateStr}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Original Raw Content */}
              <div className="space-y-2 pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
                <h2 className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  Original Content
                </h2>
                <div className="p-3.5 rounded-xl bg-stone-100/50 dark:bg-stone-950/40 border border-stone-200/60 dark:border-stone-800/60 text-xs text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {memory.content}
                </div>
              </div>

              {/* Related Memories with "Why is this related?" */}
              <div className="space-y-3 pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                    Connected Memories ({relatedItems.length})
                  </h2>
                </div>

                {relatedItems.length === 0 ? (
                  <p className="text-xs text-stone-400 dark:text-stone-500 italic">
                    No related memories connected yet. Capture more to let Second Brain build connections.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {relatedItems.map(({ relationship, memory: relMem }) => (
                      <div
                        key={relationship.targetMemoryId}
                        className="p-3 rounded-xl bg-stone-100/60 dark:bg-stone-950/40 border border-stone-200/70 dark:border-stone-800/70 space-y-2"
                      >
                        <div
                          onClick={() => onSelectMemory(relMem!.id)}
                          className="flex items-center justify-between cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-stone-500">
                              {getSourceIcon(relMem!.sourceType)}
                            </span>
                            <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 group-hover:underline">
                              {relMem!.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-stone-400">
                            {(relationship.confidence * 100).toFixed(0)}% link
                          </span>
                        </div>

                        {/* "Why is this related?" Accordion Callout */}
                        <div className="pt-2 border-t border-stone-200/40 dark:border-stone-800/40 flex items-start gap-1.5 text-[11px] text-stone-600 dark:text-stone-400">
                          <HelpCircle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-stone-700 dark:text-stone-300">
                              Why is this related?{' '}
                            </span>
                            <span>{relationship.reason}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Intelligence & Study Tab (Section 18 Document/Screenshot Intelligence) */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-stone-500" />
                  <span className="text-xs font-semibold">Document & Screenshot Actions</span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Second Brain extracts actionable knowledge directly from captured media and text.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={handleGenerateFlashcards}
                    disabled={isGeneratingFlashcards}
                    className="p-2.5 rounded-lg bg-stone-200/70 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700/80 text-xs font-medium text-stone-800 dark:text-stone-200 text-left transition-colors flex items-center justify-between"
                  >
                    <span>Extract Study Flashcards</span>
                    {isGeneratingFlashcards ? (
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Layers className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => onAskAboutMemory(`Tell me everything about ${memory.title}`)}
                    className="p-2.5 rounded-lg bg-stone-200/70 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700/80 text-xs font-medium text-stone-800 dark:text-stone-200 text-left transition-colors flex items-center justify-between"
                  >
                    <span>Ask This Memory</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Generated Flashcards */}
              {flashcards && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    Generated Study Cards
                  </h3>
                  {flashcards.map((card, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-stone-100/60 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 space-y-1.5"
                    >
                      <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                        Q: {card.q}
                      </div>
                      <div className="text-xs text-stone-600 dark:text-stone-400 pl-2 border-l-2 border-stone-300 dark:border-stone-700">
                        A: {card.a}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-stone-200 dark:border-stone-800 bg-stone-100/30 dark:bg-stone-950/30 flex items-center justify-between">
          <button
            onClick={() => onAskAboutMemory(`What are the key facts about ${memory.title}?`)}
            className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask question about this memory</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
