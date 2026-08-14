import React, { useState, useEffect, useRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightElement,
  className = '',
  id,
  disabled,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const isControlled = value !== undefined;
  const [localValue, setLocalValue] = useState<string | number | readonly string[]>(() =>
    value !== undefined && value !== null ? value : ''
  );
  const isFocusedRef = useRef(false);

  useEffect(() => {
    if (isControlled && !isFocusedRef.current) {
      setLocalValue(value !== undefined && value !== null ? value : '');
    }
  }, [value, isControlled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isControlled) {
      setLocalValue(e.target.value);
    }
    onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true;
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = false;
    onBlur?.(e);
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          disabled={disabled}
          value={isControlled ? localValue : undefined}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full bg-[var(--bg-obsidian)] text-slate-100 placeholder-slate-500 text-sm rounded-lg px-4 py-2.5 min-h-[44px] transition-all duration-300 border shadow-inner ${
            error
              ? 'border-red-500/50 focus:border-red-400 focus:ring-1 focus:ring-red-500 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]'
              : 'border-white/10 hover:border-white/20 focus:border-[#00D9FF]/70 focus:ring-1 focus:ring-[#00D9FF] focus:shadow-[inset_0_0_10px_rgba(0,217,255,0.1),_0_0_15px_rgba(0,217,255,0.2)]'
          } ${leftIcon ? 'pl-10' : ''} ${rightElement ? 'pr-12' : ''} disabled:opacity-50 disabled:bg-slate-900/50 ${className}`}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 text-slate-400 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-medium">
          <span>⚠️</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

