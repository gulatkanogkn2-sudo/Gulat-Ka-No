import React, { useState } from 'react';
import { CalculatorLayout } from '../../../components/research/CalculatorLayout';
import { Repeat } from 'lucide-react';

export const CycleCalcPage: React.FC = () => {
  // Input states as strings for natural typing & complete erasure
  const [dailyDoseMcgStr, setDailyDoseMcgStr] = useState<string>('250');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(7);
  const [weeksDurationStr, setWeeksDurationStr] = useState<string>('8');
  const [vialMgStr, setVialMgStr] = useState<string>('5');
  const [diluentPerVialMlStr, setDiluentPerVialMlStr] = useState<string>('2');

  // Parsed numbers
  const dailyDoseMcg = parseFloat(dailyDoseMcgStr) || 0;
  const weeksDuration = parseInt(weeksDurationStr, 10) || 0;
  const vialMg = parseFloat(vialMgStr) || 0;
  const diluentPerVialMl = parseFloat(diluentPerVialMlStr) || 0;

  // Calculations:
  const totalAdministrations = daysPerWeek * weeksDuration;
  const totalMcgNeeded = dailyDoseMcg * totalAdministrations;
  const totalMgNeeded = totalMcgNeeded / 1000;

  const vialsRequired = vialMg > 0 ? Math.ceil(totalMgNeeded / vialMg) : 0;
  const totalBacWaterMl = vialsRequired * diluentPerVialMl;

  const totalMgAvailable = vialsRequired * vialMg;
  const residualMg = totalMgAvailable - totalMgNeeded;

  const handleReset = () => {
    setDailyDoseMcgStr('250');
    setDaysPerWeek(7);
    setWeeksDurationStr('8');
    setVialMgStr('5');
    setDiluentPerVialMlStr('2');
  };

  return (
    <CalculatorLayout
      title="Peptide Cycle Calculator"
      description="Calculate multi-week research cycle schedules, total peptide mass requirements, vial counts, and diluent needs."
      badgeText="CYCLE & SCHEDULE MATRIX"
      badgeVariant="cyan"
      icon={Repeat}
      onReset={handleReset}
      inputs={
        <div className="space-y-6">
          {/* Dose per Administration */}
          <div className="space-y-2 p-4 rounded-xl bg-black/40 border border-white/10">
            <label className="text-xs font-bold text-white uppercase tracking-wider font-mono flex justify-between">
              <span>Dose Per Administration (mcg)</span>
              <span className="text-[#00D9FF]">{dailyDoseMcg} mcg</span>
            </label>
            <input
              type="number"
              value={dailyDoseMcgStr}
              onChange={(e) => setDailyDoseMcgStr(e.target.value)}
              placeholder="e.g. 250"
              className="w-full px-4 py-3 bg-black/80 border border-white/20 rounded-xl text-sm font-mono text-white font-bold focus:outline-none focus:border-[#00D9FF] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Days per week */}
          <div className="space-y-2 p-4 rounded-xl bg-black/40 border border-white/10 font-mono">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Administration Days Per Week
            </label>
            <div className="grid grid-cols-7 gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDaysPerWeek(d)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    daysPerWeek === d
                      ? 'bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.3)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {/* Cycle Duration */}
          <div className="space-y-2 p-4 rounded-xl bg-black/40 border border-white/10">
            <label className="text-xs font-bold text-white uppercase tracking-wider font-mono flex justify-between">
              <span>Cycle Duration (Weeks)</span>
              <span className="text-[#00D9FF]">{weeksDuration} Weeks</span>
            </label>
            <input
              type="number"
              value={weeksDurationStr}
              onChange={(e) => setWeeksDurationStr(e.target.value)}
              placeholder="e.g. 8"
              className="w-full px-4 py-3 bg-black/80 border border-white/20 rounded-xl text-sm font-mono text-white font-bold focus:outline-none focus:border-[#00D9FF] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Vial mg & Diluent mL */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 p-4 rounded-xl bg-black/40 border border-white/10 font-mono">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                Vial Size (mg)
              </label>
              <input
                type="number"
                value={vialMgStr}
                onChange={(e) => setVialMgStr(e.target.value)}
                placeholder="e.g. 5"
                className="w-full px-4 py-3 bg-black/80 border border-white/20 rounded-xl text-sm font-mono text-white font-bold focus:outline-none focus:border-[#00D9FF] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="space-y-2 p-4 rounded-xl bg-black/40 border border-white/10 font-mono">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                BAC Water / Vial (mL)
              </label>
              <input
                type="number"
                value={diluentPerVialMlStr}
                onChange={(e) => setDiluentPerVialMlStr(e.target.value)}
                placeholder="e.g. 2"
                className="w-full px-4 py-3 bg-black/80 border border-white/20 rounded-xl text-sm font-mono text-white font-bold focus:outline-none focus:border-[#00D9FF] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-[#050810] border border-[#00D9FF]/40 text-center space-y-2 shadow-[0_0_30px_rgba(0,217,255,0.15)]">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block">
              Required Research Vials
            </span>
            <div className="text-5xl font-black font-mono text-[#00D9FF] drop-shadow-[0_0_15px_rgba(0,217,255,0.6)]">
              {vialsRequired} <span className="text-xl text-slate-300 font-sans font-semibold">VIALS</span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              ({vialMg} mg per vial • Total {totalMgNeeded.toFixed(2)} mg required)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-slate-400 block text-[10px]">TOTAL ADMINISTRATIONS</span>
              <p className="text-base font-bold text-white">{totalAdministrations} Doses</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-slate-400 block text-[10px]">TOTAL BAC WATER NEEDED</span>
              <p className="text-base font-bold text-white">{totalBacWaterMl} mL</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-slate-400 block text-[10px]">TOTAL PEPTIDE CONTENT</span>
              <p className="text-base font-bold text-[#00D9FF]">{totalMgNeeded.toFixed(2)} mg</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-slate-400 block text-[10px]">RESIDUAL UNUSED MG</span>
              <p className="text-base font-bold text-slate-200">{residualMg.toFixed(2)} mg</p>
            </div>
          </div>
        </div>
      }
    />
  );
};
