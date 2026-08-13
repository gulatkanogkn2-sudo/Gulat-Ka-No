import React, { useState } from 'react';
import { StoreSettings, StoreConfig, OrderSettings } from '../../../../types/systemSettings';
import { systemSettingsService } from '../../../../services/systemSettingsService';
import { SettingCard } from '../common/SettingCard';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { Store, Settings, Plus, Calendar, Package, Layers } from 'lucide-react';
import { CreateStoreModal } from '../../store/CreateStoreModal';
import { StoreSettingsEditorModal } from '../../store/StoreSettingsEditorModal';
import { getEffectiveStoreStatus } from '../../../../utils/storeStatusUtils';

export interface StoreSettingsTabProps {
  settings: StoreSettings;
  onChange: (updated: StoreSettings) => void;
  orderSettings?: OrderSettings;
  onChangeOrders?: (updated: OrderSettings) => void;
}

export const StoreSettingsTab: React.FC<StoreSettingsTabProps> = ({
  settings,
  onChange,
  orderSettings,
  onChangeOrders,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEditStore, setSelectedEditStore] = useState<StoreConfig | null>(null);

  const handleSaveStore = (updatedStore: StoreConfig) => {
    const updatedStores: StoreSettings = {
      ...settings,
      [updatedStore.key]: updatedStore,
    };
    onChange(updatedStores);
    systemSettingsService.saveSettings({ stores: updatedStores });
  };

  const handleToggleStoreActive = (storeKey: string, checked: boolean) => {
    const existing = settings[storeKey];
    if (!existing) return;
    const updatedStore: StoreConfig = {
      ...existing,
      enabled: checked,
      status: checked ? 'Active' : 'Inactive',
    };
    handleSaveStore(updatedStore);
  };

  const storesList = (Object.values(settings) as StoreConfig[]).sort((a, b) => (a.order || 1) - (b.order || 1));

  return (
    <div className="space-y-6">
      {/* Top Header Bar with Create Store Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#090D16] border border-[#00D9FF]/20 shadow-[0_0_30px_rgba(0,217,255,0.05)]">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wide font-mono flex items-center gap-2">
            <Store className="w-5 h-5 text-[#00D9FF]" />
            <span>STORE MANAGEMENT & CAPABILITIES</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage independent store instances, feature capabilities, and custom availability schedules.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-black font-extrabold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,217,255,0.3)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE NEW STORE</span>
        </button>
      </div>

      {/* Stores List Cards */}
      <div className="space-y-4">
        {storesList.map((store) => {
          const effective = getEffectiveStoreStatus(store);
          const caps = store.capabilities || { openCloseControl: true, inventoryManagement: false, variantInventory: false };
          const avail = store.availability;

          return (
            <SettingCard
              key={store.key}
              title={store.name}
              description={store.description || `Configured store instance (${store.code})`}
              icon={<Store size={18} style={{ color: store.accentColor }} />}
              badge={
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border"
                    style={{
                      backgroundColor: `${store.accentColor}15`,
                      color: store.accentColor,
                      borderColor: `${store.accentColor}40`,
                    }}
                  >
                    {store.code || store.key.toUpperCase()}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                      effective.isOpen
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    STATUS: {effective.statusLabel}
                  </span>
                </div>
              }
              actions={
                <ToggleSwitch
                  checked={store.enabled && store.status !== 'Inactive'}
                  onChange={(checked) => handleToggleStoreActive(store.key, checked)}
                  label={store.enabled ? 'Store Active' : 'Store Disabled'}
                  activeColor={store.key === 'groupbuy' ? 'cyan' : store.key === 'onhand' ? 'purple' : 'magenta'}
                />
              }
            >
              <div className="space-y-4 pt-2">
                {/* Capabilities Overview Pills */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-[#00D9FF]" />
                      <span>Open/Close Control</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        caps.openCloseControl
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {caps.openCloseControl ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                      <Package className="w-3.5 h-3.5 text-purple-400" />
                      <span>Inventory Mgmt</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        caps.inventoryManagement
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {caps.inventoryManagement ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                      <Layers className="w-3.5 h-3.5 text-pink-400" />
                      <span>Variant Inventory</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        caps.variantInventory
                          ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {caps.variantInventory ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                </div>

                {/* Status Explanation Bar & Edit Action Button */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-300 font-mono">
                      <strong className="text-white">STATUS LOGIC:</strong> {effective.reason}
                    </p>
                    {avail?.scheduleMode && (
                      <p className="text-[11px] font-mono text-slate-500">
                        Schedule Mode: <span className="text-[#00D9FF] uppercase">{avail.scheduleMode}</span> | Timezone: {avail.timezone || 'Asia/Manila'}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedEditStore(store)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs tracking-wide transition-colors border border-slate-700 shrink-0"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#00D9FF]" />
                    <span>CONFIGURE SETTINGS & SCHEDULE</span>
                  </button>
                </div>
              </div>
            </SettingCard>
          );
        })}
      </div>

      {/* Create Store Modal */}
      <CreateStoreModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleSaveStore}
      />

      {/* Edit Store Operational Settings Modal */}
      <StoreSettingsEditorModal
        isOpen={!!selectedEditStore}
        store={selectedEditStore}
        onClose={() => setSelectedEditStore(null)}
        onSave={handleSaveStore}
      />
    </div>
  );
};
