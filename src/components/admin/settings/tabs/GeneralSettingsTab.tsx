import React from 'react';
import { GeneralSettings } from '../../../../types/systemSettings';
import { SettingCard } from '../common/SettingCard';
import { SettingInput } from '../common/SettingInput';
import { SettingSelect } from '../common/SettingSelect';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { Globe, Clock, ShieldAlert, Cpu, Lock, CheckCircle2 } from 'lucide-react';

export interface GeneralSettingsTabProps {
  settings: GeneralSettings;
  onChange: (updated: GeneralSettings) => void;
  errors?: Record<string, string>;
}

export const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({
  settings,
  onChange,
  errors = {} as Record<string, string>,
}) => {
  const handleChange = (key: keyof GeneralSettings, value: unknown) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. PLATFORM BRAND & IDENTITY */}
      <SettingCard
        title="Platform Brand & Identity"
        description="Public site title and official business name shown across browser tabs, customer receipts, and communications"
        icon={<Globe size={18} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          <SettingInput
            label="Website Title Name"
            value={settings.websiteName}
            onChange={(val) => handleChange('websiteName', val)}
            helperText="Display name shown in browser metadata and storefront surfaces."
            error={errors.websiteName}
          />
          <SettingInput
            label="Brand Trademark Identifier"
            value={settings.brandName}
            onChange={(val) => handleChange('brandName', val)}
            helperText="Display brand shown in headers, navigation, and customer pages."
            error={errors.brandName}
          />
          <SettingInput
            label="Legal Corporate Entity Name"
            value={settings.companyName}
            onChange={(val) => handleChange('companyName', val)}
            helperText="Official registered business entity printed on customer invoices."
            exampleText="GKN Research Group Ltd."
            error={errors.companyName}
          />
        </div>
      </SettingCard>

      {/* 2. REGIONAL & LOCALIZATION */}
      <SettingCard
        title="Regional & Localization"
        description="System operating timezone, default date/time formatting, primary currency, and forex conversion parameters"
        icon={<Clock size={18} />}
      >
        {/* 4-Column Grid for Core Localization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          <SettingSelect
            label="System Timezone"
            value={settings.timezone}
            onChange={(val) => handleChange('timezone', val)}
            options={[
              { value: 'Asia/Manila (GMT+8)', label: 'Asia/Manila (GMT+8)', description: 'PH Local Time' },
              { value: 'UTC', label: 'UTC (Universal Time)', description: 'Server Standard' },
              { value: 'America/New_York (EST)', label: 'America/New_York (EST)', description: 'US Eastern' },
              { value: 'Europe/London (GMT)', label: 'Europe/London (GMT)', description: 'UK / Europe' },
              { value: 'Asia/Tokyo (JST)', label: 'Asia/Tokyo (JST)', description: 'Japan Time' },
            ]}
            helperText="Controls all batch opening, closing, and order timestamp calculations."
            exampleText="Asia/Manila"
            error={errors.timezone}
          />
          <SettingSelect
            label="Date & Time Display Format"
            value={settings.dateFormat}
            onChange={(val) => handleChange('dateFormat', val)}
            options={[
              { value: 'YYYY-MM-DD HH:mm', label: 'YYYY-MM-DD HH:mm (2026-08-10 14:30)', description: 'ISO Standard' },
              { value: 'DD/MM/YYYY HH:mm', label: 'DD/MM/YYYY HH:mm (10/08/2026 14:30)', description: 'European' },
              { value: 'MM/DD/YYYY hh:mm A', label: 'MM/DD/YYYY hh:mm A (08/10/2026 02:30 PM)', description: 'US 12-hr' },
              { value: 'ISO 8601', label: 'ISO 8601 UTC timestamp', description: 'Machine ISO' },
            ]}
            helperText="Format used when displaying order creation dates and batch timelines."
            exampleText="YYYY-MM-DD HH:mm"
            error={errors.dateFormat}
          />
          <SettingSelect
            label="Base Display Currency"
            value={settings.currency}
            onChange={(val) => handleChange('currency', val)}
            options={[
              { value: 'PHP', label: 'Philippine Peso (PHP ₱)', description: 'Primary' },
              { value: 'USD', label: 'US Dollar (USD $)', description: 'Secondary' },
              { value: 'EUR', label: 'Euro (EUR €)', description: 'Euro' },
              { value: 'USDT', label: 'Tether Crypto (USDT)', description: 'Crypto' },
            ]}
            helperText="Primary operating currency for store prices, cart totals, and receipts."
            exampleText="PHP"
            error={errors.currency}
          />
          <SettingSelect
            label="Default System Language"
            value={settings.language}
            onChange={(val) => handleChange('language', val)}
            options={[
              { value: 'en-US', label: 'English (United States)', description: 'Primary Language' },
              { value: 'fil-PH', label: 'Filipino / Tagalog', description: 'Local Dialect' },
            ]}
            helperText="Default locale for button labels, receipts, and system alerts."
            exampleText="en-US"
            error={errors.language}
          />
        </div>

        {/* Currency Conversion Grid */}
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          <SettingInput
            label="USD → PHP Exchange Rate (1 USD = ₱ PHP)"
            type="number"
            step="0.0001"
            prefixText="₱"
            suffixText="PHP / $1 USD"
            value={settings.usdToPhpExchangeRate ?? 57.0833}
            onChange={(val) => {
              const num = parseFloat(val);
              handleChange('usdToPhpExchangeRate', isNaN(num) ? '' : num);
            }}
            helperText="Centralized exchange rate used to calculate dual-currency PHP and USD prices throughout checkout."
            exampleText="57.08"
            error={errors.usdToPhpExchangeRate}
          />
          <SettingInput
            label="Global Currency Conversion Markup (%)"
            type="number"
            min="0"
            step="0.1"
            suffixText="%"
            value={settings.currencyMarkupPercent ?? 0}
            onChange={(val) => {
              const num = parseFloat(val);
              handleChange('currencyMarkupPercent', isNaN(num) ? '' : num);
            }}
            helperText="Optional percentage buffer added onto converted currency amounts to hedge against forex fluctuations."
            exampleText="1.5%"
            error={errors.currencyMarkupPercent}
          />
        </div>
      </SettingCard>

      {/* 3. PLATFORM STATUS */}
      <SettingCard
        title="Platform Status & Maintenance"
        description="Control global customer access and customize public maintenance screen announcements"
        icon={<ShieldAlert size={18} />}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="space-y-1">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Global Platform Maintenance Mode
            </span>
            <p className="text-xs text-slate-400">
              When ON, customer storefront pages display a friendly "Scheduled Maintenance" screen. Administrators can still log in and access /admin.
            </p>
          </div>
          <ToggleSwitch
            checked={settings.maintenanceMode}
            onChange={(checked) => handleChange('maintenanceMode', checked)}
            activeColor="magenta"
            label={settings.maintenanceMode ? 'ENABLED (Store Closed)' : 'DISABLED (Live Operations)'}
          />
        </div>

        {/* Maintenance Message Customization */}
        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            <SettingInput
              label="Maintenance Title"
              value={settings.maintenanceTitle || 'Scheduled Maintenance'}
              onChange={(val) => handleChange('maintenanceTitle', val)}
              helperText="Headline displayed to customers during platform maintenance."
              exampleText="Scheduled Maintenance"
              error={errors.maintenanceTitle}
            />
            <SettingInput
              label="Expected Return Time (Optional)"
              value={settings.maintenanceReturnText || ''}
              onChange={(val) => handleChange('maintenanceReturnText', val)}
              helperText="Estimated timeframe or message regarding expected return to operational state."
              exampleText="Expected back online in 30 minutes."
              error={errors.maintenanceReturnText}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Customer Announcement Message
            </label>
            <textarea
              rows={3}
              value={settings.maintenanceMessage || ''}
              onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
              placeholder="We're currently performing scheduled maintenance. Please check back shortly."
              className={`w-full bg-[#050810] border border-white/10 text-white text-xs p-3.5 rounded-xl transition-all focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] ${
                errors.maintenanceMessage ? 'border-red-500 focus:border-red-500' : ''
              }`}
            />
            {errors.maintenanceMessage ? (
              <p className="text-[11px] text-red-400 font-mono mt-1">{errors.maintenanceMessage}</p>
            ) : (
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                Detailed maintenance announcement shown on customer storefront.
              </p>
            )}
          </div>
        </div>
      </SettingCard>

      {/* 4. SYSTEM INFORMATION */}
      <SettingCard
        title="System Information"
        description="Read-only application build metrics and live operational readiness status"
        icon={<Cpu size={18} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Core Version Read-Only Display */}
          <div className="p-4 rounded-xl bg-[#050810] border border-white/10 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#00D9FF]" />
                Application Core Version
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-bold uppercase">
                READ ONLY
              </span>
            </div>

            <div className="text-sm font-mono font-extrabold text-[#00D9FF] tracking-wider pt-1">
              {settings.applicationVersion || '2.4.10-LOCKED-MASTER'}
            </div>

            <p className="text-[11px] text-slate-500 font-mono">
              Managed automatically by system deployment pipelines.
            </p>
          </div>

          {/* Deployment Status Read-Only Display */}
          <div className="p-4 rounded-xl bg-[#050810] border border-white/10 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Deployment Status
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>

            <div className="text-sm font-mono font-extrabold text-white tracking-wide pt-1">
              Active GKN Production Build
            </div>

            <p className="text-[11px] text-slate-500 font-mono">
              Cloud Run Container &bull; Region: asia-southeast1
            </p>
          </div>
        </div>
      </SettingCard>
    </div>
  );
};

