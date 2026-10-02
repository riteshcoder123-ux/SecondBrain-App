import React from 'react';
import { Search, Plus, Camera, Image as ImageIcon, FileText, ArrowRight, X } from 'lucide-react';
import { Memory } from '../types/memory';
import { formatRelativeTime } from './MemoryCard';

interface WidgetsPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  recentMemory?: Memory;
  onAskClick: (q: string) => void;
  onCaptureClick: () => void;
}

export const WidgetsPreview: React.FC<WidgetsPreviewProps> = ({
  isOpen,
  onClose,
  recentMemory,
  onAskClick,
  onCaptureClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Mobile Lockscreen & Home Widgets
            </h2>
            <p className="text-[11px] text-stone-500">
              Instant memory capture and retrieval from iOS / Android home screens
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Widget 1: ASK */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Widget 1 — Memory Ask Bar
          </span>
          <div
            onClick={() => {
              onClose();
              onAskClick('What was that DBMS assignment deadline?');
            }}
            className="p-3.5 rounded-2xl bg-stone-100/90 dark:bg-stone-950/90 border border-stone-200 dark:border-stone-800 flex items-center justify-between cursor-pointer hover:border-stone-400 dark:hover:border-stone-600 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Search className="w-4 h-4" />
              <span>Ask your memory anything...</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </div>
        </div>

        {/* Widget 2: QUICK CAPTURE */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Widget 2 — 3-Second Quick Capture
          </span>
          <div className="p-3 rounded-2xl bg-stone-100/90 dark:bg-stone-950/90 border border-stone-200 dark:border-stone-800 flex items-center justify-around shadow-sm">
            <button
              onClick={() => {
                onClose();
                onCaptureClick();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800/60 text-xs font-semibold text-stone-800 dark:text-stone-200 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>+ Note</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onCaptureClick();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800/60 text-xs font-semibold text-stone-800 dark:text-stone-200 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>+ Photo</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onCaptureClick();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800/60 text-xs font-semibold text-stone-800 dark:text-stone-200 transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>+ Screen</span>
            </button>
          </div>
        </div>

        {/* Widget 3: RECENT MEMORY */}
        {recentMemory && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
              Widget 3 — Recently Remembered
            </span>
            <div
              onClick={() => {
                onClose();
                onAskClick(`Show details of ${recentMemory.title}`);
              }}
              className="p-3.5 rounded-2xl bg-stone-100/90 dark:bg-stone-950/90 border border-stone-200 dark:border-stone-800 space-y-1.5 cursor-pointer hover:border-stone-400 dark:hover:border-stone-600 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span>Recently Remembered</span>
                <span className="font-mono">{formatRelativeTime(recentMemory.createdAt)}</span>
              </div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {recentMemory.title}
              </h4>
              <p className="text-[11px] text-stone-500 line-clamp-1">
                {recentMemory.summary}
              </p>
            </div>
          </div>
        )}

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
