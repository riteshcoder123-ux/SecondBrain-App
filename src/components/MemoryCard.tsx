import React from 'react';
import { Memory, MemoryType } from '../types/memory';
import {
  FileText,
  Image as ImageIcon,
  Camera,
  Link2,
  Mic,
  Clipboard,
  Sparkles,
  ArrowUpRight,
  Clock,
} from 'lucide-react';

interface MemoryCardProps {
  memory: Memory;
  onClick: () => void;
}

export const getSourceIcon = (sourceType: MemoryType) => {
  switch (sourceType) {
    case 'screenshot':
      return <ImageIcon className="w-3.5 h-3.5" />;
    case 'photo':
      return <Camera className="w-3.5 h-3.5" />;
    case 'document':
      return <FileText className="w-3.5 h-3.5" />;
    case 'link':
      return <Link2 className="w-3.5 h-3.5" />;
    case 'voice':
      return <Mic className="w-3.5 h-3.5" />;
    case 'paste':
      return <Clipboard className="w-3.5 h-3.5" />;
    case 'note':
    default:
      return <FileText className="w-3.5 h-3.5" />;
  }
};

export const formatRelativeTime = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 365) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${Math.floor(diffInDays / 365)}y ago`;
};

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onClick }) => {
  const primaryTopic = memory.topics[0] || memory.category;
  const secondaryTopic = memory.topics[1] || null;
  const relatedCount = memory.relationships?.length || 0;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative p-4 rounded-xl bg-stone-100/70 hover:bg-stone-200/50 dark:bg-stone-900/60 dark:hover:bg-stone-900/90 border border-stone-200/60 dark:border-stone-800/80 transition-all cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-600"
    >
      {/* Top Header: Title & Arrow */}
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 leading-snug group-hover:text-stone-950 dark:group-hover:text-white transition-colors">
          {memory.title}
        </h3>
        <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      {/* Content preview or summary */}
      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed mb-3">
        {memory.summary || memory.content}
      </p>

      {/* Zero-Pill Unboxed Metadata Row */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
        <span className="capitalize">{primaryTopic}</span>

        {secondaryTopic && (
          <>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
            <span className="capitalize">{secondaryTopic}</span>
          </>
        )}

        {relatedCount > 0 && (
          <>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
            <span className="text-stone-700 dark:text-stone-300">
              {relatedCount} related {relatedCount === 1 ? 'memory' : 'memories'}
            </span>
          </>
        )}

        <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
        <div className="flex items-center gap-1 font-mono text-[10px] text-stone-400 dark:text-stone-500">
          <Clock className="w-3 h-3" />
          <span>{formatRelativeTime(memory.createdAt)}</span>
        </div>
      </div>

      {/* Background Processing Indicator */}
      {memory.isProcessing && (
        <div className="mt-2.5 pt-2 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
          <Sparkles className="w-3 h-3 animate-spin" />
          <span>Understanding & connecting in background...</span>
        </div>
      )}
    </div>
  );
};
