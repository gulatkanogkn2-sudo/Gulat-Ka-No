import React from 'react';
import { DeploymentCheckItem } from '../../../types/initialSetup';
import { CheckSquare, Square, CheckCircle, Clock, AlertTriangle, Layers, RotateCcw } from 'lucide-react';

export interface DeploymentChecklistCardProps {
  checklist: DeploymentCheckItem[];
  onToggleItem: (id: string, newStatus: DeploymentCheckItem['status']) => void;
  onResetChecklist?: () => void;
}

export const DeploymentChecklistCard: React.FC<DeploymentChecklistCardProps> = ({
  checklist,
  onToggleItem,
  onResetChecklist,
}) => {
  const completedCount = checklist.filter((item) => item.status === 'completed').length;
  const totalCount = checklist.length;
  const percentComplete = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="glass-card p-6 border border-white/10 rounded-2xl bg-[#0A0F1D]/90 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
            <Layers className="text-[#00D9FF]" size={18} />
            <span>Master Deployment Verification Checklist</span>
          </h3>
          <p className="text-xs text-slate-400">
            Mandatory module readiness indicators prior to live production activation
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {onResetChecklist && (
            <button
              onClick={onResetChecklist}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[11px] font-mono flex items-center space-x-1 border border-white/10 transition-colors cursor-pointer"
              title="Reset checklist items to defaults"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-[#00D9FF] block">
              {completedCount} / {totalCount} Modules Ready
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{percentComplete}% Complete</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#00D9FF] via-[#8B5CF6] to-emerald-400 transition-all duration-500"
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {checklist.map((item) => {
          const isDone = item.status === 'completed';

          return (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id, isDone ? 'pending' : 'completed')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                isDone
                  ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0 text-slate-300">
                {isDone ? (
                  <CheckSquare size={18} className="text-emerald-400" />
                ) : (
                  <Square size={18} className="text-slate-500" />
                )}
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4
                    className={`text-xs font-bold font-mono truncate ${
                      isDone ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                      isDone
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
