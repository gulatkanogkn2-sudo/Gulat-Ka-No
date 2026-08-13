import React, { useState } from 'react';
import { OrderSettings } from '../../../../types/systemSettings';
import { OrderSettingsTab } from './OrderSettingsTab';
import { OrderTimelineSettingsTab } from './OrderTimelineSettingsTab';
import { ShoppingCart, Layers, Sliders } from 'lucide-react';

interface OrdersAndTimelinesTabProps {
  settings: OrderSettings;
  onChange: (updated: OrderSettings) => void;
  subTabParam?: string;
}

export const OrdersAndTimelinesTab: React.FC<OrdersAndTimelinesTabProps> = ({ settings, onChange, subTabParam }) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'workflow' | 'timelines'>(() => {
    if (subTabParam === 'orderTimeline') return 'timelines';
    if (subTabParam === 'workflow') return 'workflow';
    return 'all';
  });

  return (
    <div className="space-y-6">
      {/* Sub-navigation Pills */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#070B14] border border-white/10 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'all'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders size={14} />
          <span>All Workflow & Timelines</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('workflow')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'workflow'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShoppingCart size={14} />
          <span>Order Workflow</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('timelines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'timelines'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers size={14} />
          <span>Store Order Timelines</span>
        </button>
      </div>

      {/* Render Active Views */}
      {(activeSubTab === 'all' || activeSubTab === 'workflow') && (
        <OrderSettingsTab settings={settings} onChange={onChange} />
      )}

      {(activeSubTab === 'all' || activeSubTab === 'timelines') && (
        <OrderTimelineSettingsTab />
      )}
    </div>
  );
};
