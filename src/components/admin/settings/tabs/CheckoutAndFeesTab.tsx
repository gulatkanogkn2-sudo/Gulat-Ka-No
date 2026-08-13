import React, { useState } from 'react';
import { ShippingSettings, OrderSettings } from '../../../../types/systemSettings';
import { AccessoriesSettingsTab } from './AccessoriesSettingsTab';
import { ShippingSettingsTab } from './ShippingSettingsTab';
import { CheckoutValidationSettingsTab } from './CheckoutValidationSettingsTab';
import { PackageCheck, DollarSign, ShieldCheck } from 'lucide-react';

interface CheckoutAndFeesTabProps {
  orderSettings?: OrderSettings;
  shippingSettings?: ShippingSettings;
  onChangeOrders?: (updated: OrderSettings) => void;
  onChangeShipping?: (updated: ShippingSettings) => void;
  // Fallbacks for legacy props
  settings?: ShippingSettings;
  onChange?: (updated: ShippingSettings) => void;
  subTabParam?: string;
}

export const CheckoutAndFeesTab: React.FC<CheckoutAndFeesTabProps> = ({
  orderSettings,
  shippingSettings,
  onChangeOrders,
  onChangeShipping,
  settings,
  onChange,
  subTabParam,
}) => {
  const activeShippingSettings = shippingSettings || settings || {
    vialUnitConfig: { vialsPerKit: 10 },
    methods: [],
    additionalFees: [],
    defaultDeliveryTimeframe: '1-3 Days',
  };

  const handleShippingChange = onChangeShipping || onChange || (() => {});

  const [activeSubTab, setActiveSubTab] = useState<'validation' | 'accessories' | 'fees'>(() => {
    if (subTabParam === 'accessories') return 'accessories';
    if (subTabParam === 'fees') return 'fees';
    return 'validation';
  });

  return (
    <div className="space-y-6">
      {/* Sub-navigation Pills */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#070B14] border border-white/10 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('validation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'validation'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldCheck size={14} />
          <span>Checkout Rules & Policy Validation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('accessories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'accessories'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <PackageCheck size={14} />
          <span>Checkout Accessories</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('fees')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'fees'
              ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 shadow-[0_0_10px_rgba(0,217,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <DollarSign size={14} />
          <span>Additional Surcharges & Fee Simulator</span>
        </button>
      </div>

      {/* Render Active View */}
      {activeSubTab === 'validation' && orderSettings && onChangeOrders && (
        <CheckoutValidationSettingsTab settings={orderSettings} onChange={onChangeOrders} />
      )}

      {activeSubTab === 'accessories' && <AccessoriesSettingsTab />}

      {activeSubTab === 'fees' && (
        <ShippingSettingsTab settings={activeShippingSettings} onChange={handleShippingChange} />
      )}
    </div>
  );
};
