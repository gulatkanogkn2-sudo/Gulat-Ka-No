import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SettingSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  helperText?: string;
  exampleText?: string;
  tooltipText?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export const SettingSelect: React.FC<SettingSelectProps> = ({
  label,
  value,
  options,
  onChange,
  helperText,
  exampleText,
  tooltipText,
  disabled = false,
  className = '',
  error,
}) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-x-2 gap-y-0.5 min-h-[22px]">
        <label className="text-xs font-semibold text-slate-300 leading-snug break-words">
          <span>{label}</span>
        </label>
        {exampleText && (
          <span className="text-[10px] text-slate-500 font-mono italic leading-tight break-words shrink">
            Ex: {exampleText}
          </span>
        )}
      </div>
      <div className="relative flex items-center h-10 w-full">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full h-10 bg-[#050810] border border-white/10 text-white text-xs px-3.5 rounded-xl transition-all focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] ${
            disabled ? 'opacity-50 cursor-not-allowed bg-slate-900/50' : ''
          } ${error ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0A0F1D] text-white">
              {opt.label} {opt.description ? `(${opt.description})` : ''}
            </option>
          ))}
        </select>
      </div>
      {(error || helperText || tooltipText) && (
        <div className="min-h-[16px]">
          {error ? (
            <p className="text-[11px] text-red-400 font-mono leading-tight break-words">{error}</p>
          ) : (
            <p className="text-[11px] text-slate-500 font-mono leading-tight break-words">{helperText || tooltipText}</p>
          )}
        </div>
      )}
    </div>
  );
};

