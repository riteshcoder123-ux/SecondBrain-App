import React from 'react';
import { Sparkles, Search, Plus, Network, Shield } from 'lucide-react';

export type NavTab = 'home' | 'recall' | 'graph' | 'privacy';

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenCapture: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenCapture,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800/80 max-w-lg mx-auto">
      <div className="grid grid-cols-5 items-center h-16 px-2">
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'home'
              ? 'text-stone-950 dark:text-stone-100 font-semibold'
              : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
          }`}
          aria-label="Home"
        >
          <Sparkles className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] tracking-tight mt-1">Memory</span>
        </button>

        {/* Tab 2: Recall / Search */}
        <button
          onClick={() => setActiveTab('recall')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'recall'
              ? 'text-stone-950 dark:text-stone-100 font-semibold'
              : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
          }`}
          aria-label="Recall"
        >
          <Search className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] tracking-tight mt-1">Recall</span>
        </button>

        {/* Center: Emphasized Capture Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={onOpenCapture}
            className="w-12 h-12 rounded-full bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform"
            aria-label="Capture into memory"
            title="Capture anything into memory"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 4: Graph / Connections */}
        <button
          onClick={() => setActiveTab('graph')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'graph'
              ? 'text-stone-950 dark:text-stone-100 font-semibold'
              : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
          }`}
          aria-label="Knowledge Graph"
        >
          <Network className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] tracking-tight mt-1">Graph</span>
        </button>

        {/* Tab 5: Privacy */}
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'privacy'
              ? 'text-stone-950 dark:text-stone-100 font-semibold'
              : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
          }`}
          aria-label="Privacy"
        >
          <Shield className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] tracking-tight mt-1">Vault</span>
        </button>
      </div>
    </nav>
  );
};
