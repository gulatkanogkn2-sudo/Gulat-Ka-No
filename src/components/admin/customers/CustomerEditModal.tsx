import React, { useEffect, useState, useMemo } from 'react';
import { X, Save, User, Building, Phone, Mail, ShieldCheck, Crown, RotateCcw } from 'lucide-react';
import {
  CustomerDetail,
  CustomerAccountStatus,
  CustomerTier,
  CustomerVerificationStatus,
} from '../../../types/customer';
import { useAuth } from '../../../hooks/useAuth';
import { CustomerTierService } from '../../../services/customerTierService';

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
  const { user } = useAuth();
  const [name, setName] = useState(customer?.name || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [companyOrInstitution, setCompanyOrInstitution] = useState(
    customer?.companyOrInstitution || ''
  );
  const [status, setStatus] = useState<CustomerAccountStatus>(customer?.status || 'ACTIVE');
  const [role, setRole] = useState<'OWNER' | 'ADMIN' | 'STAFF' | 'CUSTOMER' | 'VIEWER'>(customer?.role || 'CUSTOMER');
  const [tier, setTier] = useState<CustomerTier>(customer?.tier || 'STANDARD');
  const [isManualTierOverride, setIsManualTierOverride] = useState<boolean>(
    customer?.isManualTierOverride ?? false
  );
  const [verificationStatus, setVerificationStatus] = useState<CustomerVerificationStatus>(
    customer?.verificationStatus || 'UNVERIFIED'
  );
  const [customerNotes, setCustomerNotes] = useState(customer?.customerNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Retrieve configured tiers dynamically from CustomerTierService
  const tierSettings = useMemo(() => CustomerTierService.getTierSettings(), []);
  const availableTiers = useMemo(() => {
    const list = [...tierSettings.tiers];
    // If the customer has an existing tier that is not in active tiers list, append it safely
    if (customer?.tier && !list.some((t) => t.id === customer.tier)) {
      list.push(CustomerTierService.getTierConfig(customer.tier, tierSettings));
    }
    return list;
  }, [tierSettings, customer?.tier]);

  // Calculate what auto tier would be based on spending
  const autoCalculatedTier = useMemo(() => {
    if (!customer) return 'STANDARD';
    const qualifyingSpend =
      customer.qualifyingLifetimeSpending ??
      CustomerTierService.calculateQualifyingSpending(customer.orders || []);
    return CustomerTierService.determineTierForSpending(
      qualifyingSpend,
      tierSettings,
      'STANDARD',
      false // test against false to see auto tier
    );
  }, [customer, tierSettings]);

  useEffect(() => {
    if (!customer) return;
    setName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phone);
    setCompanyOrInstitution(customer.companyOrInstitution || '');
    setStatus(customer.status);
    setRole(customer.role || 'CUSTOMER');
    setTier(customer.tier || 'STANDARD');
    setIsManualTierOverride(customer.isManualTierOverride ?? false);
    setVerificationStatus(customer.verificationStatus);
    setCustomerNotes(customer.customerNotes || '');
  }, [customer]);

  if (!customer) return null;
  const canManageAccess = user?.role === 'OWNER' || user?.role === 'ADMIN';
  const isOwnerProfile = customer.role === 'OWNER';

  const handleResetToAutoTier = () => {
    setTier(autoCalculatedTier);
    setIsManualTierOverride(false);
  };

  const handleTierChange = (selectedTier: string) => {
    setTier(selectedTier);
    setIsManualTierOverride(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        companyOrInstitution: companyOrInstitution.trim(),
        status,
        role: isOwnerProfile ? customer.role : role,
        tier: tier || 'STANDARD',
        isManualTierOverride,
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
              Edit Customer Profile — {customer.customerCode}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                Customer Name *
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
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+63 9XX XXX XXXX"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                Institution / Lab
              </label>
              <input
                type="text"
                value={companyOrInstitution}
                onChange={(e) => setCompanyOrInstitution(e.target.value)}
                placeholder="Laboratory or facility"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800/80 pt-3">
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
                <option value="PENDING_VERIFICATION">PENDING VERIFICATION</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="DISABLED">DISABLED</option>
                <option value="BANNED">BANNED</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                KYC Verification
              </label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value as CustomerVerificationStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="UNVERIFIED">UNVERIFIED</option>
                <option value="PENDING_ID">PENDING ID UPLOAD</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800/80 pt-3">
            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                Account Role (Authorization)
              </label>
              {isOwnerProfile ? (
                <div className="w-full bg-slate-950 border border-amber-800/80 rounded-lg p-2.5 text-amber-300 flex items-center justify-between">
                  <span className="font-bold">OWNER</span>
                  <span className="text-[10px] text-amber-400/80 font-mono">Protected Master</span>
                </div>
              ) : (
                <select
                  value={role}
                  disabled={!canManageAccess}
                  onChange={(e) => setRole(e.target.value as 'CUSTOMER' | 'STAFF' | 'ADMIN')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500 disabled:opacity-60"
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="STAFF">STAFF</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              )}
              <p className="mt-1 text-[10px] text-slate-500">
                Grants system privileges & navigation permissions.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-300 uppercase tracking-wider font-semibold">
                  Customer Tier
                </label>
                {isManualTierOverride && (
                  <button
                    type="button"
                    onClick={handleResetToAutoTier}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono uppercase"
                    title={`Reset to auto spending tier (${autoCalculatedTier})`}
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset to Auto</span>
                  </button>
                )}
              </div>
              <select
                value={tier || 'STANDARD'}
                disabled={!canManageAccess}
                onChange={(e) => handleTierChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500 disabled:opacity-60"
              >
                {availableTiers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.id}) {t.minLifetimeSpendPhp > 0 ? `— ₱${t.minLifetimeSpendPhp.toLocaleString()}` : ''}
                  </option>
                ))}
              </select>
              <div className="mt-1 flex items-center justify-between text-[10px]">
                <span className="text-slate-500">Commercial membership status.</span>
                {isManualTierOverride ? (
                  <span className="text-amber-400 font-bold">Manual Override Active</span>
                ) : (
                  <span className="text-emerald-400">Auto (Spend: ₱{(customer.qualifyingLifetimeSpending || 0).toLocaleString()})</span>
                )}
              </div>
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

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
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
