import React, { useState } from 'react';
import { Plus, MapPin, Building, ShieldCheck } from 'lucide-react';
import { ShippingAddress } from '../../types/checkout';
import { AddressCard } from './AddressCard';

interface AddressSelectorProps {
  selectedAddress: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
  savedAddresses?: ShippingAddress[];
  className?: string;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  selectedAddress,
  onChange,
  savedAddresses = [],
  className = '',
}) => {
  const [useSaved, setUseSaved] = useState<boolean>(true);
  const [selectedSavedId, setSelectedSavedId] = useState<string>(
    savedAddresses[0]?.id || ''
  );

  // Form state for custom/new address
  const [newAddress, setNewAddress] = useState<ShippingAddress>({
    recipientName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    region: 'Luzon',
    postalCode: '',
    country: 'Philippines',
  });

  const handleSelectSaved = (addr: ShippingAddress) => {
    setSelectedSavedId(addr.id || '');
    setUseSaved(true);
    onChange(addr);
  };

  const handleCustomFieldChange = (field: keyof ShippingAddress, value: string) => {
    const updated = { ...newAddress, [field]: value };
    setNewAddress(updated);
    if (!useSaved) {
      onChange(updated);
    }
  };

  const handleToggleNewAddress = () => {
    setUseSaved(false);
    onChange(newAddress);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header & Toggle selector */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#00D9FF]" />
          2. Destination Address
        </h3>
        <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setUseSaved(true);
              const found = savedAddresses.find((a) => a.id === selectedSavedId) || savedAddresses[0];
              if (found) onChange(found);
            }}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              useSaved
                ? 'bg-[#00D9FF] text-black font-bold shadow-[0_0_10px_rgba(0,217,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Saved ({savedAddresses.length})
          </button>
          <button
            type="button"
            onClick={handleToggleNewAddress}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
              !useSaved
                ? 'bg-[#00D9FF] text-black font-bold shadow-[0_0_10px_rgba(0,217,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3 h-3" />
            New Address
          </button>
        </div>
      </div>

      {/* Saved Addresses View */}
      {useSaved && savedAddresses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {savedAddresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              isSelected={selectedSavedId === addr.id}
              onSelect={() => handleSelectSaved(addr)}
            />
          ))}
        </div>
      ) : (
        /* New Custom Address Form */
        <div className="p-4 sm:p-5 rounded-xl bg-[#090D16]/90 border border-[#00D9FF]/30 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
            <Building className="w-4 h-4" />
            <span>Enter Laboratory / Medical Receiving Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Recipient Name */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Recipient Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={newAddress.recipientName}
                onChange={(e) => handleCustomFieldChange('recipientName', e.target.value)}
                placeholder="Dr. Jane Doe / Receiving Officer"
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:border-[#00D9FF] focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Recipient Phone <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={newAddress.phone}
                onChange={(e) => handleCustomFieldChange('phone', e.target.value)}
                placeholder="+63 917 000 0000"
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:border-[#00D9FF] focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Address Line 1 */}
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Address Line 1 (Street / Building) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={newAddress.addressLine1}
                onChange={(e) => handleCustomFieldChange('addressLine1', e.target.value)}
                placeholder="Unit / Floor / Building Name / Street Address"
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:border-[#00D9FF] focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Address Line 2 */}
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Address Line 2 (Subdivision / Landmark - Optional)
              </label>
              <input
                type="text"
                value={newAddress.addressLine2 || ''}
                onChange={(e) => handleCustomFieldChange('addressLine2', e.target.value)}
                placeholder="Barangay / Industrial Zone / Landmark"
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:border-[#00D9FF] focus:outline-none transition-colors"
              />
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                City / Municipality <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={newAddress.city}
                onChange={(e) => handleCustomFieldChange('city', e.target.value)}
                placeholder="e.g. Quezon City / Cebu City"
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:border-[#00D9FF] focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Province */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Province <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={newAddress.province}
                onChange={(e) => handleCustomFieldChange('province', e.target.value)}
                placeholder="e.g. Metro Manila / Laguna / Cebu"
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:border-[#00D9FF] focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Region Dropdown */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Region <span className="text-red-400">*</span>
              </label>
              <select
                value={newAddress.region || 'Luzon'}
                onChange={(e) => handleCustomFieldChange('region', e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-[#00D9FF] focus:outline-none transition-colors"
                required
              >
                <option value="Luzon">Luzon</option>
                <option value="Visayas">Visayas</option>
                <option value="Mindanao">Mindanao</option>
              </select>
            </div>

            {/* Postal Code */}
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Postal Code <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={newAddress.postalCode}
                onChange={(e) => handleCustomFieldChange('postalCode', e.target.value)}
                placeholder="1100"
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:border-[#00D9FF] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
        <span>Express courier shipping container dispatched to this address.</span>
      </div>
    </div>
  );
};
