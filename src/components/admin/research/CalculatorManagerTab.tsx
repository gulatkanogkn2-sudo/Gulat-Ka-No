import React, { useState } from 'react';
import { ActionMenu } from '../../common/ActionMenu';
import { Calculator, ShieldAlert, Edit2, Check, Eye, EyeOff, Info, HelpCircle } from 'lucide-react';
import { CalculatorContentAdmin } from '../../../types/researchLibraryManager';

interface CalculatorManagerTabProps {
  calculators: CalculatorContentAdmin[];
  onSaveCalculator: (calc: CalculatorContentAdmin) => void;
}

export const CalculatorManagerTab: React.FC<CalculatorManagerTabProps> = ({
  calculators,
  onSaveCalculator,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CalculatorContentAdmin | null>(null);

  const handleStartEdit = (calc: CalculatorContentAdmin) => {
    setEditingId(calc.id);
    setEditForm(JSON.parse(JSON.stringify(calc))); // Deep clone
  };

  const handleSave = () => {
    if (!editForm) return;
    onSaveCalculator(editForm);
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <div className="space-y-4">
      {/* Notice Banner */}
      <div className="p-4 bg-amber-950/40 border border-amber-800/80 rounded-2xl flex items-start gap-3 text-amber-200 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Calculators Mathematical Formulas Are Locked</p>
          <p className="text-amber-300/80">
            To preserve analytical accuracy and user dosage safety, mathematical conversion formulas are immutable.
            You can customize titles, descriptions, default form values, unit labels, educational explanations, and visibility.
          </p>
        </div>
      </div>

      {/* Calculators Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {calculators.map((calc) => {
          const isEditing = editingId === calc.id;
          const current = isEditing ? editForm! : calc;

          return (
            <div
              key={calc.id}
              className={`p-5 bg-slate-900 border rounded-2xl transition-all ${
                isEditing ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-cyan-950 text-cyan-400 rounded-lg border border-cyan-800">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{current.title}</h3>
                    <p className="text-[10px] font-mono text-slate-400">Module ID: {current.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <ActionMenu
                    items={[
                      !isEditing
                        ? {
                            label: 'Edit Content',
                            icon: <Edit2 className="w-3.5 h-3.5 text-[#00D9FF]" />,
                            onClick: () => handleStartEdit(calc),
                          }
                        : {
                            label: 'Save Changes',
                            icon: <Check className="w-3.5 h-3.5 text-emerald-400" />,
                            variant: 'emerald',
                            onClick: () => handleSave(),
                          },
                      {
                        divider: true,
                        label: current.visibility === 'PUBLIC' ? 'Hide Calculator' : 'Make Public',
                        icon:
                          current.visibility === 'PUBLIC' ? (
                            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          ),
                        onClick: () => {
                          if (isEditing) {
                            setEditForm({
                              ...editForm!,
                              visibility: editForm!.visibility === 'PUBLIC' ? 'HIDDEN' : 'PUBLIC',
                            });
                          } else {
                            onSaveCalculator({
                              ...calc,
                              visibility: calc.visibility === 'PUBLIC' ? 'HIDDEN' : 'PUBLIC',
                            });
                          }
                        },
                      },
                    ]}
                  />
                </div>
              </div>

              {!isEditing ? (
                /* View Mode */
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Description:</span>
                    <p className="text-slate-200">{calc.description}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">Default Field Values:</span>
                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px]">
                      {Object.entries(calc.defaultValues).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-slate-400">{calc.unitLabels[k] || k}:</span>
                          <span className="text-cyan-300 font-bold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Educational Note:</span>
                    <p className="text-slate-300 italic bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                      {calc.educationalInfo}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">Help Text:</span>
                    <p className="text-slate-400">{calc.helpText}</p>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Calculator Title</label>
                    <input
                      type="text"
                      value={editForm!.title}
                      onChange={(e) => setEditForm({ ...editForm!, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editForm!.description}
                      onChange={(e) => setEditForm({ ...editForm!, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Default Values</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      {Object.entries(editForm!.defaultValues).map(([k, v]) => (
                        <div key={k} className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 block">{k}</label>
                          <input
                            type="text"
                            value={v}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm!,
                                defaultValues: {
                                  ...editForm!.defaultValues,
                                  [k]: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value),
                                },
                              })
                            }
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono text-cyan-300 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Educational Info</label>
                    <textarea
                      rows={2}
                      value={editForm!.educationalInfo}
                      onChange={(e) => setEditForm({ ...editForm!, educationalInfo: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Help Text</label>
                    <textarea
                      rows={2}
                      value={editForm!.helpText}
                      onChange={(e) => setEditForm({ ...editForm!, helpText: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" /> Save Calculator Content
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
