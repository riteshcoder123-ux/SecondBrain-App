import React from 'react';
import {
  Search,
  Camera,
  Image as ImageIcon,
  FileText,
  PenTool,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Calendar,
  Layers,
} from 'lucide-react';
import { Memory, AIInsight } from '../types/memory';
import { MemoryCard, formatRelativeTime } from './MemoryCard';

interface HomeViewProps {
  memories: Memory[];
  insights: AIInsight[];
  onSelectMemory: (id: string) => void;
  onAskMemory: (query: string) => void;
  onQuickCapture: (type: 'photo' | 'screenshot' | 'document' | 'note') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  memories,
  insights,
  onSelectMemory,
  onAskMemory,
  onQuickCapture,
}) => {
  // Determine dynamic greeting
  const hour = new Date().getHours();
  const greetingTime =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // "On This Day" memory (e.g. created around 1 year ago, or fallback to the earliest memory)
  const onThisDayMemory =
    memories.find((m) => m.id === 'mem-ai-memory-architecture') || memories[memories.length - 1];

  const samplePrompts = [
    'What was that AI project idea I saved?',
    'Find my DBMS assignment.',
    'What did I decide about my website project?',
    'Show everything related to Java.',
    'When did I save that driving school idea?',
  ];

  return (
    <div className="space-y-6 pb-24 text-stone-900 dark:text-stone-100">
      {/* 1. Header Command Greeting */}
      <div className="pt-2">
        <h1 className="text-xl font-bold tracking-tight">
          {greetingTime}, Akash
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Your memory is ready.
        </p>
      </div>

      {/* 2. Large Search / Ask Interface */}
      <div className="space-y-2">
        <div
          onClick={() => onAskMemory('')}
          className="group relative flex items-center p-3.5 rounded-2xl bg-stone-100/90 hover:bg-stone-200/60 dark:bg-stone-900/90 dark:hover:bg-stone-850 border border-stone-200/80 dark:border-stone-800 cursor-pointer shadow-xs transition-all"
        >
          <Search className="w-4 h-4 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-200 transition-colors mr-3 shrink-0" />
          <span className="text-sm text-stone-400 dark:text-stone-500 select-none">
            Ask your memory anything...
          </span>
          <ArrowRight className="w-4 h-4 text-stone-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* Suggestion prompt marquee / scrollable pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onAskMemory(prompt)}
              className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200/70 dark:bg-stone-900/60 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 whitespace-nowrap text-[11px] font-medium transition-colors"
            >
              “{prompt}”
            </button>
          ))}
        </div>
      </div>

      {/* 3. Quick Capture (Four Compact Actions) */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
          Quick Capture
        </span>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => onQuickCapture('photo')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-100/70 hover:bg-stone-200/60 dark:bg-stone-900/70 dark:hover:bg-stone-850 border border-stone-200/60 dark:border-stone-800/80 text-stone-800 dark:text-stone-200 transition-all active:scale-95"
          >
            <Camera className="w-4 h-4 mb-1 text-stone-600 dark:text-stone-300" />
            <span className="text-xs font-medium">Scan</span>
          </button>

          <button
            onClick={() => onQuickCapture('screenshot')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-100/70 hover:bg-stone-200/60 dark:bg-stone-900/70 dark:hover:bg-stone-850 border border-stone-200/60 dark:border-stone-800/80 text-stone-800 dark:text-stone-200 transition-all active:scale-95"
          >
            <ImageIcon className="w-4 h-4 mb-1 text-stone-600 dark:text-stone-300" />
            <span className="text-xs font-medium">Screenshot</span>
          </button>

          <button
            onClick={() => onQuickCapture('document')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-100/70 hover:bg-stone-200/60 dark:bg-stone-900/70 dark:hover:bg-stone-850 border border-stone-200/60 dark:border-stone-800/80 text-stone-800 dark:text-stone-200 transition-all active:scale-95"
          >
            <FileText className="w-4 h-4 mb-1 text-stone-600 dark:text-stone-300" />
            <span className="text-xs font-medium">Document</span>
          </button>

          <button
            onClick={() => onQuickCapture('note')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-100/70 hover:bg-stone-200/60 dark:bg-stone-900/70 dark:hover:bg-stone-850 border border-stone-200/60 dark:border-stone-800/80 text-stone-800 dark:text-stone-200 transition-all active:scale-95"
          >
            <PenTool className="w-4 h-4 mb-1 text-stone-600 dark:text-stone-300" />
            <span className="text-xs font-medium">Note</span>
          </button>
        </div>
      </div>

      {/* 4. AI Memory Insights */}
      {insights && insights.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Memory Insights</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-100/80 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2">
            <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100">
              {insights[0].title}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {insights[0].message}
            </p>
            {insights[0].relatedMemoryIds?.length > 0 && (
              <button
                onClick={() => onSelectMemory(insights[0].relatedMemoryIds[0])}
                className="text-[11px] font-semibold text-stone-800 dark:text-stone-200 hover:underline flex items-center gap-1 pt-1"
              >
                <span>View connected memory</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. On This Day (Section 15) */}
      {onThisDayMemory && (
        <div className="p-4 rounded-xl bg-stone-100/60 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-medium text-stone-400 dark:text-stone-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider">On This Day · 1 Year Ago</span>
            </div>
            <span className="font-mono">Oct 2, 2025</span>
          </div>

          <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100">
            {onThisDayMemory.title}
          </h3>

          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
            {onThisDayMemory.summary || onThisDayMemory.content}
          </p>

          <button
            onClick={() => onSelectMemory(onThisDayMemory.id)}
            className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 hover:underline flex items-center gap-1 pt-1"
          >
            <span>Recall this memory</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 6. Recently Remembered Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            Recently Remembered
          </span>
          <span className="text-[11px] font-mono text-stone-400">
            {memories.length} memories
          </span>
        </div>

        {memories.length === 0 ? (
          <div className="py-8 text-center space-y-2 rounded-xl border border-dashed border-stone-300 dark:border-stone-800">
            <p className="text-xs font-medium text-stone-600 dark:text-stone-400">
              Your memory is empty.
            </p>
            <p className="text-[11px] text-stone-400">
              Start by throwing something in.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {memories.slice(0, 5).map((mem) => (
              <MemoryCard
                key={mem.id}
                memory={mem}
                onClick={() => onSelectMemory(mem.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
