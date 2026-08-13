import React, { useState, useEffect } from 'react';
import {
  TimelineConfigService,
  TimelineStageConfig,
  StoreTypeKey,
} from '../../../../services/timelineConfigService';
import { SettingCard } from '../common/SettingCard';
import { Button } from '../../../common/Button';
import { Badge } from '../../../common/Badge';
import { ConfirmModal } from '../../../common/ConfirmModal';
import {
  Layers,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  RotateCcw,
  Save,
  Check,
  Edit2,
  Eye,
  EyeOff,
  Clock,
  Box,
  Truck,
  PackageCheck,
  CheckCircle2,
} from 'lucide-react';

export const OrderTimelineSettingsTab: React.FC = () => {
  const [selectedStore, setSelectedStore] = useState<StoreTypeKey>('groupbuy');
  const [stages, setStages] = useState<TimelineStageConfig[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // New stage form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newStageDesc, setNewStageDesc] = useState('');

  // Load configuration whenever selected store changes
  useEffect(() => {
    const loaded = TimelineConfigService.getTimelineConfigForStore(selectedStore);
    setStages(loaded);
    setIsSaved(false);
    setEditingStageId(null);
  }, [selectedStore]);

  const handleSave = () => {
    // Re-index display orders
    const normalized = stages.map((s, idx) => ({
      ...s,
      displayOrder: idx + 1,
    }));
    TimelineConfigService.saveTimelineConfigForStore(selectedStore, normalized);
    setStages(normalized);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    setIsResetConfirmOpen(true);
  };

  const confirmReset = () => {
    const resetStages = TimelineConfigService.resetTimelineConfigForStore(selectedStore);
    setStages(resetStages);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    setIsResetConfirmOpen(false);
  };

  const handleToggleEnable = (id: string) => {
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setStages((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === stages.length - 1) return;
    setStages((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleDelete = (id: string) => {
    if (stages.length <= 2) {
      alert('Timeline must contain at least 2 stages.');
      return;
    }
    setStages((prev) => prev.filter((s) => s.id !== id));
  };

  const handleFieldChange = (id: string, field: 'displayName' | 'description', value: string) => {
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;

    const newStage: TimelineStageConfig = {
      id: `custom_${Date.now()}`,
      displayName: newStageName.trim(),
      description: newStageDesc.trim() || 'Custom timeline stage.',
      displayOrder: stages.length + 1,
      enabled: true,
      associatedStatus: 'PROCESSING',
    };

    setStages((prev) => [...prev, newStage]);
    setNewStageName('');
    setNewStageDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Store Type Selector */}
      <SettingCard
        title="Store-Specific Order Timeline Configuration"
        description="Customize, reorder, and toggle order stages individually for GroupBuy, OnHand, and MOQ stores."
        icon={<Layers size={18} className="text-[#00D9FF]" />}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setSelectedStore('groupbuy')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedStore === 'groupbuy'
                  ? 'bg-[#00D9FF] text-black shadow-[0_0_15px_rgba(0,217,255,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              GroupBuy Store
            </button>
            <button
              type="button"
              onClick={() => setSelectedStore('onhand')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedStore === 'onhand'
                  ? 'bg-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              OnHand Store
            </button>
            <button
              type="button"
              onClick={() => setSelectedStore('moq')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedStore === 'moq'
                  ? 'bg-[#FF2ED1] text-white shadow-[0_0_15px_rgba(255,46,209,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              MOQ Store
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs text-slate-400 border-white/10 hover:border-white/30"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Defaults
            </Button>

            <Button
              variant="cyan"
              size="sm"
              onClick={handleSave}
              className="text-xs font-bold"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-black" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-1" />
                  Save Timeline
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stage List Controls */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {selectedStore.toUpperCase()} Stages ({stages.length} Total)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="text-xs border-[#00D9FF]/40 text-[#00D9FF] hover:bg-[#00D9FF]/10"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Custom Stage
            </Button>
          </div>

          <div className="space-y-3">
            {stages.map((stage, idx) => {
              const isEditing = editingStageId === stage.id;

              return (
                <div
                  key={stage.id}
                  className={`p-4 rounded-xl border transition-all ${
                    stage.enabled
                      ? 'bg-black/60 border-white/10 hover:border-[#00D9FF]/30'
                      : 'bg-black/30 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    {/* Left: Stage Order & Enable Toggle & Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(idx)}
                          disabled={idx === 0}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-20 cursor-pointer"
                          title="Move Stage Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(idx)}
                          disabled={idx === stages.length - 1}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-20 cursor-pointer"
                          title="Move Stage Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="w-6 h-6 rounded-full bg-white/10 text-slate-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>

                      {/* Stage Title and Description Edit */}
                      <div className="flex-1 space-y-1">
                        {isEditing ? (
                          <div className="space-y-2 max-w-md">
                            <div>
                              <label className="text-[10px] font-bold text-cyan-400 block mb-0.5">Stage Display Title</label>
                              <input
                                type="text"
                                value={stage.displayName}
                                onChange={(e) => handleFieldChange(stage.id, 'displayName', e.target.value)}
                                className="w-full px-2.5 py-1 bg-black border border-[#00D9FF] rounded text-xs text-white"
                                placeholder="Stage Title"
                              />
                              <span className="text-[10px] text-slate-500 block mt-0.5">Example: Dispatch & Waybill Assigned</span>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Customer Status Guidance</label>
                              <input
                                type="text"
                                value={stage.description || ''}
                                onChange={(e) => handleFieldChange(stage.id, 'description', e.target.value)}
                                className="w-full px-2.5 py-1 bg-black border border-white/20 rounded text-xs text-slate-300"
                                placeholder="Stage Description"
                              />
                              <span className="text-[10px] text-slate-500 block mt-0.5">Example: Package handed over to local courier with live waybill tracking.</span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">
                                {stage.displayName}
                              </span>
                              {!stage.enabled && (
                                <Badge variant="default" className="text-[9px] px-1.5 py-0">
                                  Disabled
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {stage.description || 'No description set.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button
                        type="button"
                        onClick={() => setEditingStageId(isEditing ? null : stage.id)}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#00D9FF]" />
                        <span>{isEditing ? 'Done' : 'Rename'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleEnable(stage.id)}
                        className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                          stage.enabled
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                            : 'bg-white/5 text-slate-500 border border-white/10'
                        }`}
                        title={stage.enabled ? 'Disable stage' : 'Enable stage'}
                      >
                        {stage.enabled ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Enabled</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(stage.id)}
                        className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                        title="Delete Stage"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SettingCard>

      {/* Add Stage Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#090D16] border border-[#00D9FF]/40 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-[0_0_30px_rgba(0,217,255,0.2)]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#00D9FF]" />
              Add Timeline Stage for {selectedStore.toUpperCase()}
            </h3>

            <form onSubmit={handleAddStage} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 block">Stage Title *</label>
                <input
                  type="text"
                  required
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  placeholder="e.g. Courier Pickup Scheduled"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 block">Stage Description</label>
                <input
                  type="text"
                  value={newStageDesc}
                  onChange={(e) => setNewStageDesc(e.target.value)}
                  placeholder="e.g. Package collected by courier logistics."
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                  className="text-xs border-white/20 text-slate-300"
                >
                  Cancel
                </Button>

                <Button type="submit" variant="cyan" size="sm" className="text-xs font-bold">
                  Add Stage
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={confirmReset}
        title="Reset Timeline Stages"
        message={`Are you sure you want to reset the ${selectedStore.toUpperCase()} timeline stages to default configuration? Custom changes will be overwritten.`}
        confirmText="Reset Timeline"
        cancelText="Cancel"
        variant="warning"
      />
    </div>
  );
};
