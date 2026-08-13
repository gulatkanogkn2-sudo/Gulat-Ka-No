import React, { useState } from 'react';
import { X, Save, User, Building, Phone, Mail, ShieldCheck, Crown } from 'lucide-react';
import {
  CustomerDetail,
  CustomerAccountStatus,
  CustomerTier,
  CustomerVerificationStatus,
} from '../../../types/customer';

interface CustomerEditModalProps {
  customer: CustomerDetail | null;
  onClose: () => void;
  onSave: (updated: Partial<CustomerDetail>) => void;
}

export const CustomerEditModal: React.FC<CustomerEditModalProps> = ({
  customer,
  onClose,
  onSave,
}) => {
  if (!customer) return null;

  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email);
  const [phone, setPhone] = useState(customer.phone);
  const [companyOrInstitution, setCompanyOrInstitution] = useState(
    customer.companyOrInstitution || ''
  );
  const [status, setStatus] = useState<CustomerAccountStatus>(customer.status);
  const [tier, setTier] = useState<CustomerTier>(customer.tier);
  const [isManualTierOverride, setIsManualTierOverride] = useState<boolean>(
    customer.isManualTierOverride ?? false
  );
  const [verificationStatus, setVerificationStatus] = useState<CustomerVerificationStatus>(
    customer.verificationStatus
  );
  const [customerNotes, setCustomerNotes] = useState(customer.customerNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isTierChanged = tier !== customer.tier;
      await onSave({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        companyOrInstitution: companyOrInstitution.trim(),
        status,
        tier,
        isManualTierOverride: isTierChanged ? true : isManualTierOverride,
        verificationStatus,
        customerNotes: customerNotes.trim(),
      });
      onClose();
    } catch (err) {
      console.error('Failed to update customer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-6 max-w-xl w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-amber-400" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-100">
              Edit Researcher Profile — {customer.customerCode}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                Phone Number
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                Company / Institution
              </label>
              <input
                type="text"
                value={companyOrInstitution}
                onChange={(e) => setCompanyOrInstitution(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CustomerAccountStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="DISABLED">DISABLED</option>
                <option value="BANNED">BANNED</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                Customer Tier
              </label>
              <select
                value={tier}
                onChange={(e) => {
                  setTier(e.target.value as CustomerTier);
                  setIsManualTierOverride(true);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="STANDARD">STANDARD</option>
                <option value="SILVER">SILVER</option>
                <option value="GOLD">GOLD</option>
                <option value="VIP">VIP</option>
                <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                <option value="OWNER">OWNER</option>
              </select>
              <label className="flex items-center gap-2 mt-2 text-[11px] text-amber-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isManualTierOverride || tier === 'OWNER'}
                  disabled={tier === 'OWNER'}
                  onChange={(e) => setIsManualTierOverride(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
                />
                <span>Lock Tier (Manual Override)</span>
              </label>
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                Prevents automated tier recalculation from modifying this customer.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                Verification Status
              </label>
              <select
                value={verificationStatus}
                onChange={(e) =>
                  setVerificationStatus(e.target.value as CustomerVerificationStatus)
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="VERIFIED">VERIFIED</option>
                <option value="PENDING_ID">PENDING_ID</option>
                <option value="UNVERIFIED">UNVERIFIED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
              Special Customer Instructions / Notes
            </label>
            <textarea
              rows={3}
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="e.g. Dry ice required. Contact lab receiver prior to dispatch..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 font-bold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-all shadow-lg flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
