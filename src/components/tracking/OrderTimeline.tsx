import React from 'react';
import { TimelineStep } from '../../types/order';
import { Check, Clock, Box, PackageCheck, Truck, CheckCircle2, FileCheck, ShieldCheck } from 'lucide-react';

interface OrderTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ steps, className = '' }) => {
  const getStepIcon = (index: number) => {
    switch (index % 6) {
      case 0:
        return <Clock className="w-4 h-4" />;
      case 1:
        return <FileCheck className="w-4 h-4" />;
      case 2:
        return <Box className="w-4 h-4" />;
      case 3:
        return <PackageCheck className="w-4 h-4" />;
      case 4:
        return <Truck className="w-4 h-4" />;
      case 5:
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <ShieldCheck className="w-4 h-4" />;
    }
  };

  return (
    <div className={`p-4 sm:p-6 rounded-2xl bg-[#090D16]/90 border border-white/10 space-y-6 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#00D9FF]" />
          Order Lifecycle & Dispatch Timeline
        </h3>
        <span className="text-[10px] font-mono text-slate-400">
          {steps.length} Configured Stages
        </span>
      </div>

      {/* Desktop View (xl: 1280px+) */}
      <div className="hidden xl:flex items-start justify-between relative px-2 gap-2">
        {/* Connecting line */}
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-white/10 -z-0" />

        {steps.map((step, idx) => {
          return (
            <div key={`${step.label}-${idx}`} className="relative z-10 flex flex-col items-center text-center flex-1 min-w-0 group">
              {/* Node Circle */}
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                  step.isCurrent
                    ? 'bg-[#00D9FF] text-black border-[#00D9FF] shadow-[0_0_20px_rgba(0,217,255,0.6)] scale-110'
                    : step.isCompleted
                    ? 'bg-[#00D9FF]/20 text-[#00D9FF] border-[#00D9FF]/50'
                    : 'bg-black/60 text-slate-600 border-white/10'
                }`}
              >
                {step.isCompleted && !step.isCurrent ? <Check className="w-5 h-5" /> : getStepIcon(idx)}
              </div>

              {/* Label & Description */}
              <div className="mt-2.5 space-y-0.5 max-w-[120px]">
                <span
                  className={`block text-[11px] font-mono font-bold leading-tight break-words ${
                    step.isCurrent
                      ? 'text-[#00D9FF]'
                      : step.isCompleted
                      ? 'text-white'
                      : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
                {step.timestamp && (
                  <span className="block text-[9px] font-mono text-slate-400">{step.timestamp}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile / Tablet / Medium Desktop View (< 1280px) */}
      <div className="xl:hidden space-y-4 relative pl-3">
        {/* Vertical Line */}
        <div className="absolute top-3 bottom-3 left-6 w-0.5 bg-white/10" />

        {steps.map((step, idx) => (
          <div key={`${step.label}-${idx}`} className="relative flex items-start gap-4 z-10">
            {/* Step Icon */}
            <div
              className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all ${
                step.isCurrent
                  ? 'bg-[#00D9FF] text-black border-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.5)]'
                  : step.isCompleted
                  ? 'bg-[#00D9FF]/20 text-[#00D9FF] border-[#00D9FF]/50'
                  : 'bg-black/60 text-slate-600 border-white/10'
              }`}
            >
              {step.isCompleted && !step.isCurrent ? <Check className="w-4 h-4" /> : getStepIcon(idx)}
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`text-xs font-mono font-bold ${
                    step.isCurrent
                      ? 'text-[#00D9FF]'
                      : step.isCompleted
                      ? 'text-white'
                      : 'text-slate-500'
                  }`}
                >
                  {idx + 1}. {step.label}
                </span>
                {step.timestamp && (
                  <span className="text-[10px] font-mono text-slate-400">{step.timestamp}</span>
                )}
              </div>
              {step.description && (
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

