import React, { useState } from 'react';
import {
  Package,
  CheckSquare,
  Square,
  ThermometerSnowflake,
  ShieldAlert,
  ShieldCheck,
  Printer,
  Scale,
  Box,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { PackingWorkspaceData, PackingChecklistItem } from '../../../types/shipping';

interface PackingWorkspacePanelProps {
  packingData: PackingWorkspaceData;
  onUpdatePacking: (updated: Partial<PackingWorkspaceData>) => void;
  onOpenLabelModal?: () => void;
  onOpenPackingSlipModal?: () => void;
  readOnly?: boolean;
}

export const PackingWorkspacePanel: React.FC<PackingWorkspacePanelProps> = ({
  packingData,
  onUpdatePacking,
  onOpenLabelModal,
  onOpenPackingSlipModal,
  readOnly = false,
}) => {
  const [checklist, setChecklist] = useState<PackingChecklistItem[]>(packingData.checklist || []);

  const handleToggleItem = (id: string) => {
    if (readOnly) return;
    const updatedChecklist = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updatedChecklist);
    onUpdatePacking({ checklist: updatedChecklist });
  };

  const allChecklistCompleted = checklist.length > 0 && checklist.every((c) => c.completed);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4 backdrop-blur-md">
      {/* Workspace Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Cleanroom Packing Workspace
              {packingData.packingCompleted ? (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> COMPLETED
                </span>
              ) : (
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                  IN PROGRESS
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Assigned Packer: {packingData.packerName || 'Unassigned Tech'}
            </p>
          </div>
        </div>

        {/* Print Buttons */}
        <div className="flex items-center gap-2">
          {onOpenPackingSlipModal && (
            <button
              onClick={onOpenPackingSlipModal}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" /> Print Packing Slip
            </button>
          )}
          {onOpenLabelModal && (
            <button
              onClick={onOpenLabelModal}
              className="px-2.5 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 rounded-lg text-xs font-medium border border-cyan-800/80 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" /> Shipping Label
            </button>
          )}
        </div>
      </div>

      {/* Packaging & Dispatch Protection Specifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Insulated Foil Barrier Toggle */}
        <div
          onClick={() =>
            !readOnly && onUpdatePacking({ coldChainRequired: !packingData.coldChainRequired })
          }
          className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
            packingData.coldChainRequired
              ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
              : 'bg-slate-950/50 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck
              className={`w-4 h-4 ${packingData.coldChainRequired ? 'text-cyan-400' : 'text-slate-500'}`}
            />
            <span className="text-xs font-medium">Insulated Foil Sleeve</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              packingData.coldChainRequired ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {packingData.coldChainRequired ? 'APPLIED' : 'STANDARD'}
          </span>
        </div>

        {/* Ice Pack Required */}
        <div
          onClick={() => !readOnly && onUpdatePacking({ icePackRequired: !packingData.icePackRequired })}
          className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
            packingData.icePackRequired
              ? 'bg-blue-950/40 border-blue-500/40 text-blue-200'
              : 'bg-slate-950/50 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <ThermometerSnowflake
              className={`w-4 h-4 ${packingData.icePackRequired ? 'text-blue-400' : 'text-slate-500'}`}
            />
            <span className="text-xs font-medium">Ice Pack Shield</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              packingData.icePackRequired ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {packingData.icePackRequired ? 'LOADED' : 'OFF'}
          </span>
        </div>

        {/* Thermal Packaging */}
        <div
          onClick={() =>
            !readOnly && onUpdatePacking({ thermalPackaging: !packingData.thermalPackaging })
          }
          className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
            packingData.thermalPackaging
              ? 'bg-purple-950/40 border-purple-500/40 text-purple-200'
              : 'bg-slate-950/50 border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldAlert
              className={`w-4 h-4 ${packingData.thermalPackaging ? 'text-purple-400' : 'text-slate-500'}`}
            />
            <span className="text-xs font-medium">Thermal Liner</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              packingData.thermalPackaging
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {packingData.thermalPackaging ? 'VERIFIED' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Box Specs: Weight & Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-cyan-400" /> Package Weight (kg)
          </label>
          <input
            type="number"
            step="0.05"
            disabled={readOnly}
            value={packingData.packageWeightKg}
            onChange={(e) =>
              onUpdatePacking({ packageWeightKg: parseFloat(e.target.value) || 0 })
            }
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <Box className="w-3.5 h-3.5 text-cyan-400" /> Box Size & Liner Spec
          </label>
          <input
            type="text"
            disabled={readOnly}
            value={packingData.boxSizeDimensions}
            onChange={(e) => onUpdatePacking({ boxSizeDimensions: e.target.value })}
            placeholder="e.g. 25x20x15 cm Cryo Box"
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Interactive Cleanroom Packing Checklist */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-purple-400" /> Packing Inspection Checklist
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">
            {checklist.filter((c) => c.completed).length} / {checklist.length} Verified
          </span>
        </div>

        <div className="space-y-1.5">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleItem(item.id)}
              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                item.completed
                  ? 'bg-purple-950/20 border-purple-500/30 text-slate-200'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.completed ? (
                  <CheckSquare className="w-4 h-4 text-purple-400 flex-shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-600 flex-shrink-0" />
                )}
                <span className={item.completed ? 'line-through text-slate-400' : 'text-slate-200'}>
                  {item.label}
                </span>
              </div>
              {item.completed && (
                <span className="text-[10px] text-purple-400 font-mono">Verified</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Master Toggle: Packing Completed */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          {allChecklistCompleted
            ? 'All items checked. Ready to mark packing completed.'
            : 'Complete inspection checklist items above.'}
        </div>

        <button
          disabled={readOnly}
          onClick={() => onUpdatePacking({ packingCompleted: !packingData.packingCompleted })}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            packingData.packingCompleted
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {packingData.packingCompleted ? 'Packing Verified & Sealed' : 'Mark Packing Complete'}
        </button>
      </div>
    </div>
  );
};
