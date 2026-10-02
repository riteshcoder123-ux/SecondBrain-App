import React from 'react';
import { ShieldCheck, Moon, Sun, Smartphone, Monitor, Download } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  memoryCount: number;
  onOpenDownloadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDarkMode,
  setIsDarkMode,
  isMobileFrame,
  setIsMobileFrame,
  memoryCount,
  onOpenDownloadModal,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-3.5 py-3 border-b border-stone-200 dark:border-stone-800/80 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md transition-colors">
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-2">
        <span className="text-base font-bold tracking-tight text-stone-900 dark:text-stone-100">
          SECOND BRAIN
        </span>
        <span className="hidden sm:inline text-xs text-stone-400 dark:text-stone-500">
          ·
        </span>
        <span className="hidden sm:inline text-xs text-stone-500 dark:text-stone-400 font-mono tabular-nums">
          {memoryCount}
        </span>
      </div>

      {/* Zone 2: Download on Mobile Action */}
      <button
        onClick={onOpenDownloadModal}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-900 text-stone-50 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-white shadow-xs transition-transform active:scale-95"
        title="Download & Install app on Mobile"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="text-[11px]">Install on Phone</span>
      </button>

      {/* Zone 3: Actions (Frame Toggle + Theme Toggle) */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => setIsMobileFrame(!isMobileFrame)}
          title={isMobileFrame ? 'Expand to responsive desktop view' : 'Switch to mobile OS shell'}
          className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors"
          aria-label="Toggle mobile device frame"
        >
          {isMobileFrame ? (
            <Monitor className="w-4 h-4" />
          ) : (
            <Smartphone className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle theme"
          className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors"
          aria-label="Toggle dark/light mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};

