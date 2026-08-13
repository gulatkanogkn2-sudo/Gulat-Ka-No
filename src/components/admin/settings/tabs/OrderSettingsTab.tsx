import React from 'react';
import { OrderSettings } from '../../../../types/systemSettings';
import { SettingCard } from '../common/SettingCard';
import { SettingInput } from '../common/SettingInput';
import { SettingSelect } from '../common/SettingSelect';
import { Hash } from 'lucide-react';

export interface OrderSettingsTabProps {
  settings: OrderSettings;
  onChange: (updated: OrderSettings) => void;
}

export const OrderSettingsTab: React.FC<OrderSettingsTabProps> = ({ settings, onChange }) => {
  const handleChange = (field: keyof OrderSettings, value: unknown) => {
    onChange({
      ...settings,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Order Workflow Rules */}
      <SettingCard
        title="Order Workflow & Reference Configuration"
        description="Configure default submission status and tracking reference prefix for generated orders."
        icon={<Hash size={18} className="text-[#00D9FF]" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingSelect
            label="Initial Order Status Upon Submission"
            value={settings.defaultOrderStatus}
            onChange={(val) => handleChange('defaultOrderStatus', val)}
            options={[
              { value: 'Pending Verification', label: 'Pending Payment Verification', description: 'Requires staff review' },
              { value: 'Payment Received', label: 'Payment Received (Auto-Approved)', description: 'Auto-approves upon upload' },
              { value: 'Processing', label: 'Order Processing', description: 'Direct to fulfillment queue' },
              { value: 'On Hold', label: 'On Hold / Needs Review', description: 'Holds order for inspection' },
            ]}
            helperText="Status assigned to newly submitted orders prior to staff verification."
            exampleText="Pending Payment Verification"
            tooltipText="Controls initial status tag shown in customer dashboard and admin orders queue."
          />
          <SettingInput
            label="Order Reference Code Prefix"
            value={settings.autoOrderPrefix}
            onChange={(val) => handleChange('autoOrderPrefix', val)}
            helperText="Prefix generated for order tracking numbers (e.g., GKN-2026-00492)."
            exampleText="GKN-2026-"
            tooltipText="Prepended to sequential numeric order IDs."
          />
        </div>
      </SettingCard>
    </div>
  );
};

