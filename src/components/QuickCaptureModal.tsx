import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Image as ImageIcon,
  FileText,
  PenTool,
  Link2,
  Clipboard,
  Mic,
  MicOff,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Memory, MemoryType } from '../types/memory';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemoryCaptured: (newMemory: Memory) => void;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  onMemoryCaptured,
}) => {
  const [selectedType, setSelectedType] = useState<MemoryType>('note');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedSuccess, setCapturedSuccess] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCapture = async () => {
    if (!content.trim() && !imagePreview) return;

    setIsCapturing(true);

    try {
      // 1. Instant Capture to server (<1 sec optimistic feedback)
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || undefined,
          content: content.trim() || (imagePreview ? 'Visual capture' : ''),
          sourceType: selectedType,
          imageUrl: imagePreview || undefined,
        }),
      });

      const data = await res.json();
      if (data.memory) {
        setCapturedSuccess(true);
        onMemoryCaptured(data.memory);

        // 2. Trigger asynchronous AI ingestion pipeline in background
        fetch('/api/memories/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memoryId: data.memory.id }),
        })
          .then((r) => r.json())
          .then((ingestedData) => {
            if (ingestedData.memory) {
              onMemoryCaptured(ingestedData.memory);
            }
          })
          .catch((err) => console.warn('Background ingestion warning:', err));

        // Smooth close after showing instant confirmation
        setTimeout(() => {
          setIsCapturing(false);
          setCapturedSuccess(false);
          setContent('');
          setTitle('');
          setImagePreview(null);
          onClose();
        }, 650);
      }
    } catch (err) {
      console.error('Capture error:', err);
      setIsCapturing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
        if (!content) {
          setContent(`Uploaded document: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setContent(text);
          setSelectedType('paste');
        }
      }
    } catch (err) {
      console.warn('Clipboard read permission denied:', err);
    }
  };

  const handlePresetSample = (preset: {
    type: MemoryType;
    title: string;
    content: string;
  }) => {
    setSelectedType(preset.type);
    setTitle(preset.title);
    setContent(preset.content);
  };

  // Voice toggle
  const toggleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setSelectedType('voice');
      // Simulate real-time speech transcription
      const speechSamples = [
        'Remember to review the relational algebra query tree before the DBMS exam next Thursday.',
        'Met with Alex regarding the CCTV surveillance agency proposal. Target 12 commercial warehouses.',
        'Idea: Offline-first personal memory engine with local SQLite and hybrid vector search.',
      ];
      const randomSample = speechSamples[Math.floor(Math.random() * speechSamples.length)];
      setTimeout(() => {
        setContent((prev) => (prev ? `${prev} ${randomSample}` : randomSample));
        setIsRecording(false);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden text-stone-900 dark:text-stone-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Capture Memory</h2>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Throw anything in. AI understands and connects it automatically.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Selector Tabs */}
        <div className="p-3 border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/40">
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            <button
              onClick={() => {
                setSelectedType('note');
                fileInputRef.current?.click();
              }}
              className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                selectedType === 'photo'
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <Camera className="w-4 h-4 mb-1" />
              <span className="text-[10px]">Photo</span>
            </button>

            <button
              onClick={() => {
                setSelectedType('screenshot');
                fileInputRef.current?.click();
              }}
              className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                selectedType === 'screenshot'
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <ImageIcon className="w-4 h-4 mb-1" />
              <span className="text-[10px]">Screen</span>
            </button>

            <button
              onClick={() => {
                setSelectedType('document');
                fileInputRef.current?.click();
              }}
              className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                selectedType === 'document'
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <FileText className="w-4 h-4 mb-1" />
              <span className="text-[10px]">Doc</span>
            </button>

            <button
              onClick={() => setSelectedType('note')}
              className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                selectedType === 'note'
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <PenTool className="w-4 h-4 mb-1" />
              <span className="text-[10px]">Note</span>
            </button>

            <button
              onClick={() => setSelectedType('link')}
              className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                selectedType === 'link'
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <Link2 className="w-4 h-4 mb-1" />
              <span className="text-[10px]">Link</span>
            </button>

            <button
              onClick={handlePasteClipboard}
              className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                selectedType === 'paste'
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
              }`}
            >
              <Clipboard className="w-4 h-4 mb-1" />
              <span className="text-[10px]">Paste</span>
            </button>

            <button
              onClick={toggleVoiceRecording}
              className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse'
                  : selectedType === 'voice'
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4 mb-1" /> : <Mic className="w-4 h-4 mb-1" />}
              <span className="text-[10px]">{isRecording ? 'Listening' : 'Voice'}</span>
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,.pdf,.txt,.md"
            className="hidden"
          />
        </div>

        {/* Input Area */}
        <div className="p-4 space-y-3 overflow-y-auto">
          {imagePreview && (
            <div className="relative rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-950 max-h-40 flex items-center justify-center">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="max-h-40 w-auto object-contain"
              />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (Optional — AI auto-titles if left blank)"
              className="w-full px-3 py-2 text-sm bg-transparent border-b border-stone-200 dark:border-stone-800 focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
            />
          </div>

          <div>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                selectedType === 'link'
                  ? 'Paste article, video, or documentation URL here...'
                  : selectedType === 'voice'
                  ? 'Tap the voice button above to speak, or write thoughts here...'
                  : 'Write, paste text, or describe what you want to remember...'
              }
              className="w-full p-3 text-sm bg-stone-100/60 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800/90 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 dark:focus:ring-stone-600 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 resize-none leading-relaxed"
            />
          </div>

          {/* Quick Presets for Instant Testing */}
          <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-400 dark:text-stone-500 mb-2">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Instant Test Presets</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handlePresetSample({
                    type: 'screenshot',
                    title: 'DBMS Unit 4 Normalization Notice',
                    content:
                      'Course Announcement: Submit Unit 4 Assignment (BCNF, Multi-valued Dependencies, and Indexing) before Friday, Oct 30. Weightage: 15% of grade.',
                  })
                }
                className="px-2.5 py-1 text-xs rounded-md bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
              >
                + DBMS Assignment
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePresetSample({
                    type: 'note',
                    title: 'Warehouse CCTV Smart Lease Concept',
                    content:
                      'Idea: Offer local logistics warehouses AI perimeter detection with zero upfront hardware cost. Bill monthly SaaS at $299/mo per hub.',
                  })
                }
                className="px-2.5 py-1 text-xs rounded-md bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
              >
                + CCTV SaaS Idea
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePresetSample({
                    type: 'document',
                    title: 'San Francisco Tech Meetup Pass',
                    content:
                      'Registration confirmed: AI Systems & Vector Databases Summit. Location: Moscone Center West, Oct 18, 9:00 AM. Ticket #VEC-9938.',
                  })
                }
                className="px-2.5 py-1 text-xs rounded-md bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
              >
                + Summit Pass
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-100/30 dark:bg-stone-950/30">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px]">Instant capture · AI connects in background</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCapture}
              disabled={isCapturing || (!content.trim() && !imagePreview)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm ${
                capturedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-white'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {capturedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Captured ✓</span>
                </>
              ) : isCapturing ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Remember This</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
