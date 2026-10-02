import React, { useState, useMemo } from 'react';
import { Memory, MemoryType } from '../types/memory';
import { MemoryCard, getSourceIcon } from './MemoryCard';
import { Search, Filter, Calendar, Sparkles, X } from 'lucide-react';

interface TimelineViewProps {
  memories: Memory[];
  onSelectMemory: (id: string) => void;
  onAskMemory: (query: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  memories,
  onSelectMemory,
  onAskMemory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const sourceTypes: { id: string; label: string }[] = [
    { id: 'all', label: 'All Sources' },
    { id: 'screenshot', label: 'Screenshots' },
    { id: 'document', label: 'Documents' },
    { id: 'note', label: 'Notes' },
    { id: 'voice', label: 'Voice' },
    { id: 'photo', label: 'Photos' },
    { id: 'link', label: 'Links' },
  ];

  const categories = [
    'all',
    'Academic',
    'Project',
    'Ideas',
    'Travel',
    'Work',
    'Finance',
    'Personal',
  ];

  // Filtered memories
  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      // Source filter
      if (selectedSourceType !== 'all' && m.sourceType !== selectedSourceType) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && m.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = m.title.toLowerCase().includes(q);
        const inContent = m.content.toLowerCase().includes(q);
        const inSummary = m.summary.toLowerCase().includes(q);
        const inTopics = m.topics.some((t) => t.toLowerCase().includes(q));
        const inEntities = m.entities.some((e) => e.toLowerCase().includes(q));
        return inTitle || inContent || inSummary || inTopics || inEntities;
      }
      return true;
    });
  }, [memories, searchQuery, selectedSourceType, selectedCategory]);

  // Group by timeline periods (Today, Yesterday, This Week, Earlier)
  const timelineGroups = useMemo(() => {
    const now = new Date().getTime();
    const oneDay = 24 * 3600 * 1000;

    const groups: { [key: string]: Memory[] } = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      'September 2026': [],
      Earlier: [],
    };

    filteredMemories.forEach((mem) => {
      const memTime = new Date(mem.createdAt).getTime();
      const diff = now - memTime;

      if (diff < oneDay) {
        groups.Today.push(mem);
      } else if (diff < 2 * oneDay) {
        groups.Yesterday.push(mem);
      } else if (diff < 7 * oneDay) {
        groups['This Week'].push(mem);
      } else if (mem.createdAt.includes('2026-09')) {
        groups['September 2026'].push(mem);
      } else {
        groups.Earlier.push(mem);
      }
    });

    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  }, [filteredMemories]);

  return (
    <div className="space-y-5 pb-24">
      {/* Search Header */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search meaning or keywords in memory..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-400 dark:focus:ring-stone-600 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 p-0.5 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Source Type Filter Bar (Functional Interactive Tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {sourceTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedSourceType(type.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedSourceType === type.id
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Category Pill Filters (Subtle inline text options) */}
        <div className="flex items-center gap-2 text-xs text-stone-500 overflow-x-auto pb-1">
          <span className="font-semibold text-stone-400 text-[11px] uppercase tracking-wider shrink-0">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-300'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Ask Suggestion Banner if user typed something */}
      {searchQuery.trim() && (
        <button
          onClick={() => onAskMemory(searchQuery)}
          className="w-full p-3 rounded-xl bg-stone-100 hover:bg-stone-200/70 dark:bg-stone-900 dark:hover:bg-stone-850 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-left text-xs transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-stone-500" />
            <span className="font-medium text-stone-800 dark:text-stone-200">
              Ask Second Brain AI: “{searchQuery}”
            </span>
          </div>
          <span className="text-[11px] text-stone-400">Conversational RAG →</span>
        </button>
      )}

      {/* Timeline Groupings */}
      {timelineGroups.length === 0 ? (
        <div className="py-12 text-center space-y-2">
          <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
            Nothing matched your memory.
          </p>
          <p className="text-xs text-stone-400 dark:text-stone-500">
            Try searching differently, or capture this information into Second Brain.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {timelineGroups.map(([period, items]) => (
            <section key={period} className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>{period}</span>
                <span className="font-mono text-[10px] text-stone-400">
                  ({items.length})
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {items.map((mem) => (
                  <MemoryCard
                    key={mem.id}
                    memory={mem}
                    onClick={() => onSelectMemory(mem.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
