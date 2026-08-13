import React from 'react';

export interface ToggleSwitchProps {
  label?: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  activeColor?: 'cyan' | 'magenta' | 'purple' | 'green';
  size?: 'sm' | 'md';
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  activeColor = 'cyan',
  size = 'md',
}) => {
  const getGlowBg = () => {
    if (!checked) return 'bg-slate-800 border-slate-700';
    switch (activeColor) {
      case 'magenta':
        return 'bg-[#FF2ED1] border-[#FF2ED1] shadow-[0_0_12px_rgba(255,46,209,0.5)]';
      case 'purple':
        return 'bg-[#8B5CF6] border-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.5)]';
      case 'green':
        return 'bg-[#10B981] border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.5)]';
      case 'cyan':
      default:
        return 'bg-[#00D9FF] border-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.5)]';
    }
  };

  const trackSize = size === 'sm' ? 'w-8 h-4' : 'w-11 h-6';
  const thumbSize = size === 'sm' ? 'w-3 h-3' : 'w-5 h-5';
  const translatePos = size === 'sm' ? (checked ? 'translate-x-4' : 'translate-x-0.5') : (checked ? 'translate-x-5' : 'translate-x-0.5');

  return (
    <label className={`inline-flex items-center justify-between space-x-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-xs font-semibold text-slate-200">{label}</span>}
          {description && <span className="text-[11px] text-slate-400 mt-0.5">{description}</span>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex items-center rounded-full border transition-colors duration-300 focus:outline-none ${trackSize} ${getGlowBg()}`}
      >
        <span
          className={`inline-block rounded-full bg-white transition-transform duration-300 transform ${thumbSize} ${translatePos} ${
            checked ? 'bg-slate-950' : 'bg-slate-400'
          }`}
        />
      </button>
    </label>
  );
};
