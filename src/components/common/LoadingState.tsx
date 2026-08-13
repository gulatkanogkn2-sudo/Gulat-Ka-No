import React from 'react';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Initializing research data...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-14 h-14 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px] text-center">
      <div className="relative flex items-center justify-center">
        <div
          className={`${sizeClasses[size]} border-white/10 border-t-[#00D9FF] border-r-[#8B5CF6] rounded-full animate-spin`}
        ></div>
        <div className="absolute inset-0 rounded-full blur-sm bg-[#00D9FF]/20 animate-pulse"></div>
      </div>
      {message && <p className="mt-4 text-xs font-mono tracking-wider text-slate-400 uppercase">{message}</p>}
    </div>
  );
};
