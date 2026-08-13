import React, { useState, useMemo } from 'react';
import { CalculatorLayout } from '../../../components/research/CalculatorLayout';
import { SyringeVisualization, SyringeType } from '../../../components/research/calculators/SyringeVisualization';
import { Calculator, RefreshCw, Zap, ShieldCheck, Check } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

export const PeptideCalcPage: React.FC = () => {
  // Unit Toggles: 'mg' | 'mcg'
  const [peptideUnit, setPeptideUnit] = useState<'mg' | 'mcg'>('mg');
  const [targetDoseUnit, setTargetDoseUnit] = useState<'mg' | 'mcg'>('mcg');

  // Input states stored as strings to allow natural typing & complete erasure
  const [peptideAmountStr, setPeptideAmountStr] = useState<string>('5');
  const [diluentMlStr, setDiluentMlStr] = useState<string>('2');
  const [targetDoseStr, setTargetDoseStr] = useState<string>('250');
  const [syringeType, setSyringeType] = useState<SyringeType>('u100-1ml');

  // Parsed numeric values for math
  const rawPeptideVal = parseFloat(peptideAmountStr) || 0;
  const rawDiluentVal = parseFloat(diluentMlStr) || 0;
  const rawTargetDoseVal = parseFloat(targetDoseStr) || 0;

  // Normalize all peptide amounts to mg and mcg for internal math
  const totalPeptideMg = peptideUnit === 'mg' ? rawPeptideVal : rawPeptideVal / 1000;
  const totalPeptideMcg = totalPeptideMg * 1000;

  const targetDoseMcg = targetDoseUnit === 'mcg' ? rawTargetDoseVal : rawTargetDoseVal * 1000;
  const targetDoseMg = targetDoseMcg / 1000;

  // Syringe scale math
  const scaleUnitsPerMl = syringeType === 'u40-1ml' ? 40 : 100;
  const maxSyringeUnits =
    syringeType === 'u100-0.5ml'
      ? 50
      : syringeType === 'u100-0.3ml'
      ? 30
      : syringeType === 'u40-1ml'
      ? 40
      : 100;

  // Concentrations
  const concentrationMcgPerMl = rawDiluentVal > 0 ? totalPeptideMcg / rawDiluentVal : 0;
  const concentrationMgPerMl = concentrationMcgPerMl / 1000;

  // Volume needed per dose in mL
  const requiredMl = concentrationMcgPerMl > 0 ? targetDoseMcg / concentrationMcgPerMl : 0;

  // Syringe pull units
  const calculatedUnits = requiredMl * scaleUnitsPerMl;
  const percentageFilled = Math.min(100, Math.max(0, (calculatedUnits / maxSyringeUnits) * 100));
  const totalDosesPerVial = targetDoseMcg > 0 ? Math.floor(totalPeptideMcg / targetDoseMcg) : 0;

  // Unit Toggle Handler for Peptide Amount in Vial
  const handlePeptideUnitToggle = (newUnit: 'mg' | 'mcg') => {
    if (newUnit === peptideUnit) return;
    setPeptideUnit(newUnit);
    if (rawPeptideVal > 0) {
      if (newUnit === 'mcg') {
        // mg -> mcg
        setPeptideAmountStr((rawPeptideVal * 1000).toString());
      } else {
        // mcg -> mg
        setPeptideAmountStr((rawPeptideVal / 1000).toString());
      }
    }
  };

  // Unit Toggle Handler for Target Dose
  const handleTargetDoseUnitToggle = (newUnit: 'mg' | 'mcg') => {
    if (newUnit === targetDoseUnit) return;
    setTargetDoseUnit(newUnit);
    if (rawTargetDoseVal > 0) {
      if (newUnit === 'mcg') {
        // mg -> mcg
        setTargetDoseStr((rawTargetDoseVal * 1000).toString());
      } else {
        // mcg -> mg
        setTargetDoseStr((rawTargetDoseVal / 1000).toString());
      }
    }
  };

  const handleReset = () => {
    setPeptideUnit('mg');
    setTargetDoseUnit('mcg');
    setPeptideAmountStr('5');
    setDiluentMlStr('2');
    setTargetDoseStr('250');
    setSyringeType('u100-1ml');
  };

  return (
    <CalculatorLayout
      title="Peptide Calculator"
      description="Integrated precision laboratory calculator for peptide reconstitution, solution concentrations, diluent ratios, and interactive syringe tick marks."
      badgeText="PRIMARY GKN CALCULATOR"
      badgeVariant="cyan"
      icon={Calculator}
      onReset={handleReset}
      inputs={
        <div className="space-y-6">
          {/* 1. PEPTIDE AMOUNT IN VIAL */}
          <div className="space-y-3 p-4 rounded-xl bg-black/40 border border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <span>1. Peptide Amount in Vial</span>
              </label>

              {/* Unit Toggle Switch (mg / mcg) */}
              <div className="flex items-center bg-white/5 p-1 rounded-lg border border-white/10 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handlePeptideUnitToggle('mg')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    peptideUnit === 'mg'
                      ? 'bg-[#00D9FF] text-black shadow-[0_0_10px_rgba(0,217,255,0.6)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  mg
                </button>
                <button
                  type="button"
                  onClick={() => handlePeptideUnitToggle('mcg')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    peptideUnit === 'mcg'
                      ? 'bg-[#00D9FF] text-black shadow-[0_0_10px_rgba(0,217,255,0.6)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  mcg
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-4 gap-2 font-mono">
              {[2, 5, 10, 15].map((val) => {
                const presetVal = peptideUnit === 'mg' ? val : val * 1000;
                const isSelected = rawPeptideVal === presetVal;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setPeptideAmountStr(presetVal.toString())}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.3)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {val} mg
                  </button>
                );
              })}
            </div>

            {/* Custom Input Field - Bigger, No Spinner Arrows */}
            <div className="relative">
              <input
                type="number"
                value={peptideAmountStr}
                onChange={(e) => setPeptideAmountStr(e.target.value)}
                placeholder="e.g. 5"
                className="w-full px-4 py-3 bg-black/80 border border-white/20 rounded-xl text-sm font-mono text-white font-bold focus:outline-none focus:border-[#00D9FF] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-[#00D9FF] font-bold">
                {peptideUnit}
              </span>
            </div>
          </div>

          {/* 2. DILUENT (BAC WATER) ADDED */}
          <div className="space-y-3 p-4 rounded-xl bg-black/40 border border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                2. Diluent (BAC Water) Volume
              </label>
              <span className="text-xs font-mono font-bold text-[#00D9FF]">
                {rawDiluentVal} mL
              </span>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-4 gap-2 font-mono">
              {[1, 2, 3, 5].map((ml) => {
                const isSelected = rawDiluentVal === ml;
                return (
                  <button
                    key={ml}
                    type="button"
                    onClick={() => setDiluentMlStr(ml.toString())}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.3)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ml} mL
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <div className="relative">
              <input
                type="number"
                value={diluentMlStr}
                onChange={(e) => setDiluentMlStr(e.target.value)}
                placeholder="e.g. 2"
                step="0.1"
                className="w-full px-4 py-3 bg-black/80 border border-white/20 rounded-xl text-sm font-mono text-white font-bold focus:outline-none focus:border-[#00D9FF] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-[#00D9FF] font-bold">
                mL
              </span>
            </div>
          </div>

          {/* 3. TARGET RESEARCH DOSE */}
          <div className="space-y-3 p-4 rounded-xl bg-black/40 border border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                3. Target Research Dose
              </label>

              {/* Unit Toggle Switch */}
              <div className="flex items-center bg-white/5 p-1 rounded-lg border border-white/10 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handleTargetDoseUnitToggle('mcg')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    targetDoseUnit === 'mcg'
                      ? 'bg-[#FF2ED1] text-white shadow-[0_0_10px_rgba(255,46,209,0.6)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  mcg
                </button>
                <button
                  type="button"
                  onClick={() => handleTargetDoseUnitToggle('mg')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    targetDoseUnit === 'mg'
                      ? 'bg-[#FF2ED1] text-white shadow-[0_0_10px_rgba(255,46,209,0.6)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  mg
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-4 gap-2 font-mono">
              {[100, 250, 500, 1000].map((mcgVal) => {
                const presetVal = targetDoseUnit === 'mcg' ? mcgVal : mcgVal / 1000;
                const isSelected = targetDoseMcg === mcgVal;
                return (
                  <button
                    key={mcgVal}
                    type="button"
                    onClick={() => setTargetDoseStr(presetVal.toString())}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF2ED1]/20 border-[#FF2ED1] text-[#FF2ED1] shadow-[0_0_10px_rgba(255,46,209,0.3)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mcgVal} mcg
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <div className="relative">
              <input
                type="number"
                value={targetDoseStr}
                onChange={(e) => setTargetDoseStr(e.target.value)}
                placeholder="e.g. 250"
                className="w-full px-4 py-3 bg-black/80 border border-white/20 rounded-xl text-sm font-mono text-white font-bold focus:outline-none focus:border-[#FF2ED1] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-[#FF2ED1] font-bold">
                {targetDoseUnit}
              </span>
            </div>
          </div>

          {/* 4. SYRINGE TYPE & SCALE */}
          <div className="space-y-3 p-4 rounded-xl bg-black/40 border border-white/10 font-mono">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              4. Syringe Barrel & Scale
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'u100-1ml', label: 'U-100 (1.0 mL / 100u)' },
                { id: 'u100-0.5ml', label: 'U-100 (0.5 mL / 50u)' },
                { id: 'u100-0.3ml', label: 'U-100 (0.3 mL / 30u)' },
                { id: 'u40-1ml', label: 'U-40 (1.0 mL / 40u)' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSyringeType(s.id as SyringeType)}
                  className={`p-3 text-left text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    syringeType === s.id
                      ? 'bg-[#00D9FF]/20 border-[#00D9FF] text-white shadow-[0_0_12px_rgba(0,217,255,0.3)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      results={
        <div className="space-y-6">
          {/* Main Key Result Display */}
          <div className="p-6 rounded-2xl bg-[#050810] border border-[#00D9FF]/50 text-center space-y-2 shadow-[0_0_35px_rgba(0,217,255,0.2)]">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block">
              Calculated Syringe Pull
            </span>
            <div className="text-5xl sm:text-6xl font-black font-mono text-[#00D9FF] drop-shadow-[0_0_20px_rgba(0,217,255,0.8)]">
              {calculatedUnits.toFixed(1)}{' '}
              <span className="text-xl text-slate-300 font-sans font-semibold">UNITS</span>
            </div>
            <p className="text-xs font-mono text-slate-300">
              Equals <strong className="text-white">{requiredMl.toFixed(3)} mL</strong> liquid for{' '}
              <strong className="text-[#00D9FF]">
                {targetDoseMcg >= 1000
                  ? `${(targetDoseMcg / 1000).toFixed(2)} mg`
                  : `${targetDoseMcg} mcg`}
              </strong>{' '}
              dose
            </p>
          </div>

          {/* Interactive SVG Syringe Visualizer */}
          <SyringeVisualization
            syringeType={syringeType}
            calculatedUnits={calculatedUnits}
            volumeMl={requiredMl}
            percentageFilled={percentageFilled}
          />

          {/* Comprehensive Output Parameters Table */}
          <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#00D9FF]" />
                Laboratory Solution Metrics
              </span>
              <Badge variant="cyan" className="text-[9px]">LIVE MATRIX</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[10px]">CONCENTRATION</span>
                <p className="text-sm font-bold text-white">
                  {concentrationMcgPerMl.toLocaleString()} mcg/mL
                </p>
                <span className="text-[10px] text-slate-400">({concentrationMgPerMl.toFixed(2)} mg/mL)</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[10px]">TOTAL PEPTIDE IN VIAL</span>
                <p className="text-sm font-bold text-slate-200">
                  {totalPeptideMg} mg ({totalPeptideMcg.toLocaleString()} mcg)
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[10px]">TOTAL DOSES PER VIAL</span>
                <p className="text-sm font-bold text-[#00D9FF]">
                  {totalDosesPerVial} Full Doses
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[10px]">LIQUID VOLUME PER DOSE</span>
                <p className="text-sm font-bold text-white">
                  {requiredMl.toFixed(3)} mL
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[10px]">BARREL FILL %</span>
                <p className="text-sm font-bold text-[#FF2ED1]">
                  {percentageFilled.toFixed(1)}% Full
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-slate-400 block text-[10px]">CURRENT TICK MARK</span>
                <p className="text-sm font-bold text-[#00D9FF]">
                  Mark {calculatedUnits.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};
