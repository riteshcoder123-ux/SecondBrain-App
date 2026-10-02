import React, { useState, useMemo } from 'react';
import { Memory, Collection } from '../types/memory';
import { Network, Folder, Sparkles, HelpCircle, Layers, ArrowRight } from 'lucide-react';
import { getSourceIcon } from './MemoryCard';

interface MemoryGraphViewProps {
  memories: Memory[];
  collections: Collection[];
  onSelectMemory: (id: string) => void;
}

export const MemoryGraphView: React.FC<MemoryGraphViewProps> = ({
  memories,
  collections,
  onSelectMemory,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    memories[0]?.id || ''
  );
  const [viewMode, setViewMode] = useState<'graph' | 'collections'>('graph');

  // Selected memory details
  const activeMemory = useMemo(
    () => memories.find((m) => m.id === selectedNodeId) || memories[0],
    [memories, selectedNodeId]
  );

  // Directly connected memories
  const connectedMemories = useMemo(() => {
    if (!activeMemory) return [];
    return activeMemory.relationships
      .map((rel) => {
        const target = memories.find((m) => m.id === rel.targetMemoryId);
        return target ? { target, rel } : null;
      })
      .filter((item): item is { target: Memory; rel: typeof activeMemory.relationships[0] } => item !== null);
  }, [activeMemory, memories]);

  // Generate 2D graph layout coordinates for visual representation
  const graphNodes = useMemo(() => {
    const center = { x: 200, y: 180 };
    const radius = 110;
    const count = memories.length;

    return memories.map((mem, idx) => {
      // If it's the active memory, put it near the center or highlight
      const angle = (idx / count) * 2 * Math.PI;
      const isSelected = mem.id === selectedNodeId;
      const x = isSelected ? center.x : center.x + radius * Math.cos(angle);
      const y = isSelected ? center.y : center.y + radius * Math.sin(angle);

      return {
        ...mem,
        x,
        y,
        isSelected,
      };
    });
  }, [memories, selectedNodeId]);

  return (
    <div className="space-y-6 pb-24">
      {/* Top Segmented Control */}
      <div className="flex p-1 bg-stone-100 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
        <button
          onClick={() => setViewMode('graph')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            viewMode === 'graph'
              ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Memory Graph</span>
        </button>

        <button
          onClick={() => setViewMode('collections')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            viewMode === 'collections'
              ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Folder className="w-3.5 h-3.5" />
          <span>Emergent Collections</span>
        </button>
      </div>

      {viewMode === 'graph' ? (
        <div className="space-y-5">
          {/* Interactive Constellation Canvas */}
          <div className="relative rounded-2xl bg-stone-100/60 dark:bg-stone-950/80 border border-stone-200 dark:border-stone-800/80 p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                Interactive Relationship Web
              </span>
              <span className="text-[11px] text-stone-400">
                Tap node to inspect connections
              </span>
            </div>

            <div className="w-full flex justify-center">
              <svg
                viewBox="0 0 400 360"
                className="w-full max-w-sm h-64 select-none touch-none"
              >
                {/* Relationship Links */}
                {memories.map((m) =>
                  m.relationships.map((rel, rIdx) => {
                    const sourceNode = graphNodes.find((n) => n.id === m.id);
                    const targetNode = graphNodes.find(
                      (n) => n.id === rel.targetMemoryId
                    );
                    if (!sourceNode || !targetNode) return null;

                    const isHighlight =
                      sourceNode.id === selectedNodeId ||
                      targetNode.id === selectedNodeId;

                    return (
                      <line
                        key={`${m.id}-${rel.targetMemoryId}-${rIdx}`}
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={isHighlight ? 'currentColor' : '#78716c'}
                        strokeWidth={isHighlight ? 2 : 1}
                        strokeDasharray={isHighlight ? 'none' : '3 3'}
                        className={`transition-all ${
                          isHighlight
                            ? 'text-stone-900 dark:text-stone-100 opacity-90'
                            : 'opacity-25'
                        }`}
                      />
                    );
                  })
                )}

                {/* Nodes */}
                {graphNodes.map((node) => {
                  const isCurrent = node.id === selectedNodeId;
                  const isNeighbor = connectedMemories.some(
                    (c) => c.target.id === node.id
                  );

                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className="cursor-pointer group"
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isCurrent ? 14 : isNeighbor ? 10 : 8}
                        className={`transition-all duration-300 ${
                          isCurrent
                            ? 'fill-stone-900 dark:fill-stone-100 stroke-4 stroke-stone-300 dark:stroke-stone-700'
                            : isNeighbor
                            ? 'fill-stone-600 dark:fill-stone-400 stroke-2 stroke-stone-400'
                            : 'fill-stone-400 dark:fill-stone-700 hover:fill-stone-600'
                        }`}
                      />
                      <text
                        x={node.x}
                        y={node.y + (isCurrent ? 24 : 18)}
                        textAnchor="middle"
                        className={`text-[9px] font-medium select-none pointer-events-none transition-colors ${
                          isCurrent
                            ? 'fill-stone-900 dark:fill-stone-100 font-semibold'
                            : 'fill-stone-400 dark:fill-stone-500'
                        }`}
                      >
                        {node.title.slice(0, 14)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Focused Memory Connection Card */}
          {activeMemory && (
            <div className="p-4 rounded-xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                    Selected Node
                  </span>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {activeMemory.title}
                  </h3>
                </div>
                <button
                  onClick={() => onSelectMemory(activeMemory.id)}
                  className="text-xs font-semibold text-stone-700 dark:text-stone-300 hover:underline flex items-center gap-1"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Connected Relationships with explanation */}
              <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                <span className="text-xs font-semibold text-stone-500">
                  {connectedMemories.length} Direct Connections:
                </span>

                {connectedMemories.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">
                    This memory has no direct relationship links yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {connectedMemories.map(({ target, rel }) => (
                      <div
                        key={target.id}
                        onClick={() => setSelectedNodeId(target.id)}
                        className="p-2.5 rounded-lg bg-stone-200/50 hover:bg-stone-200 dark:bg-stone-800/40 dark:hover:bg-stone-800/80 border border-stone-300/40 dark:border-stone-700/40 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs font-medium text-stone-800 dark:text-stone-200">
                          <span className="truncate">{target.title}</span>
                          <span className="text-[10px] font-mono text-stone-400">
                            {rel.relationshipType}
                          </span>
                        </div>
                        <div className="flex items-start gap-1 mt-1 text-[11px] text-stone-500 dark:text-stone-400">
                          <HelpCircle className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
                          <span>{rel.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Emergent Collections View (Section 14) */
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              Collections are automatically detected and clustered by Second Brain AI.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {collections.map((col) => (
              <div
                key={col.id}
                className="p-4 rounded-xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2 hover:border-stone-400 dark:hover:border-stone-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {col.name}
                  </h3>
                  <span className="text-xs font-mono text-stone-500">
                    {col.memoryCount} {col.memoryCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {col.description}
                </p>

                {/* Sub items preview */}
                <div className="pt-2 border-t border-stone-200/50 dark:border-stone-800/50 flex flex-wrap gap-1">
                  {col.memoryIds.map((mId) => {
                    const mem = memories.find((m) => m.id === mId);
                    if (!mem) return null;
                    return (
                      <button
                        key={mId}
                        onClick={() => onSelectMemory(mId)}
                        className="text-[11px] text-stone-700 dark:text-stone-300 hover:underline flex items-center gap-1"
                      >
                        <span>• {mem.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
