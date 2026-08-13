import React, { useState } from 'react';
import {
  X,
  Settings,
  Calendar,
  Clock,
  Check,
  Shield,
  Layers,
  Package,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Globe,
} from 'lucide-react';
import {
  StoreConfig,
  ScheduleMode,
  ScheduleOverride,
  DayOfWeek,
  SpecificDateRange,
} from '../../../types/systemSettings';
import { getEffectiveStoreStatus } from '../../../utils/storeStatusUtils';

interface StoreSettingsEditorModalProps {
  isOpen: boolean;
  store: StoreConfig | null;
  onClose: () => void;
  onSave: (updatedStore: StoreConfig) => void;
}

export const StoreSettingsEditorModal: React.FC<StoreSettingsEditorModalProps> = ({
  isOpen,
  store,
  onClose,
  onSave,
}) => {
  if (!isOpen || !store) return null;

  // Local Editable State
  const [name, setName] = useState(store.name);
  const [code, setCode] = useState(store.code || store.key.toUpperCase());
  const [description, setDescription] = useState(store.description || '');
  const [status, setStatus] = useState<'Active' | 'Inactive'>(store.status || (store.enabled ? 'Active' : 'Inactive'));
  const [visibility, setVisibility] = useState(store.visibility || 'public');
  const [order, setOrder] = useState(store.order || 1);
  const [accentColor, setAccentColor] = useState(store.accentColor || '#00D9FF');
  const [notes, setNotes] = useState(store.notes || '');

  // Capabilities
  const [capabilities, setCapabilities] = useState(
    store.capabilities || {
      openCloseControl: true,
      inventoryManagement: false,
      variantInventory: false,
    }
  );

  // Availability Settings
  const [avail, setAvail] = useState(
    store.availability || {
      openCloseControlEnabled: store.capabilities?.openCloseControl ?? true,
      manualStatus: 'OPEN',
      scheduleMode: 'manual',
      override: 'NONE',
      timezone: 'Asia/Manila',
      weeklySchedule: {
        monday: { enabled: true, openTime: '09:00', closeTime: '18:00' },
        tuesday: { enabled: true, openTime: '09:00', closeTime: '18:00' },
        wednesday: { enabled: true, openTime: '09:00', closeTime: '18:00' },
        thursday: { enabled: true, openTime: '09:00', closeTime: '18:00' },
        friday: { enabled: true, openTime: '09:00', closeTime: '18:00' },
        saturday: { enabled: false, openTime: '09:00', closeTime: '18:00' },
        sunday: { enabled: false, openTime: '09:00', closeTime: '18:00' },
      },
      specificDays: {
        days: ['monday', 'wednesday', 'friday'],
        openTime: '09:00',
        closeTime: '18:00',
      },
      specificDateRanges: [],
    }
  );

  // Construct draft object to evaluate status in real time
  const currentDraftStore: StoreConfig = {
    ...store,
    name,
    code,
    description,
    status,
    enabled: status === 'Active',
    visibility,
    order,
    accentColor,
    notes,
    capabilities,
    availability: avail,
  };

  const calculatedStatus = getEffectiveStoreStatus(currentDraftStore);

  const handleSave = () => {
    onSave(currentDraftStore);
    onClose();
  };

  const DAYS: { key: DayOfWeek; label: string }[] = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  const handleAddDateRange = () => {
    const newRange: SpecificDateRange = {
      id: `range-${Date.now()}`,
      startDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endDate: new Date().toISOString().split('T')[0],
      endTime: '18:00',
      label: 'Batch Schedule Window',
    };
    setAvail({
      ...avail,
      specificDateRanges: [...(avail.specificDateRanges || []), newRange],
    });
  };

  const handleRemoveDateRange = (id: string) => {
    setAvail({
      ...avail,
      specificDateRanges: (avail.specificDateRanges || []).filter((r) => r.id !== id),
    });
  };

  const handleUpdateDateRange = (id: string, field: keyof SpecificDateRange, val: string) => {
    setAvail({
      ...avail,
      specificDateRanges: (avail.specificDateRanges || []).map((r) =>
        r.id === id ? { ...r, [field]: val } : r
      ),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-[#090D16] border border-[#00D9FF]/30 rounded-2xl shadow-[0_0_60px_rgba(0,217,255,0.15)] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-mono font-bold border"
              style={{
                backgroundColor: `${accentColor}20`,
                borderColor: `${accentColor}50`,
                color: accentColor,
              }}
            >
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide uppercase font-mono">
                  {name}
                </h2>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border"
                  style={{
                    backgroundColor: `${accentColor}15`,
                    color: accentColor,
                    borderColor: `${accentColor}40`,
                  }}
                >
                  {code}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configure operational parameters, feature capabilities, and scheduling engine.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-8 max-h-[75vh] overflow-y-auto">
          {/* SECTION 1: STORE INFORMATION */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-[#00D9FF] tracking-wider uppercase border-b border-slate-800 pb-2">
              1. STORE INFORMATION & METADATA
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  STORE DISPLAY TITLE *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  STORE CODE *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full h-10 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  STORE ACCENT COLOR
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer p-1"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 h-10 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-[#00D9FF]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  STORE STATUS
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-10 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D9FF]"
                >
                  <option value="Active">Active (Enabled)</option>
                  <option value="Inactive">Inactive (Disabled)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  VISIBILITY & ACCESS
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-full h-10 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D9FF]"
                >
                  <option value="public">Public (All Customers)</option>
                  <option value="private">Private (Logged-In Accounts)</option>
                  <option value="vip_only">VIP / Wholesale Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  TAB SORT POSITION
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                  className="w-full h-10 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D9FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                INTERNAL ADMINISTRATIVE NOTES
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Operational notes visible to administrators..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D9FF] resize-none"
              />
            </div>
          </div>

          {/* SECTION 2: STORE CAPABILITIES */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-[#00D9FF] tracking-wider uppercase border-b border-slate-800 pb-2">
              2. STORE CAPABILITY CONFIGURATION
            </h3>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              {/* Capability 1 */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                      STORE OPEN / CLOSE CONTROL
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400">
                      Activates the scheduling engine and open/close status logic.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !capabilities.openCloseControl;
                    setCapabilities({ ...capabilities, openCloseControl: nextVal });
                    setAvail({ ...avail, openCloseControlEnabled: nextVal });
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                    capabilities.openCloseControl ? 'bg-[#00D9FF]' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      capabilities.openCloseControl ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Capability 2 */}
              <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                      INVENTORY MANAGEMENT
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400">
                      Controls whether product stock quantities are tracked. (If OFF, inventory fields are hidden on product forms).
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !capabilities.inventoryManagement;
                    setCapabilities({
                      ...capabilities,
                      inventoryManagement: nextVal,
                      variantInventory: nextVal ? capabilities.variantInventory : false,
                    });
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                    capabilities.inventoryManagement ? 'bg-purple-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      capabilities.inventoryManagement ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Capability 3 */}
              <div
                className={`flex items-center justify-between gap-4 pt-3 border-t border-slate-800 transition-opacity ${
                  capabilities.inventoryManagement ? 'opacity-100' : 'opacity-40 pointer-events-none'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                      VARIANT INVENTORY
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400">
                      Controls whether stock is tracked individually per variant strength.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!capabilities.inventoryManagement}
                  onClick={() =>
                    setCapabilities({
                      ...capabilities,
                      variantInventory: !capabilities.variantInventory,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                    capabilities.variantInventory ? 'bg-pink-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      capabilities.variantInventory ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 3: STORE AVAILABILITY & SCHEDULING SYSTEM */}
          {capabilities.openCloseControl && (
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold text-[#00D9FF] tracking-wider uppercase border-b border-slate-800 pb-2">
                3. STORE AVAILABILITY & SCHEDULING ENGINE
              </h3>

              {/* Calculated Effective Realtime Status Banner */}
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                  calculatedStatus.isOpen
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.1)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {calculatedStatus.isOpen ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm uppercase">
                        EFFECTIVE STATUS: {calculatedStatus.statusLabel}
                      </span>
                    </div>
                    <p className="text-xs opacity-90 mt-0.5">{calculatedStatus.reason}</p>
                    {calculatedStatus.nextScheduleText && (
                      <p className="text-[11px] font-mono opacity-75 mt-0.5">
                        {calculatedStatus.nextScheduleText}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase opacity-70">OVERRIDE:</span>
                  <select
                    value={avail.override}
                    onChange={(e) =>
                      setAvail({ ...avail, override: e.target.value as ScheduleOverride })
                    }
                    className="h-8 px-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none"
                  >
                    <option value="NONE">None (Follow Schedule)</option>
                    <option value="TEMPORARY_OPEN">Force OPEN (Override)</option>
                    <option value="TEMPORARY_CLOSED">Force CLOSED (Override)</option>
                  </select>
                </div>
              </div>

              {/* Timezone and Schedule Mode Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#00D9FF]" />
                    <span>STORE TIMEZONE</span>
                  </label>
                  <select
                    value={avail.timezone || 'Asia/Manila'}
                    onChange={(e) => setAvail({ ...avail, timezone: e.target.value })}
                    className="w-full h-10 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D9FF]"
                  >
                    <option value="Asia/Manila">Asia/Manila (GMT+8 - GKN Default)</option>
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="America/New_York">America/New_York (Eastern Time)</option>
                    <option value="Europe/London">Europe/London (GMT/BST)</option>
                    <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#00D9FF]" />
                    <span>SCHEDULE MODE</span>
                  </label>
                  <select
                    value={avail.scheduleMode}
                    onChange={(e) =>
                      setAvail({ ...avail, scheduleMode: e.target.value as ScheduleMode })
                    }
                    className="w-full h-10 px-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D9FF]"
                  >
                    <option value="manual">Manual Control (Simple Toggle)</option>
                    <option value="weekly">Weekly Recurring Schedule</option>
                    <option value="specific_days">Specific Days of Week</option>
                    <option value="specific_dates">Specific Date / Date Ranges</option>
                  </select>
                </div>
              </div>

              {/* MODE CONFIGURATION UI */}
              {avail.scheduleMode === 'manual' && (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">MANUAL STORE STATUS</h4>
                    <p className="text-[11px] font-mono text-slate-400">
                      Direct manual open or close switch for {name}.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                        avail.manualStatus === 'OPEN'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {avail.manualStatus}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setAvail({
                          ...avail,
                          manualStatus: avail.manualStatus === 'OPEN' ? 'CLOSED' : 'OPEN',
                        })
                      }
                      className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 ${
                        avail.manualStatus === 'OPEN' ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                          avail.manualStatus === 'OPEN' ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {avail.scheduleMode === 'weekly' && (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide mb-2">
                    RECURRING WEEKLY SCHEDULE CONFIGURATION
                  </h4>
                  {DAYS.map((d) => {
                    const dayConf = avail.weeklySchedule?.[d.key] || {
                      enabled: false,
                      openTime: '09:00',
                      closeTime: '18:00',
                    };
                    return (
                      <div
                        key={d.key}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80"
                      >
                        <div className="flex items-center gap-3 w-32">
                          <button
                            type="button"
                            onClick={() => {
                              setAvail({
                                ...avail,
                                weeklySchedule: {
                                  ...avail.weeklySchedule,
                                  [d.key]: { ...dayConf, enabled: !dayConf.enabled },
                                },
                              });
                            }}
                            className={`w-8 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                              dayConf.enabled ? 'bg-[#00D9FF]' : 'bg-slate-800'
                            }`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full bg-slate-950 transition-transform ${
                                dayConf.enabled ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          <span
                            className={`text-xs font-semibold ${
                              dayConf.enabled ? 'text-white' : 'text-slate-500'
                            }`}
                          >
                            {d.label}
                          </span>
                        </div>

                        {dayConf.enabled ? (
                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="text-slate-400">OPEN:</span>
                            <input
                              type="time"
                              value={dayConf.openTime}
                              onChange={(e) =>
                                setAvail({
                                  ...avail,
                                  weeklySchedule: {
                                    ...avail.weeklySchedule,
                                    [d.key]: { ...dayConf, openTime: e.target.value },
                                  },
                                })
                              }
                              className="h-8 px-2 bg-slate-900 border border-slate-800 rounded text-white focus:outline-none focus:border-[#00D9FF]"
                            />
                            <span className="text-slate-400 ml-2">CLOSE:</span>
                            <input
                              type="time"
                              value={dayConf.closeTime}
                              onChange={(e) =>
                                setAvail({
                                  ...avail,
                                  weeklySchedule: {
                                    ...avail.weeklySchedule,
                                    [d.key]: { ...dayConf, closeTime: e.target.value },
                                  },
                                })
                              }
                              className="h-8 px-2 bg-slate-900 border border-slate-800 rounded text-white focus:outline-none focus:border-[#00D9FF]"
                            />
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-slate-500 italic">
                            Closed All Day
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {avail.scheduleMode === 'specific_days' && (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                    SELECT ACTIVE DAYS OF WEEK & OPERATIONAL HOURS
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((d) => {
                      const isSelected = avail.specificDays?.days?.includes(d.key);
                      return (
                        <button
                          type="button"
                          key={d.key}
                          onClick={() => {
                            const currentDays = avail.specificDays?.days || [];
                            const nextDays = isSelected
                              ? currentDays.filter((x) => x !== d.key)
                              : [...currentDays, d.key];
                            setAvail({
                              ...avail,
                              specificDays: { ...avail.specificDays, days: nextDays },
                            });
                          }}
                          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-[#00D9FF] text-black shadow-[0_0_10px_rgba(0,217,255,0.3)]'
                              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {d.label.slice(0, 3).toUpperCase()}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-4 pt-2 border-t border-slate-800/80">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        OPEN TIME
                      </label>
                      <input
                        type="time"
                        value={avail.specificDays?.openTime || '09:00'}
                        onChange={(e) =>
                          setAvail({
                            ...avail,
                            specificDays: { ...avail.specificDays, openTime: e.target.value },
                          })
                        }
                        className="h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-[#00D9FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        CLOSE TIME
                      </label>
                      <input
                        type="time"
                        value={avail.specificDays?.closeTime || '18:00'}
                        onChange={(e) =>
                          setAvail({
                            ...avail,
                            specificDays: { ...avail.specificDays, closeTime: e.target.value },
                          })
                        }
                        className="h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-[#00D9FF]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {avail.scheduleMode === 'specific_dates' && (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                      SCHEDULED DATE WINDOWS (BATCH OPENINGS)
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddDateRange}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] font-mono text-xs font-bold hover:bg-[#00D9FF]/20 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD DATE RANGE</span>
                    </button>
                  </div>

                  {(avail.specificDateRanges || []).length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs font-mono">
                      No specific date ranges configured. Click 'ADD DATE RANGE' to define batch opening windows.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {avail.specificDateRanges.map((r, idx) => (
                        <div
                          key={r.id}
                          className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#00D9FF]">
                              WINDOW #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveDateRange(r.id)}
                              className="text-rose-400 hover:text-rose-300 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] font-mono text-slate-400 mb-1">
                                LABEL
                              </label>
                              <input
                                type="text"
                                value={r.label || ''}
                                onChange={(e) => handleUpdateDateRange(r.id, 'label', e.target.value)}
                                placeholder="Batch #1 Opening"
                                className="w-full h-8 px-2.5 bg-slate-900 border border-slate-800 rounded text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-slate-400 mb-1">
                                START DATE & TIME
                              </label>
                              <div className="flex gap-1">
                                <input
                                  type="date"
                                  value={r.startDate}
                                  onChange={(e) =>
                                    handleUpdateDateRange(r.id, 'startDate', e.target.value)
                                  }
                                  className="w-full h-8 px-2 bg-slate-900 border border-slate-800 rounded text-xs text-white font-mono focus:outline-none"
                                />
                                <input
                                  type="time"
                                  value={r.startTime}
                                  onChange={(e) =>
                                    handleUpdateDateRange(r.id, 'startTime', e.target.value)
                                  }
                                  className="w-20 h-8 px-1 bg-slate-900 border border-slate-800 rounded text-xs text-white font-mono focus:outline-none"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-slate-400 mb-1">
                                END DATE & TIME
                              </label>
                              <div className="flex gap-1">
                                <input
                                  type="date"
                                  value={r.endDate}
                                  onChange={(e) =>
                                    handleUpdateDateRange(r.id, 'endDate', e.target.value)
                                  }
                                  className="w-full h-8 px-2 bg-slate-900 border border-slate-800 rounded text-xs text-white font-mono focus:outline-none"
                                />
                                <input
                                  type="time"
                                  value={r.endTime}
                                  onChange={(e) =>
                                    handleUpdateDateRange(r.id, 'endTime', e.target.value)
                                  }
                                  className="w-20 h-8 px-1 bg-slate-900 border border-slate-800 rounded text-xs text-white font-mono focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800/80 bg-slate-900/40">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-black font-extrabold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,217,255,0.3)]"
          >
            <Check className="w-4 h-4" />
            <span>SAVE STORE SETTINGS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
