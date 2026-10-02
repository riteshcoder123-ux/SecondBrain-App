import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { TimelineView } from './components/TimelineView';
import { AskMemoryView } from './components/AskMemoryView';
import { MemoryGraphView } from './components/MemoryGraphView';
import { PrivacyCenter } from './components/PrivacyCenter';
import { QuickCaptureModal } from './components/QuickCaptureModal';
import { MemoryDetailModal } from './components/MemoryDetailModal';
import { WidgetsPreview } from './components/WidgetsPreview';
import { OnboardingModal } from './components/OnboardingModal';
import { MobileDownloadModal } from './components/MobileDownloadModal';
import { Memory, AIInsight, Collection } from './types/memory';
import { INITIAL_MEMORIES, INITIAL_INSIGHTS, INITIAL_COLLECTIONS } from './data/seedMemories';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [memories, setMemories] = useState<Memory[]>(INITIAL_MEMORIES);
  const [insights, setInsights] = useState<AIInsight[]>(INITIAL_INSIGHTS);
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);

  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);
  const [askQuery, setAskQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isWidgetsOpen, setIsWidgetsOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // Sync dark mode class to <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load initial data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const memRes = await fetch('/api/memories');
        const memData = await memRes.json();
        if (memData.memories && memData.memories.length > 0) {
          setMemories(memData.memories);
        }

        const insRes = await fetch('/api/insights');
        const insData = await insRes.json();
        if (insData.insights) {
          setInsights(insData.insights);
        }

        const colRes = await fetch('/api/collections');
        const colData = await colRes.json();
        if (colData.collections) {
          setCollections(colData.collections);
        }
      } catch (err) {
        console.warn('Using seeded memories fallback:', err);
      }
    };
    loadData();
  }, []);

  // Check first-time user
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('second_brain_onboarded');
    if (!hasSeenOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('second_brain_onboarded', 'true');
    setIsOnboardingOpen(false);
  };

  const handleMemoryCaptured = (newMemory: Memory) => {
    setMemories((prev) => {
      const existingIdx = prev.findIndex((m) => m.id === newMemory.id);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = newMemory;
        return updated;
      }
      return [newMemory, ...prev];
    });
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await fetch(`/api/memories/${id}`, { method: 'DELETE' });
      setMemories((prev) => prev.filter((m) => m.id !== id));
      setSelectedMemoryId(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleAskNavigation = (query: string) => {
    setAskQuery(query);
    setActiveTab('recall');
    if (selectedMemoryId) {
      setSelectedMemoryId(null);
    }
  };

  const handleResetVault = () => {
    setMemories(INITIAL_MEMORIES);
    setInsights(INITIAL_INSIGHTS);
    setCollections(INITIAL_COLLECTIONS);
    setActiveTab('home');
  };

  const selectedMemory = memories.find((m) => m.id === selectedMemoryId) || null;

  return (
    <div
      className={`min-h-screen bg-stone-200/70 dark:bg-stone-950 flex flex-col items-center justify-start transition-colors selection:bg-stone-700 selection:text-stone-100 ${
        isMobileFrame ? 'p-0 sm:py-8 sm:px-4' : 'p-0'
      }`}
    >
      {/* Mobile Shell / Device Frame */}
      <div
        className={`w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-all ${
          isMobileFrame
            ? 'max-w-[430px] min-h-[100dvh] sm:min-h-[844px] sm:max-h-[920px] sm:rounded-[44px] sm:shadow-2xl sm:border-[8px] sm:border-stone-800 dark:sm:border-stone-850 overflow-hidden flex flex-col relative'
            : 'max-w-2xl min-h-screen flex flex-col relative border-x border-stone-200/50 dark:border-stone-800/50 shadow-sm'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          isMobileFrame={isMobileFrame}
          setIsMobileFrame={setIsMobileFrame}
          memoryCount={memories.length}
          onOpenDownloadModal={() => setIsDownloadOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 pt-4 overflow-y-auto no-scrollbar">
          {activeTab === 'home' && (
            <HomeView
              memories={memories}
              insights={insights}
              onSelectMemory={(id) => setSelectedMemoryId(id)}
              onAskMemory={handleAskNavigation}
              onQuickCapture={() => setIsCaptureOpen(true)}
            />
          )}

          {activeTab === 'recall' && (
            <div className="space-y-4">
              <AskMemoryView
                initialQuery={askQuery}
                onOpenMemoryDetail={(id) => setSelectedMemoryId(id)}
                onCaptureNewPrompt={(prompt) => {
                  setIsCaptureOpen(true);
                }}
              />
              <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
                <TimelineView
                  memories={memories}
                  onSelectMemory={(id) => setSelectedMemoryId(id)}
                  onAskMemory={handleAskNavigation}
                />
              </div>
            </div>
          )}

          {activeTab === 'graph' && (
            <MemoryGraphView
              memories={memories}
              collections={collections}
              onSelectMemory={(id) => setSelectedMemoryId(id)}
            />
          )}

          {activeTab === 'privacy' && (
            <PrivacyCenter
              memoryCount={memories.length}
              onResetVault={handleResetVault}
              onOpenWidgets={() => setIsWidgetsOpen(true)}
              onOpenDownloadModal={() => setIsDownloadOpen(true)}
            />
          )}
        </main>

        {/* Ergonomic Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'recall') {
              setAskQuery('');
            }
          }}
          onOpenCapture={() => setIsCaptureOpen(true)}
        />

        {/* Universal Capture Modal */}
        <QuickCaptureModal
          isOpen={isCaptureOpen}
          onClose={() => setIsCaptureOpen(false)}
          onMemoryCaptured={handleMemoryCaptured}
        />

        {/* Memory Detail Modal */}
        <MemoryDetailModal
          memory={selectedMemory}
          allMemories={memories}
          onClose={() => setSelectedMemoryId(null)}
          onSelectMemory={(id) => setSelectedMemoryId(id)}
          onDeleteMemory={handleDeleteMemory}
          onAskAboutMemory={handleAskNavigation}
        />

        {/* Mobile OS Widgets Preview */}
        <WidgetsPreview
          isOpen={isWidgetsOpen}
          onClose={() => setIsWidgetsOpen(false)}
          recentMemory={memories[0]}
          onAskClick={handleAskNavigation}
          onCaptureClick={() => setIsCaptureOpen(true)}
        />

        {/* Mobile Download & Installation Modal */}
        <MobileDownloadModal
          isOpen={isDownloadOpen}
          onClose={() => setIsDownloadOpen(false)}
        />

        {/* First-Time Onboarding */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onComplete={handleCompleteOnboarding}
        />
      </div>
    </div>
  );
}
