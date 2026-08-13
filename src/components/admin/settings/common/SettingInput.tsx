import React from 'react';

export interface SettingInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  helperText?: string;
  exampleText?: string;
  tooltipText?: string;
  prefixText?: string;
  suffixText?: string;
  error?: string;
}

export const SettingInput: React.FC<SettingInputProps> = ({
  label,
  value,
  onChange,
  helperText,
  exampleText,
  tooltipText,
  prefixText,
  suffixText,
  error,
  type = 'text',
  placeholder,
  disabled,
  className = '',
  ...props
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
        {prefixText && (
          <span className="inline-flex items-center px-3 h-full rounded-l-xl border border-r-0 border-white/10 bg-white/5 text-xs text-slate-400 font-mono shrink-0">
            {prefixText}
          </span>
        )}
        <input
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full h-10 bg-[#050810] border border-white/10 text-white text-xs px-3.5 transition-all focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] ${
            prefixText ? 'rounded-r-xl' : suffixText ? 'rounded-l-xl' : 'rounded-xl'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-900/50' : ''} ${
            error ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          {...props}
        />
        {suffixText && (
          <span className="inline-flex items-center px-3 h-full rounded-r-xl border border-l-0 border-white/10 bg-white/5 text-xs text-slate-400 font-mono shrink-0">
            {suffixText}
          </span>
        )}
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

