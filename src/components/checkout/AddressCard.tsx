import React from 'react';
import { MapPin, CheckCircle2, Phone, User } from 'lucide-react';
import { ShippingAddress } from '../../types/checkout';
import { Badge } from '../common/Badge';

interface AddressCardProps {
  address: ShippingAddress;
  isSelected: boolean;
  onSelect: () => void;
  className?: string;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isSelected,
  onSelect,
  className = '',
}) => {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
        isSelected
          ? 'bg-[#00D9FF]/10 border-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.2)]'
          : 'bg-[#090D16]/80 border-white/10 hover:border-white/30 hover:bg-white/5'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg border ${
              isSelected
                ? 'bg-[#00D9FF] text-black border-[#00D9FF]'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <User className="w-3 h-3 text-slate-400" />
                {address.recipientName}
              </span>
              {address.isDefault && (
                <Badge variant="cyan" className="text-[9px] px-1.5 py-0">
                  DEFAULT
                </Badge>
              )}
            </div>
            <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1 pt-0.5">
              <Phone className="w-3 h-3 text-slate-500" />
              {address.phone}
            </p>
          </div>
        </div>

        {/* Radio Checkbox Indicator */}
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
            isSelected
              ? 'border-[#00D9FF] bg-[#00D9FF] text-black'
              : 'border-white/20 bg-black/40'
          }`}
        >
          {isSelected && <CheckCircle2 className="w-4 h-4" />}
        </div>
      </div>

      {/* Address Details */}
      <div className="mt-3 text-xs font-mono text-slate-300 leading-relaxed border-t border-white/5 pt-2 space-y-0.5">
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p className="text-slate-400">{address.addressLine2}</p>}
        <p className="text-slate-400">
          {address.city}, {address.province}{address.region ? ` (${address.region})` : ''} {address.postalCode}
        </p>
      </div>
    </div>
  );
};
