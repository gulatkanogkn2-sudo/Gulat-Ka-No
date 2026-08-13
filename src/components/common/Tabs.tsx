import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex space-x-1 p-1 bg-[#0A0F1D] rounded-xl border border-white/10 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-[#050810] text-[#00D9FF] shadow-md border border-[#00D9FF]/30 glow-border-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive
                    ? 'bg-[#00D9FF]/20 text-[#00D9FF]'
                    : 'bg-white/10 text-slate-400'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
