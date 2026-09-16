import { useState } from 'react';

export default function OnboardingTour({ isOpen, onClose }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to NexusAdmin! 👋",
      description: "Let's take a quick tour to get you familiar with the key features of your control center.",
    },
    {
      title: "Command Palette (Ctrl + K) ⚡",
      description: "Press Ctrl + K anywhere on the dashboard to open quick navigation and jump between tabs instantly.",
    },
    {
      title: "User Management & CSV Export 👥",
      description: "Manage accounts, edit roles, filter records easily, and export complete reports in CSV format.",
    },
    {
      title: "Analytics, Security & Billing 🛡️",
      description: "Track performance charts, review session logs, configure API webhooks, and manage subscription plans.",
    }
  ];

  if (!isOpen) return null;

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      onClose();
      setStep(0);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5">
        
        {/* Step Indicator */}
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700/60 pb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">
            Step {step + 1} of {steps.length}
          </span>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold transition"
          >
            Skip Tour
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {currentStep.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Navigation & Progress Dots */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex space-x-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === step 
                    ? 'w-6 bg-indigo-600 dark:bg-indigo-400' 
                    : 'w-1.5 bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md shadow-indigo-600/20"
            >
              {step === steps.length - 1 ? 'Get Started 🚀' : 'Next →'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}