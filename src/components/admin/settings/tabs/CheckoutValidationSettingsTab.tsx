import React from 'react';
import { OrderSettings, CheckoutOptions } from '../../../../types/systemSettings';
import { SettingCard } from '../common/SettingCard';
import { SettingInput } from '../common/SettingInput';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { DollarSign, ShieldAlert } from 'lucide-react';

export interface CheckoutValidationSettingsTabProps {
  settings: OrderSettings;
  onChange: (updated: OrderSettings) => void;
}

export const CheckoutValidationSettingsTab: React.FC<CheckoutValidationSettingsTabProps> = ({
  settings,
  onChange,
}) => {
  const handleChange = (field: keyof OrderSettings, value: unknown) => {
    onChange({
      ...settings,
      [field]: value,
    });
  };

  const handleCheckoutOptionChange = (field: keyof CheckoutOptions, value: unknown) => {
    onChange({
      ...settings,
      checkoutOptions: {
        ...settings.checkoutOptions,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Financial Limits */}
      <SettingCard
        title="Checkout Amount Limits & Order Bounds"
        description="Set minimum cart total requirements and maximum single transaction limits for checkout validation"
        icon={<DollarSign size={18} className="text-[#00D9FF]" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingInput
            label="Minimum Checkout Order Total"
            type="number"
            min="0"
            step="0.01"
            prefixText="₱"
            suffixText="PHP Total"
            value={settings.minOrderAmount}
            onChange={(val) =>
              handleChange('minOrderAmount', val === '' ? 0 : isNaN(parseFloat(val)) ? 0 : parseFloat(val))
            }
            helperText="Orders below this minimum amount cannot proceed through checkout."
            exampleText="₱500.00"
            tooltipText="Set to 0 to remove minimum order requirement."
          />
          <SettingInput
            label="Maximum Single Order Limit Cap"
            type="number"
            min="0"
            step="0.01"
            prefixText="₱"
            suffixText="PHP Total"
            value={settings.maxOrderAmount}
            onChange={(val) =>
              handleChange('maxOrderAmount', val === '' ? 0 : isNaN(parseFloat(val)) ? 0 : parseFloat(val))
            }
            helperText="Single orders exceeding this cap require direct admin authorization."
            exampleText="₱500,000.00"
            tooltipText="Protects against fraudulent large bulk checkout attempts."
          />
        </div>
      </SettingCard>

      {/* Checkout Policy Options */}
      <SettingCard
        title="Checkout Validation & Policies"
        description="Configure guest checkout permissions, terms waivers, notes, and courier dispatch requirements"
        icon={<ShieldAlert size={18} className="text-[#00D9FF]" />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <ToggleSwitch
              label="Allow Guest Checkout"
              description="Permit customers to place orders without forcing account registration."
              checked={settings.checkoutOptions.allowGuestCheckout}
              onChange={(val) => handleCheckoutOptionChange('allowGuestCheckout', val)}
            />
            <ToggleSwitch
              label="Require Terms & Conditions Waiver"
              description="Mandate digital agreement check before order placement."
              checked={settings.checkoutOptions.requireResearchWaiver}
              onChange={(val) => handleCheckoutOptionChange('requireResearchWaiver', val)}
              activeColor="magenta"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <ToggleSwitch
              label="Enable Special Order Notes Field"
              description="Allow buyers to add custom delivery or dispatch notes during checkout."
              checked={settings.checkoutOptions.enableOrderNotes}
              onChange={(val) => handleCheckoutOptionChange('enableOrderNotes', val)}
            />
            <ToggleSwitch
              label="Require Mobile Phone Number for Dispatch"
              description="Mandatory courier contact number required for local delivery."
              checked={settings.checkoutOptions.requirePhoneNumber}
              onChange={(val) => handleCheckoutOptionChange('requirePhoneNumber', val)}
            />
          </div>
        </div>
      </SettingCard>
    </div>
  );
};
