import React, { useState } from 'react';
import { StoreSettings, OrderSettings } from '../../../../types/systemSettings';
import { StoreSettingsTab } from './StoreSettingsTab';
import { ProductAddonsSettingsTab } from './ProductAddonsSettingsTab';
import { CustomerTiersSettingsTab } from './CustomerTiersSettingsTab';
import { ShoppingBag, Link2, Crown } from 'lucide-react';

interface StoresAndProductsTabProps {
  settings: StoreSettings;
  onChange: (updated: StoreSettings) => void;
  orderSettings?: OrderSettings;
  onChangeOrders?: (updated: OrderSettings) => void;
  subTabParam?: string;
}

export const StoresAndProductsTab: React.FC<StoresAndProductsTabProps> = ({
  settings,
  onChange,
  orderSettings,
  onChangeOrders,
  subTabParam,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'instances' | 'addons' | 'tiers'>(() => {
    if (subTabParam === 'productAddons') return 'addons';
    if (subTabParam === 'customerTiers') return 'tiers';
    return 'instances';
  });

  return (
    <div className="space-y-6">
      {/* Sub-navigation Pills */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#070B14] border border-white/10 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('instances')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'instances'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShoppingBag size={14} />
          <span>Store Instances & Schedule</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('addons')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'addons'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Link2 size={14} />
          <span>Product Add-ons & Bundles</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('tiers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'tiers'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Crown size={14} />
          <span>Customer Tiers & Bulk Discounts</span>
        </button>
      </div>

      {/* Render Active View */}
      {activeSubTab === 'instances' && (
        <StoreSettingsTab
          settings={settings}
          onChange={onChange}
          orderSettings={orderSettings}
          onChangeOrders={onChangeOrders}
        />
      )}

      {activeSubTab === 'addons' && (
        <ProductAddonsSettingsTab />
      )}

      {activeSubTab === 'tiers' && (
        <CustomerTiersSettingsTab />
      )}
    </div>
  );
};
