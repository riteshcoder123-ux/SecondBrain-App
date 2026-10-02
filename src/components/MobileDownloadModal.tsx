import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Download,
  Smartphone,
  Share,
  PlusSquare,
  CheckCircle2,
  Copy,
  ExternalLink,
  X,
  Sparkles,
  Layers,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDownloadModal: React.FC<MobileDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [deviceTab, setDeviceTab] = useState<'scan' | 'ios' | 'android' | 'native'>('scan');

  if (!isOpen) return null;

  // Compute mobile app URL (development or shared URL)
  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-2vto2cd73wb4wi6ltv2p33-929911584907.asia-southeast1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl p-5 space-y-5 text-stone-900 dark:text-stone-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Download to Mobile</h2>
              <p className="text-[11px] text-stone-500">
                Install SECOND BRAIN directly onto your phone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Device Switcher Tabs */}
        <div className="flex p-1 bg-stone-100 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-medium">
          <button
            onClick={() => setDeviceTab('scan')}
            className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
              deviceTab === 'scan'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <span>Scan QR Code</span>
          </button>

          <button
            onClick={() => setDeviceTab('ios')}
            className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
              deviceTab === 'ios'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <span>iPhone (iOS)</span>
          </button>

          <button
            onClick={() => setDeviceTab('android')}
            className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
              deviceTab === 'android'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <span>Android</span>
          </button>

          <button
            onClick={() => setDeviceTab('native')}
            className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
              deviceTab === 'native'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <span>Native APK</span>
          </button>
        </div>

        {/* Tab 1: QR Code Scanner */}
        {deviceTab === 'scan' && (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-white rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm inline-block mx-auto">
              <QRCodeSVG
                value={currentUrl}
                size={180}
                level="M"
                bgColor="#ffffff"
                fgColor="#090a0f"
                marginSize={2}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                1. Point your phone camera at this QR code
              </p>
              <p className="text-[11px] text-stone-500">
                Tap the link banner that appears to open Second Brain in mobile browser
              </p>
            </div>

            {/* Direct 1-tap install if running directly in mobile browser */}
            {isInstallable && (
              <button
                onClick={handleDirectInstall}
                className="w-full py-3 px-4 rounded-xl bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 text-xs font-semibold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Install Second Brain App</span>
              </button>
            )}
          </div>
        )}

        {/* Tab 2: iPhone / iOS Instructions */}
        {deviceTab === 'ios' && (
          <div className="space-y-3 text-left">
            <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div className="text-xs">
                  <span className="font-semibold block text-stone-900 dark:text-stone-100">
                    Open in Safari
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    Open the link in Apple Safari on your iPhone or iPad.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div className="text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-stone-900 dark:text-stone-100">
                    <span>Tap Share</span>
                    <Share className="w-3.5 h-3.5 text-stone-500" />
                  </div>
                  <span className="text-stone-500 text-[11px]">
                    Tap the Share icon at the bottom of the Safari toolbar.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div className="text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-stone-900 dark:text-stone-100">
                    <span>Add to Home Screen</span>
                    <PlusSquare className="w-3.5 h-3.5 text-stone-500" />
                  </div>
                  <span className="text-stone-500 text-[11px]">
                    Scroll down and tap <strong>“Add to Home Screen”</strong>.
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 text-center">
              The Second Brain app icon will appear right on your home screen with native full-screen view.
            </p>
          </div>
        )}

        {/* Tab 3: Android Instructions */}
        {deviceTab === 'android' && (
          <div className="space-y-3 text-left">
            <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div className="text-xs">
                  <span className="font-semibold block text-stone-900 dark:text-stone-100">
                    Open in Chrome or Samsung Internet
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    Visit the app link in your Android mobile browser.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div className="text-xs">
                  <span className="font-semibold block text-stone-900 dark:text-stone-100">
                    Tap “Install App” or Browser Menu (⋮)
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    Select <strong>“Install App”</strong> or <strong>“Add to Home screen”</strong>.
                  </span>
                </div>
              </div>
            </div>

            {isInstallable && (
              <button
                onClick={handleDirectInstall}
                className="w-full py-3 px-4 rounded-xl bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 text-xs font-semibold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Tap to Install Now</span>
              </button>
            )}
          </div>
        )}

        {/* Tab 4: Native Android / APK Export */}
        {deviceTab === 'native' && (
          <div className="space-y-3.5 text-left text-xs">
            <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                  Capacitor Android Native Project
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                  Ready to Build
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                SECOND BRAIN is already configured with official <strong>Capacitor Android</strong> (Package ID: <code className="font-mono text-[10px] bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded">com.secondbrain.memoryos</code>).
              </p>

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block">
                  Quick Steps to Generate .APK:
                </span>
                <div className="p-2.5 rounded-lg bg-stone-900 text-stone-100 font-mono text-[10px] space-y-1 overflow-x-auto">
                  <div># 1. Download & extract project</div>
                  <div># 2. Open in Android Studio or Terminal:</div>
                  <div className="text-emerald-400">cd android && ./gradlew assembleDebug</div>
                  <div># 3. APK generated at:</div>
                  <div className="text-stone-400">android/app/build/outputs/apk/debug/app-debug.apk</div>
                </div>
              </div>

              <a
                href="/second-brain-android-project.tar.gz"
                download="second-brain-android-project.tar.gz"
                className="w-full py-2.5 px-3 rounded-xl bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 font-semibold text-xs flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download Android Project (.tar.gz)</span>
              </a>
            </div>

            <div className="p-3 rounded-xl bg-stone-200/50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="font-semibold text-stone-800 dark:text-stone-200 block text-[11px]">
                Tip: Instant Installation (No Building Needed)
              </span>
              <p className="text-[11px] text-stone-500">
                You can also use the <strong>Scan QR Code</strong> tab to install SECOND BRAIN on your phone right now via your browser. It runs full-screen as a standalone native app with offline support.
              </p>
            </div>
          </div>
        )}

        {/* Link Copy Bar */}
        <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-stone-400">
            <span>Or copy app link:</span>
            <span className="font-mono text-[10px] text-stone-500 truncate max-w-[200px]">
              {currentUrl}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2 px-3 rounded-xl bg-stone-200/70 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Mobile Link</span>
                </>
              )}
            </button>

            <a
              href={currentUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-stone-200/70 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
