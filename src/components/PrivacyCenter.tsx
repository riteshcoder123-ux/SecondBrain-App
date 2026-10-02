import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Download,
  Trash2,
  Lock,
  Cpu,
  RefreshCw,
  Sliders,
  CheckCircle,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { Memory } from '../types/memory';

interface PrivacyCenterProps {
  memoryCount: number;
  onResetVault: () => void;
  onOpenWidgets: () => void;
  onOpenDownloadModal: () => void;
}

export const PrivacyCenter: React.FC<PrivacyCenterProps> = ({
  memoryCount,
  onResetVault,
  onOpenWidgets,
  onOpenDownloadModal,
}) => {
  const [stats, setStats] = useState({
    totalMemories: memoryCount,
    encrypted: true,
    encryptionAlgorithm: 'AES-GCM 256-bit (Zero-Knowledge)',
    aiProcessingMode: 'Cloud Gemini 3.8 Flash + Local Cache',
    cloudSyncEnabled: true,
  });

  const [autoSaveScreenshots, setAutoSaveScreenshots] = useState(true);
  const [localProcessingOnly, setLocalProcessingOnly] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  useEffect(() => {
    fetch('/api/privacy/stats')
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch((err) => console.warn('Could not load privacy stats:', err));
  }, [memoryCount]);

  const handleExportData = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/privacy/export', { method: 'POST' });
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `second-brain-vault-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleConfirmReset = async () => {
    try {
      await fetch('/api/privacy/reset', { method: 'POST' });
      onResetVault();
      setShowConfirmReset(false);
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Privacy Vault Overview */}
      <div className="p-5 rounded-2xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Personal Memory Vault
              </h2>
              <p className="text-xs text-stone-500">
                Zero telemetry · Isolated local vault
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium">
            Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200/60 dark:border-stone-800/60 text-xs">
          <div>
            <span className="text-stone-400 block text-[11px]">Stored Memories</span>
            <span className="text-sm font-semibold text-stone-800 dark:text-stone-200 font-mono">
              {memoryCount} items
            </span>
          </div>

          <div>
            <span className="text-stone-400 block text-[11px]">Encryption</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>AES-GCM 256-bit</span>
            </span>
          </div>
        </div>
      </div>

      {/* AI Intelligence & Capture Controls */}
      <div className="p-5 rounded-2xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
          AI & Privacy Controls
        </h3>

        {/* Screenshot Auto-Save */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 pr-4">
            <span className="text-xs font-medium text-stone-800 dark:text-stone-200 block">
              Auto-Process Screenshots
            </span>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Automatically extract text, dates, and topics when screenshots are dropped.
            </p>
          </div>
          <button
            onClick={() => setAutoSaveScreenshots(!autoSaveScreenshots)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              autoSaveScreenshots ? 'bg-stone-900 dark:bg-stone-100' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white dark:bg-stone-900 absolute top-1 transition-transform ${
                autoSaveScreenshots ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Local Processing vs Cloud */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-200/60 dark:border-stone-800/60">
          <div className="space-y-0.5 pr-4">
            <span className="text-xs font-medium text-stone-800 dark:text-stone-200 block">
              Local Heuristics Only (No Cloud LLM)
            </span>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Restrict all extraction and relationship detection to on-device code.
            </p>
          </div>
          <button
            onClick={() => setLocalProcessingOnly(!localProcessingOnly)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              localProcessingOnly ? 'bg-stone-900 dark:bg-stone-100' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white dark:bg-stone-900 absolute top-1 transition-transform ${
                localProcessingOnly ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Install on Mobile Device */}
      <div className="p-4 rounded-xl bg-stone-100/90 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <Download className="w-4 h-4 text-stone-700 dark:text-stone-300" />
          <div>
            <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 block">
              Download to Mobile Phone
            </span>
            <span className="text-[11px] text-stone-500">
              Scan QR code or install native PWA on Android & iOS
            </span>
          </div>
        </div>
        <button
          onClick={onOpenDownloadModal}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-white transition-colors"
        >
          Install App
        </button>
      </div>

      {/* Mobile Widgets Simulator Button */}
      <div className="p-4 rounded-xl bg-stone-100/50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Smartphone className="w-4 h-4 text-stone-500" />
          <div>
            <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 block">
              Mobile OS Widgets
            </span>
            <span className="text-[11px] text-stone-500">
              Preview Ask, Quick Capture, and Recent widgets
            </span>
          </div>
        </div>
        <button
          onClick={onOpenWidgets}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
        >
          View Widgets
        </button>
      </div>

      {/* Data Export & Reset Actions */}
      <div className="space-y-2.5">
        <button
          onClick={handleExportData}
          disabled={exporting}
          className="w-full py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-850 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>{exporting ? 'Exporting Memory Vault...' : 'Export All Memories (JSON)'}</span>
        </button>

        {showConfirmReset ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs space-y-2">
            <p className="font-semibold text-red-600 dark:text-red-400">
              Reset memory vault to initial seed state?
            </p>
            <p className="text-stone-600 dark:text-stone-400 text-[11px]">
              This will restore the original demo memories and wipe custom additions.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleConfirmReset}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Yes, Reset Vault
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="w-full py-3 px-4 rounded-xl border border-stone-200 dark:border-stone-800/80 text-xs font-semibold text-stone-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/5 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Vault to Defaults</span>
          </button>
        )}
      </div>
    </div>
  );
};
