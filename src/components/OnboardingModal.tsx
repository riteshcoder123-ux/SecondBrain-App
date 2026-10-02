import React, { useState } from 'react';
import { Sparkles, Network, Search, ArrowRight, Check } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl p-6 space-y-6 text-center text-stone-900 dark:text-stone-100">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${
              step === 1 ? 'w-6 bg-stone-900 dark:bg-stone-100' : 'w-1.5 bg-stone-300 dark:bg-stone-700'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all ${
              step === 2 ? 'w-6 bg-stone-900 dark:bg-stone-100' : 'w-1.5 bg-stone-300 dark:bg-stone-700'
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all ${
              step === 3 ? 'w-6 bg-stone-900 dark:bg-stone-100' : 'w-1.5 bg-stone-300 dark:bg-stone-700'
            }`}
          />
        </div>

        {/* Screen 1 */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 mx-auto flex items-center justify-center text-stone-800 dark:text-stone-200">
              <Sparkles className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-base font-bold tracking-tight">
                Your memory, finally searchable.
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed px-2">
                Capture screenshots, notes, documents, and ideas with zero manual folders or tags. Just throw it in.
              </p>
            </div>
          </div>
        )}

        {/* Screen 2 */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 mx-auto flex items-center justify-center text-stone-800 dark:text-stone-200">
              <Network className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-base font-bold tracking-tight">
                AI connects the dots.
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed px-2">
                Assignments connect to lecture notes, client ideas link to past projects. Second Brain figures out relationships.
              </p>
            </div>
          </div>
        )}

        {/* Screen 3 */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 mx-auto flex items-center justify-center text-stone-800 dark:text-stone-200">
              <Search className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-base font-bold tracking-tight">
                Ask your memory anything.
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed px-2">
                Ask in plain language and get grounded answers with source citations, separating facts from inference.
              </p>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="pt-2">
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="w-full py-3 px-4 rounded-xl bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 text-xs font-semibold flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="w-full py-3 px-4 rounded-xl bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 text-xs font-semibold flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
            >
              <span>Start building your second brain</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
