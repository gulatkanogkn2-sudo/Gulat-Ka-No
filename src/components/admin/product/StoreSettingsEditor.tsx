import React from 'react';
import {
  AdminStoreType,
  GroupBuyStoreSettings,
  OnHandStoreSettings,
  MoqStoreSettings,
} from '../../../types/adminProduct';
import { Layers, Box, Factory, Calendar, Clock, ShieldCheck } from 'lucide-react';

interface StoreSettingsEditorProps {
  storeType: AdminStoreType;
  groupBuySettings?: GroupBuyStoreSettings;
  onHandSettings?: OnHandStoreSettings;
  moqSettings?: MoqStoreSettings;
  onChangeGroupBuy: (settings: GroupBuyStoreSettings) => void;
  onChangeOnHand: (settings: OnHandStoreSettings) => void;
  onChangeMoq: (settings: MoqStoreSettings) => void;
}

export const StoreSettingsEditor: React.FC<StoreSettingsEditorProps> = ({
  storeType,
  groupBuySettings,
  onHandSettings,
  moqSettings,
  onChangeGroupBuy,
  onChangeOnHand,
  onChangeMoq,
}) => {
  // GroupBuy Store Specific Form
  if (storeType === 'groupbuy') {
    const settings = groupBuySettings || {
      batchId: 'GB-2026-08',
      batchName: 'Batch Run #GB-2026-08',
      batchStatus: 'Active Collection',
      batchVisibility: 'Public',
      closingDate: '2026-08-15',
      progressPercent: 80,
    };

    return (
      <div className="p-4 rounded-xl bg-slate-950/90 border border-[#8B5CF6]/30 space-y-4 font-mono text-xs">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <Layers className="w-4 h-4 text-[#8B5CF6]" />
          <h4 className="text-sm font-bold text-[#8B5CF6] uppercase tracking-tight">
            GroupBuy Store Settings
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">BATCH ID / CODE</label>
            <input
              type="text"
              value={settings.batchId}
              onChange={(e) => onChangeGroupBuy({ ...settings, batchId: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">BATCH CAMPAIGN NAME</label>
            <input
              type="text"
              value={settings.batchName}
              onChange={(e) => onChangeGroupBuy({ ...settings, batchName: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">BATCH STATUS</label>
            <select
              value={settings.batchStatus}
              onChange={(e) =>
                onChangeGroupBuy({
                  ...settings,
                  batchStatus: e.target.value as GroupBuyStoreSettings['batchStatus'],
                })
              }
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="Pre-Order">Pre-Order</option>
              <option value="Active Collection">Active Collection</option>
              <option value="In Production">In Production</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">BATCH VISIBILITY</label>
            <select
              value={settings.batchVisibility}
              onChange={(e) =>
                onChangeGroupBuy({
                  ...settings,
                  batchVisibility: e.target.value as GroupBuyStoreSettings['batchVisibility'],
                })
              }
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">CLOSING DATE</label>
            <input
              type="date"
              value={settings.closingDate}
              onChange={(e) => onChangeGroupBuy({ ...settings, closingDate: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>
        </div>
      </div>
    );
  }

  // OnHand Store Specific Form
  if (storeType === 'onhand') {
    const settings = onHandSettings || {
      inventoryQuantity: 250,
      lowStockThreshold: 30,
      dispatchTime: 'Same-Day Cold Dispatch (24H)',
      warehouseLocation: 'Vault Section A-3',
    };

    return (
      <div className="p-4 rounded-xl bg-slate-950/90 border border-[#00D9FF]/30 space-y-4 font-mono text-xs">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <Box className="w-4 h-4 text-[#00D9FF]" />
          <h4 className="text-sm font-bold text-[#00D9FF] uppercase tracking-tight">
            OnHand Ready Store Settings
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">IN-STOCK VAULT QUANTITY</label>
            <input
              type="number"
              min="0"
              value={settings.inventoryQuantity}
              onChange={(e) =>
                onChangeOnHand({
                  ...settings,
                  inventoryQuantity: e.target.value === '' ? 0 : isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10),
                })
              }
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-[#00D9FF] font-bold focus:outline-none focus:border-[#00D9FF]"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">LOW STOCK THRESHOLD</label>
            <input
              type="number"
              min="0"
              value={settings.lowStockThreshold}
              onChange={(e) =>
                onChangeOnHand({
                  ...settings,
                  lowStockThreshold: e.target.value === '' ? 0 : isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10),
                })
              }
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-amber-400 focus:outline-none focus:border-[#00D9FF]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">DISPATCH SPEED / SLA</label>
            <input
              type="text"
              value={settings.dispatchTime}
              onChange={(e) => onChangeOnHand({ ...settings, dispatchTime: e.target.value })}
              placeholder="e.g., Same-Day Cold Dispatch (24H)"
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-[#00D9FF]"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">WAREHOUSE VAULT LOCATION</label>
            <input
              type="text"
              value={settings.warehouseLocation || ''}
              onChange={(e) => onChangeOnHand({ ...settings, warehouseLocation: e.target.value })}
              placeholder="e.g., Vault Section A-3"
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-[#00D9FF]"
            />
          </div>
        </div>
      </div>
    );
  }

  // MOQ Store Specific Form
  if (storeType === 'moq') {
    const settings = moqSettings || {
      moqTarget: 100,
      currentProgress: 65,
      productionStatus: 'Collecting Orders',
      autoCloseWhenTargetReached: true,
      autoHideWhenStatusOrdered: true,
      estimatedProductionDate: '2026-08-25',
      qualityControlNotice: 'HPLC + Mass Spec COA provided with every batch tray',
    };

    const remainingOrders = Math.max(0, settings.moqTarget - (settings.currentProgress || 0));

    return (
      <div className="p-4 rounded-xl bg-slate-950/90 border border-[#FF2ED1]/30 space-y-4 font-mono text-xs">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <Factory className="w-4 h-4 text-[#FF2ED1]" />
          <h4 className="text-sm font-bold text-[#FF2ED1] uppercase tracking-tight">
            MOQ Store Settings
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">TARGET KITS</label>
            <input
              type="number"
              value={settings.moqTarget}
              onChange={(e) => onChangeMoq({ ...settings, moqTarget: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-[#FF2ED1] font-bold focus:outline-none focus:border-[#FF2ED1]"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">CURRENT KITS (AUTOMATIC)</label>
            <input
              type="number"
              value={settings.currentProgress}
              onChange={(e) => onChangeMoq({ ...settings, currentProgress: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-[#FF2ED1]"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">REMAINING KITS (AUTOMATIC)</label>
            <input
              type="number"
              value={remainingOrders}
              readOnly
              disabled
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900/50 border border-white/5 text-slate-400 font-bold focus:outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">PRODUCT STATUS</label>
            <select
              value={settings.productionStatus}
              onChange={(e) =>
                onChangeMoq({
                  ...settings,
                  productionStatus: e.target.value as MoqStoreSettings['productionStatus'],
                })
              }
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-[#FF2ED1]"
            >
              <option value="Collecting Orders">Collecting Orders</option>
              <option value="Ready To Order">Ready To Order</option>
              <option value="Ordered">Ordered (Hide From Store)</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="In Transit">In Transit</option>
              <option value="Received">Received</option>
              <option value="Ready To Ship">Ready To Ship</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Automatic Options */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">AUTOMATIC OPTIONS</span>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={settings.autoCloseWhenTargetReached ?? true}
                onChange={(e) => onChangeMoq({ ...settings, autoCloseWhenTargetReached: e.target.checked })}
                className="rounded bg-slate-900 border-white/20 text-[#FF2ED1] focus:ring-[#FF2ED1]"
              />
              <span>Auto Close When Target Reached</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={settings.autoHideWhenStatusOrdered ?? true}
                onChange={(e) => onChangeMoq({ ...settings, autoHideWhenStatusOrdered: e.target.checked })}
                className="rounded bg-slate-900 border-white/20 text-[#FF2ED1] focus:ring-[#FF2ED1]"
              />
              <span>Auto Hide When Status Becomes ORDERED</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
