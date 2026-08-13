import React from 'react';
import { NotificationSettings, NotificationEventConfig } from '../../../../types/systemSettings';
import { SettingCard } from '../common/SettingCard';
import { SettingInput } from '../common/SettingInput';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { Bell, Mail, Send, Smartphone, MessageSquare } from 'lucide-react';

export interface NotificationSettingsTabProps {
  settings: NotificationSettings;
  onChange: (updated: NotificationSettings) => void;
}

export const NotificationSettingsTab: React.FC<NotificationSettingsTabProps> = ({ settings, onChange }) => {
  const handleEventChange = (
    eventKey: keyof Omit<NotificationSettings, 'adminEmailRecipient' | 'adminTelegramChatId'>,
    field: keyof NotificationEventConfig,
    value: unknown
  ) => {
    const currentEvent = settings[eventKey] as NotificationEventConfig;
    onChange({
      ...settings,
      [eventKey]: {
        ...currentEvent,
        [field]: value,
      },
    });
  };

  const handleChannelChange = (
    eventKey: keyof Omit<NotificationSettings, 'adminEmailRecipient' | 'adminTelegramChatId'>,
    channel: 'email' | 'sms' | 'telegram' | 'inApp',
    enabled: boolean
  ) => {
    const currentEvent = settings[eventKey] as NotificationEventConfig;
    onChange({
      ...settings,
      [eventKey]: {
        ...currentEvent,
        channels: {
          ...currentEvent.channels,
          [channel]: enabled,
        },
      },
    });
  };

  const EVENTS_LIST: Array<{
    key: keyof Omit<NotificationSettings, 'adminEmailRecipient' | 'adminTelegramChatId'>;
    title: string;
    variablesHelp: string;
  }> = [
    {
      key: 'orderCreated',
      title: 'Order Created Confirmation',
      variablesHelp: 'Merge tags: {{customer_name}}, {{order_ref}}, {{store}}, {{grand_total}}',
    },
    {
      key: 'paymentReceived',
      title: 'Payment Proof Uploaded',
      variablesHelp: 'Merge tags: {{customer_name}}, {{order_ref}}, {{payment_method}}',
    },
    {
      key: 'paymentVerified',
      title: 'Payment Verified Approval',
      variablesHelp: 'Merge tags: {{customer_name}}, {{order_ref}}, {{amount_paid}}',
    },
    {
      key: 'paymentRejected',
      title: 'Payment Verification Rejected',
      variablesHelp: 'Merge tags: {{customer_name}}, {{order_ref}}, {{rejection_reason}}',
    },
    {
      key: 'shipmentDispatched',
      title: 'Shipment Dispatched & Waybill',
      variablesHelp: 'Merge tags: {{customer_name}}, {{order_ref}}, {{tracking_no}}, {{courier}}',
    },
    {
      key: 'delivered',
      title: 'Delivery Completed Confirmation',
      variablesHelp: 'Merge tags: {{customer_name}}, {{order_ref}}',
    },
    {
      key: 'adminAlerts',
      title: 'Administrator Operations Alerts',
      variablesHelp: 'Merge tags: {{order_ref}}, {{alert_type}}, {{alert_details}}',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-4 rounded-xl border border-[#00D9FF]/30 bg-[#00D9FF]/5 flex items-center justify-between gap-4 text-xs text-slate-300">
        <div className="flex items-center space-x-3">
          <Bell className="text-[#00D9FF] flex-shrink-0" size={20} />
          <div>
            <span className="font-bold text-white block font-mono">Notification System Routing & Event Templates</span>
            <span className="font-mono text-slate-400">
              Configure event triggers, delivery channels, and message templates. Webhooks dispatch via configured provider credentials.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[10px] font-mono">
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
            IN-APP & TG: CONNECTED
          </span>
        </div>
      </div>

      {/* Dispatch Channels & Triggers */}
      <SettingCard
        title="Event Notification Triggers & Channels"
        description="Select active notification delivery channels and customize message templates for each event"
        icon={<Send size={18} />}
      >
        <div className="space-y-4">
          {EVENTS_LIST.map((evt) => {
            const eventConfig = settings[evt.key] as NotificationEventConfig | undefined;
            if (!eventConfig) return null;

            return (
              <div
                key={evt.key}
                className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">{eventConfig.name || evt.title}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">{eventConfig.description}</p>
                  </div>
                  <ToggleSwitch
                    checked={eventConfig.enabled}
                    onChange={(checked) => handleEventChange(evt.key, 'enabled', checked)}
                    size="sm"
                    label={eventConfig.enabled ? 'Trigger Active' : 'Trigger Muted'}
                  />
                </div>

                {/* Channel Toggles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${evt.key}_email`}
                      checked={eventConfig.channels.email}
                      onChange={(e) => handleChannelChange(evt.key, 'email', e.target.checked)}
                      className="rounded border-white/20 bg-slate-900 text-[#00D9FF] focus:ring-[#00D9FF]"
                    />
                    <label htmlFor={`${evt.key}_email`} className="text-xs text-slate-300 font-mono">
                      Email
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${evt.key}_sms`}
                      checked={eventConfig.channels.sms}
                      onChange={(e) => handleChannelChange(evt.key, 'sms', e.target.checked)}
                      className="rounded border-white/20 bg-slate-900 text-[#00D9FF] focus:ring-[#00D9FF]"
                    />
                    <label htmlFor={`${evt.key}_sms`} className="text-xs text-slate-300 font-mono">
                      SMS
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${evt.key}_telegram`}
                      checked={eventConfig.channels.telegram}
                      onChange={(e) => handleChannelChange(evt.key, 'telegram', e.target.checked)}
                      className="rounded border-white/20 bg-slate-900 text-[#00D9FF] focus:ring-[#00D9FF]"
                    />
                    <label htmlFor={`${evt.key}_telegram`} className="text-xs text-slate-300 font-mono">
                      Telegram Bot
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${evt.key}_inApp`}
                      checked={eventConfig.channels.inApp}
                      onChange={(e) => handleChannelChange(evt.key, 'inApp', e.target.checked)}
                      className="rounded border-white/20 bg-slate-900 text-[#00D9FF] focus:ring-[#00D9FF]"
                    />
                    <label htmlFor={`${evt.key}_inApp`} className="text-xs text-slate-300 font-mono">
                      In-App Badge
                    </label>
                  </div>
                </div>

                {/* Template string */}
                <div className="pt-2 space-y-1">
                  <SettingInput
                    label="Message Template String"
                    value={eventConfig.template || ''}
                    onChange={(val) => handleEventChange(evt.key, 'template', val)}
                    helperText="Template format string sent in email, SMS, and Telegram notification payload."
                    exampleText="Order #{{order_ref}} status update for {{customer_name}}"
                  />
                  <p className="text-[10px] font-mono text-[#00D9FF]/90 bg-[#00D9FF]/10 px-2.5 py-1 rounded border border-[#00D9FF]/20">
                    {evt.variablesHelp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </SettingCard>

      {/* Admin Operations Recipients */}
      <SettingCard
        title="Admin Alert Destinations"
        description="Recipients for high-priority operational system alerts"
        icon={<Mail size={18} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingInput
            label="Primary Admin Operations Email"
            value={settings.adminEmailRecipient}
            onChange={(val) => onChange({ ...settings, adminEmailRecipient: val })}
            helperText="Receives urgent verification and order escalation alerts."
            exampleText="ops-alerts@gknpeptides.com"
          />
          <SettingInput
            label="Telegram Alert Bot Channel / Chat ID"
            value={settings.adminTelegramChatId}
            onChange={(val) => onChange({ ...settings, adminTelegramChatId: val })}
            helperText="Telegram group or bot chat ID for instant operational push alerts."
            exampleText="-100123456789 or @GKN_OpsAlerts_Bot"
          />
        </div>
      </SettingCard>
    </div>
  );
};
