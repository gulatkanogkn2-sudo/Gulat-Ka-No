import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { GroupBuyBatchStatus } from '../../types/groupBuy';

interface GroupBuyCountdownProps {
  targetDate?: string;
  closingDate?: string;
  openingDate?: string;
  isOpen?: boolean;
  status?: GroupBuyBatchStatus | string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const GroupBuyCountdown: React.FC<GroupBuyCountdownProps> = ({
  targetDate,
  closingDate,
  openingDate,
  isOpen: isOpenProp,
  status,
  className = '',
}) => {
  // Determine if store is open
  const isOpen =
    typeof isOpenProp === 'boolean'
      ? isOpenProp
      : status
      ? status === 'Open' || status === 'Closing Soon'
      : true;

  // Determine effective target date strings
  const effectiveClosingDate = closingDate || targetDate || '';
  const effectiveOpeningDate = openingDate || '';

  const parseScheduleDate = (dateStr?: string): Date | null => {
    if (!dateStr || !dateStr.trim()) return null;
    const cleaned = dateStr.trim();
    const isoFormatted =
      cleaned.includes(' ') && !cleaned.includes('T')
        ? cleaned.replace(' ', 'T')
        : cleaned;
    const timestamp = Date.parse(isoFormatted);
    if (isNaN(timestamp)) return null;
    return new Date(timestamp);
  };

  const calculateCountdown = (): {
    timeLeft: TimeLeft;
    mode: 'open_countdown' | 'closed_countdown' | 'closed_unscheduled';
  } => {
    const now = Date.now();

    if (isOpen) {
      const closingD = parseScheduleDate(effectiveClosingDate);
      if (!closingD) {
        return {
          timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true },
          mode: 'open_countdown',
        };
      }
      const diff = closingD.getTime() - now;
      if (diff <= 0) {
        return {
          timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true },
          mode: 'open_countdown',
        };
      }
      return {
        timeLeft: {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          isExpired: false,
        },
        mode: 'open_countdown',
      };
    } else {
      // Store is CLOSED
      const openingD = parseScheduleDate(effectiveOpeningDate);
      if (!openingD) {
        return {
          timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true },
          mode: 'closed_unscheduled',
        };
      }
      const diff = openingD.getTime() - now;
      if (diff <= 0) {
        return {
          timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true },
          mode: 'closed_unscheduled',
        };
      }
      return {
        timeLeft: {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          isExpired: false,
        },
        mode: 'closed_countdown',
      };
    }
  };

  const [state, setState] = useState(calculateCountdown());

  useEffect(() => {
    setState(calculateCountdown());
    const timer = setInterval(() => {
      setState(calculateCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, effectiveClosingDate, effectiveOpeningDate]);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  // Mode 1: CLOSED and no future schedule set
  if (state.mode === 'closed_unscheduled') {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 text-rose-400" />
          <span>Next Batch Opening</span>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#070B14] border border-rose-500/30 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>Not Scheduled</span>
        </div>
      </div>
    );
  }

  // Mode 2: OPEN but closing date expired
  if (state.mode === 'open_countdown' && state.timeLeft.isExpired) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Batch Closing Countdown</span>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
          <span>PROCESSING BATCH CLOSURE</span>
        </div>
      </div>
    );
  }

  // Label text based on mode
  const labelText =
    state.mode === 'open_countdown' ? 'Batch Closing Countdown' : 'Next Batch Opens In';

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
        <Clock className="w-3.5 h-3.5 text-[#00D9FF]" />
        <span>{labelText}</span>
      </div>

      <div className="flex items-center gap-2 font-mono">
        <div className="flex flex-col items-center justify-center min-w-[42px] px-2 py-1 rounded bg-[#070B14] border border-[#00D9FF]/40 text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.15)]">
          <span className="text-sm font-bold">{formatNumber(state.timeLeft.days)}</span>
          <span className="text-[9px] text-slate-400 uppercase">Days</span>
        </div>
        <span className="text-[#00D9FF] font-bold text-xs">:</span>
        <div className="flex flex-col items-center justify-center min-w-[42px] px-2 py-1 rounded bg-[#070B14] border border-[#00D9FF]/40 text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.15)]">
          <span className="text-sm font-bold">{formatNumber(state.timeLeft.hours)}</span>
          <span className="text-[9px] text-slate-400 uppercase">Hrs</span>
        </div>
        <span className="text-[#00D9FF] font-bold text-xs">:</span>
        <div className="flex flex-col items-center justify-center min-w-[42px] px-2 py-1 rounded bg-[#070B14] border border-[#00D9FF]/40 text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.15)]">
          <span className="text-sm font-bold">{formatNumber(state.timeLeft.minutes)}</span>
          <span className="text-[9px] text-slate-400 uppercase">Min</span>
        </div>
        <span className="text-[#00D9FF] font-bold text-xs">:</span>
        <div className="flex flex-col items-center justify-center min-w-[42px] px-2 py-1 rounded bg-[#070B14] border border-[#00D9FF]/40 text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.15)]">
          <span className="text-sm font-bold">{formatNumber(state.timeLeft.seconds)}</span>
          <span className="text-[9px] text-slate-400 uppercase">Sec</span>
        </div>
      </div>
    </div>
  );
};

