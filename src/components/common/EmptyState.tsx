import React from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-white/10 rounded-xl bg-[var(--bg-panel)] backdrop-blur-md my-4 relative overflow-hidden group hover:border-[#00D9FF]/30 transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-[#00D9FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {icon ? (
        <div className="mb-4 text-[#00D9FF] p-4 bg-[#00D9FF]/10 rounded-full border border-[#00D9FF]/30 shadow-[0_0_15px_rgba(0,217,255,0.2)]">
          {icon}
        </div>
      ) : (
        <div className="mb-4 text-[#00D9FF] p-4 bg-[#00D9FF]/10 rounded-full border border-[#00D9FF]/30 shadow-[0_0_15px_rgba(0,217,255,0.2)] text-2xl">
          🧪
        </div>
      )}
      <h3 className="text-lg font-bold text-white tracking-wide relative z-10">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-400 max-w-md relative z-10">{description}</p>}
      {action && <div className="mt-6 relative z-10">{action}</div>}
    </div>
  );
};
