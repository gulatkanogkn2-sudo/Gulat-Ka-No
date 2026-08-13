import React from 'react';

export interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (hexColor: string) => void;
  helperText?: string;
}

const PRESET_PALETTES = [
  { name: 'Cyan Glow', hex: '#00D9FF' },
  { name: 'Violet Neon', hex: '#8B5CF6' },
  { name: 'Magenta Pulse', hex: '#FF2ED1' },
  { name: 'Emerald Cyber', hex: '#10B981' },
  { name: 'Amber Gold', hex: '#F59E0B' },
  { name: 'Laser Red', hex: '#EF4444' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  helperText,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300">
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-3">
        {/* Preset Swatches */}
        <div className="flex items-center space-x-1.5 p-1 bg-[#050810] border border-white/10 rounded-lg">
          {PRESET_PALETTES.map((p) => {
            const isSelected = value.toLowerCase() === p.hex.toLowerCase();
            return (
              <button
                key={p.hex}
                type="button"
                onClick={() => onChange(p.hex)}
                className={`w-6 h-6 rounded-md transition-all cursor-pointer relative ${
                  isSelected ? 'ring-2 ring-white scale-110 shadow-md' : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: p.hex }}
                title={`${p.name} (${p.hex})`}
              />
            );
          })}
        </div>

        {/* Custom Hex Field */}
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={value.startsWith('#') ? value : '#00D9FF'}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded-lg bg-transparent border border-white/20 cursor-pointer p-0 overflow-hidden"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#00D9FF"
            className="w-24 bg-[#050810] border border-white/10 text-white font-mono text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-[#00D9FF]"
          />
        </div>
      </div>
      {helperText && <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>}
    </div>
  );
};
