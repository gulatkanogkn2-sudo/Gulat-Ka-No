import React from 'react';

export interface StatusIndicatorProps {
  status: 'healthy' | 'degraded' | 'offline' | 'active' | 'inactive' | 'building';
  label?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'healthy':
      case 'active':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]',
          text: label || 'Operational',
        };
      case 'degraded':
      case 'building':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]',
          text: label || 'Degraded Performance',
        };
      case 'offline':
      case 'inactive':
      default:
        return {
          bg: 'bg-red-500/10 text-red-400 border-red-500/30',
          dot: 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]',
          text: label || 'Offline',
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <span className={`inline-flex items-center space-x-2 px-2.5 py-1 rounded-full text-[11px] font-mono border ${style.bg}`}>
      <span className={`w-2 h-2 rounded-full animate-pulse ${style.dot}`} />
      <span>{style.text}</span>
    </span>
  );
};
