import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  ShieldCheck,
  Crown,
  DollarSign,
  ShoppingBag,
  Award,
  Heart,
  FileText,
  Key,
  Bell,
  MapPin,
  CreditCard,
  Edit,
  UserX,
  UserCheck,
  Plus,
  Lock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Download,
} from 'lucide-react';
import { CustomerDetail, CustomerAccountStatus } from '../../../types/customer';
import { CustomerManagementService } from '../../../services/customerManagementService';
import { CustomerTierService } from '../../../services/customerTierService';
import {
  CustomerAccountStatusBadge,
  CustomerTierBadge,
  CustomerVerificationBadge,
} from './CustomerStatusBadge';

interface CustomerDetailDrawerProps {
  customer: CustomerDetail;
  onClose: () => void;
  onEditCustomer: (customer: CustomerDetail) => void;
  onResetPassword: (customer: CustomerDetail) => void;
  onSendNotification: (customer: CustomerDetail) => void;
  onCustomerUpdated: (updated: CustomerDetail) => void;
}

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  customer,
  onClose,
  onEditCustomer,
  onResetPassword,
  onSendNotification,
  onCustomerUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'addresses' | 'wishlist' | 'notes' | 'security'
  >('overview');

  const [newAdminNote, setNewAdminNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const qualifyingSpend = customer.qualifyingLifetimeSpending ?? customer.stats.lifetimeSpending;
  const tierProgress = CustomerTierService.getTierProgressInfo(
    qualifyingSpend,
    customer.tier,
    undefined,
    customer.isManualTierOverride
  );

  const handleAddAdminNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminNote.trim()) return;

    setIsSubmittingNote(true);
    try {
      const updated = await CustomerManagementService.addAdminNote(
        customer.id,
        newAdminNote.trim(),
        'Admin User'
      );
      if (updated) {
        onCustomerUpdated(updated);
        setNewAdminNote('');
      }
    } catch (err) {
      console.error('Failed to add admin note:', err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleToggleStatus = async () => {
    const targetStatus: CustomerAccountStatus =
      customer.status === 'SUSPENDED' || customer.status === 'DISABLED' || customer.status === 'BANNED'
        ? 'ACTIVE'
        : 'SUSPENDED';

    const updated = await CustomerManagementService.updateCustomerStatus(
      customer.id,
      targetStatus,
      `Toggled status via Profile Drawer to ${targetStatus}`
    );
    if (updated) {
      onCustomerUpdated(updated);
    }
  };

  const handleExportSingleCustomer = () => {
    const exportResult = CustomerManagementService.exportCustomers([customer.id], 'csv');
    CustomerManagementService.downloadExport(exportResult);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end">
      {/* Sliding Drawer Container */}
      <div className="w-full max-w-3xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={
                customer.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  customer.name
                )}&background=0F172A&color=38BDF8`
              }
              alt={customer.name}
              className="h-10 w-10 rounded-full border border-slate-700 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono text-white">{customer.name}</h2>
                <CustomerAccountStatusBadge status={customer.status} size="sm" />
                <CustomerTierBadge tier={customer.tier} size="sm" />
              </div>
              <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                <span>Code: <strong className="text-cyan-400">{customer.customerCode}</strong></span>
                <span>•</span>
                <span>ID: {customer.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSingleCustomer}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 text-xs font-mono"
              title="Export Profile CSV"
            >
              <Download className="h-4 w-4 text-emerald-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950/60 px-4 sm:px-6 border-b border-slate-800 flex flex-wrap gap-3 sm:gap-4 text-xs font-mono shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Order History</span>
            <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded-full text-[10px]">
              {customer.orders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Addresses & Billing
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-3 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'wishlist'
                ? 'border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Wishlist</span>
            <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded-full text-[10px]">
              {customer.wishlist.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Notes & Admin History</span>
            <span className="px-1.5 py-0.2 bg-purple-950 text-purple-300 border border-purple-500/30 rounded-full text-[10px]">
              {customer.adminNotes.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Security & Login Log
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW & STATS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
                {/* Customer Stats Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Qualifying Spending (₱)</div>
                    <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
                      ₱
                      {qualifyingSpend.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Finalized Purchases Only</div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Completed Orders</div>
                    <div className="text-lg font-mono font-bold text-cyan-400 mt-1">
                      {customer.stats.ordersCompleted} / {customer.stats.totalOrders}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Fulfillment Rate</div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Avg Order Value (AOV)</div>
                    <div className="text-lg font-mono font-bold text-white mt-1">
                      ₱{customer.stats.averageOrderValue.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Per Transaction</div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Favorite Store</div>
                    <div className="text-sm font-mono font-bold text-amber-400 mt-1">
                      {customer.stats.favoriteStore}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Preferred Vault</div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Most Purchased</div>
                    <div className="text-xs font-semibold text-slate-200 mt-1 truncate" title={customer.stats.mostPurchasedProduct}>
                      {customer.stats.mostPurchasedProduct}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Core Reagent</div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Last Purchase Date</div>
                    <div className="text-xs font-mono font-semibold text-slate-300 mt-1">
                      {customer.stats.lastPurchaseDate}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Recent Activity</div>
                  </div>
                </div>

                {/* Customer Tier & Progression Card */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-amber-400" />
                      <h4 className="font-mono text-xs font-bold uppercase text-slate-200">
                        Customer Tier Status & Threshold Progress
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <CustomerTierBadge tier={customer.tier} size="sm" />
                      {customer.isManualTierOverride && (
                        <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 font-bold">
                          MANUAL OVERRIDE
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">CURRENT TIER:</span>
                      <span className="font-bold text-white uppercase">{customer.tier}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">QUALIFYING SPENDING:</span>
                      <span className="font-bold text-emerald-400">
                        ₱{qualifyingSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">NEXT TIER TARGET:</span>
                      <span className="font-bold text-cyan-400">
                        {tierProgress.nextTierConfig ? tierProgress.nextTierConfig.name : 'NONE (HIGHEST TIER)'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">REMAINING NEEDED:</span>
                      <span className="font-bold text-amber-300">
                        {tierProgress.remainingSpendPhp > 0
                          ? `₱${tierProgress.remainingSpendPhp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : '₱0.00 (Qualified)'}
                      </span>
                    </div>
                  </div>

                  {!tierProgress.isManualOrOwner && !tierProgress.isHighestTier && tierProgress.nextTierConfig && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span>Progression towards {tierProgress.nextTierConfig.name}</span>
                        <span className="text-cyan-400 font-bold">{tierProgress.progressPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${tierProgress.progressPercentage}%` }}
                        />
                      </div>
                      <p className="text-[10px] font-mono text-slate-500 pt-0.5">
                        Qualifying threshold: ₱
                        {tierProgress.nextTierThresholdPhp.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  )}

                  {tierProgress.isHighestTier && !tierProgress.isManualOrOwner && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                      <Award size={16} className="text-emerald-400 shrink-0" />
                      <span>Highest automatic tier reached! Customer qualifies for top VIP benefits.</span>
                    </div>
                  )}

                  {tierProgress.isManualOrOwner && (
                    <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-mono flex items-center gap-2">
                      <ShieldCheck size={16} className="text-purple-400 shrink-0" />
                      <span>
                        Manual tier override is enabled for this customer. Automatic recalculations will not overwrite this tier.
                      </span>
                    </div>
                  )}
                </div>

                {/* Customer account information */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-mono text-xs font-bold uppercase text-slate-200">
                    Customer Profile & Verification
                  </h4>
                  <CustomerVerificationBadge status={customer.verificationStatus} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-mono block text-[10px]">Full Name:</span>
                    <span className="text-slate-200 font-semibold">{customer.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono block text-[10px]">Email Address:</span>
                    <span className="text-cyan-400 font-mono">{customer.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono block text-[10px]">Phone Number:</span>
                    <span className="text-slate-200 font-mono">{customer.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono block text-[10px]">Company:</span>
                    <span className="text-slate-200">{customer.companyOrInstitution || 'Individual Customer'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono block text-[10px]">Registration Date:</span>
                    <span className="text-slate-300 font-mono">
                      {new Date(customer.registrationDate).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono block text-[10px]">Verification Record:</span>
                    <span className="text-emerald-400 font-mono font-medium">
                      {customer.kycDocStatus || 'Pending Verification'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h4 className="font-mono text-xs font-bold uppercase text-slate-300">
                Customer Order History ({customer.orders.length})
              </h4>

              {customer.orders.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono bg-slate-950 rounded-xl border border-slate-800">
                  No orders logged for this customer account.
                </div>
              ) : (
                <div className="space-y-3">
                  {customer.orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-400 text-sm">
                            {ord.referenceNumber}
                          </span>
                          <span className="uppercase text-[10px] font-mono px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded">
                            {ord.storeType}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300">{ord.itemsSummary}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Date: {new Date(ord.orderDate).toLocaleDateString()} • {ord.itemCount} Items
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <div className="text-sm font-mono font-bold text-emerald-400">
                            ${ord.grandTotal.toFixed(2)}
                          </div>
                          <div className="text-[10px] font-mono uppercase text-slate-400 mt-0.5">
                            {ord.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES & BILLING */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              {/* Shipping Addresses */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs font-bold uppercase text-slate-300 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  <span>Saved Shipping Destinations ({customer.addresses.length})</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {customer.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 rounded-xl border text-xs space-y-2 relative ${
                        addr.isDefault
                          ? 'bg-slate-950 border-cyan-500/40 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      {addr.isDefault && (
                        <span className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-500/30 rounded uppercase">
                          Default Destination
                        </span>
                      )}
                      <div className="font-bold text-slate-100 font-mono">
                        {addr.label || addr.recipientName}
                      </div>
                      <div className="text-slate-300">{addr.addressLine1}</div>
                      {addr.addressLine2 && <div className="text-slate-400">{addr.addressLine2}</div>}
                      <div className="text-slate-400 font-mono">
                        {addr.city}, {addr.province} {addr.postalCode}
                      </div>
                      <div className="text-slate-500 font-mono">{addr.country}</div>
                      <div className="text-slate-400 font-mono text-[11px] pt-1">
                        Phone: {addr.phone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Information */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <h4 className="font-mono text-xs font-bold uppercase text-slate-300 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-400" />
                  <span>Billing & Payment Information</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-mono block text-[10px]">Preferred Payment:</span>
                    <span className="text-slate-200 font-semibold">
                      {customer.billingInfo.preferredPaymentMethod}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono block text-[10px]">Tax ID (TIN):</span>
                    <span className="text-slate-200 font-mono">
                      {customer.billingInfo.taxId || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono block text-[10px]">Settlement Currency:</span>
                    <span className="text-cyan-400 font-mono font-bold">
                      {customer.billingInfo.currencyPreference}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h4 className="font-mono text-xs font-bold uppercase text-slate-300 flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-400" />
                <span>Customer Wishlist & Monitored Reagents ({customer.wishlist.length})</span>
              </h4>

              {customer.wishlist.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono bg-slate-950 rounded-xl border border-slate-800">
                  No wishlist compounds currently saved.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {customer.wishlist.map((w) => (
                    <div
                      key={w.id}
                      className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-xs text-white">{w.productName}</div>
                        {w.casNumber && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            CAS: {w.casNumber}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500 font-mono uppercase mt-1">
                          Vault: {w.storeType} • Saved {new Date(w.addedDate).toLocaleDateString()}
                        </div>
                      </div>
                      {w.estimatedPrice && (
                        <div className="text-sm font-mono font-bold text-cyan-400">
                          ${w.estimatedPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: NOTES & ADMIN HISTORY */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Customer Provided Notes */}
              {customer.customerNotes && (
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                  <h4 className="font-mono text-xs font-bold uppercase text-slate-400">
                    Customer Special Instructions
                  </h4>
                  <p className="text-xs text-slate-300 italic">{customer.customerNotes}</p>
                </div>
              )}

              {/* Form to Add New Internal Admin Note */}
              <form onSubmit={handleAddAdminNote} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <h4 className="font-mono text-xs font-bold uppercase text-purple-400 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Add Internal Admin Note</span>
                </h4>
                <textarea
                  rows={3}
                  value={newAdminNote}
                  onChange={(e) => setNewAdminNote(e.target.value)}
                  placeholder="Record administrative audit notes, compliance logs, or telephone communications..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingNote || !newAdminNote.trim()}
                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-mono text-xs font-bold rounded-lg transition-all"
                  >
                    Log Admin Note
                  </button>
                </div>
              </form>

              {/* Admin Note History List */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs font-bold uppercase text-slate-300">
                  Internal Administrative Log ({customer.adminNotes.length})
                </h4>

                <div className="space-y-2">
                  {customer.adminNotes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="font-bold text-purple-400">{note.author}</span>
                        <span className="text-slate-500">
                          {new Date(note.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY & LOGIN ACTIVITY */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <h4 className="font-mono text-xs font-bold uppercase text-slate-300">
                Recent Account Login Log
              </h4>

              <div className="space-y-2">
                {customer.loginActivity.map((log) => (
                  <div
                    key={log.id}
                    className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <div className="text-slate-200 font-bold">{log.ipAddress}</div>
                      <div className="text-[10px] text-slate-400">
                        {log.location} • {log.device}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded text-[10px]">
                        {log.status}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditCustomer(customer)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs rounded-lg transition-all flex items-center gap-1.5"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={handleToggleStatus}
              className={`px-3.5 py-2 font-mono font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 ${
                customer.status === 'SUSPENDED' || customer.status === 'DISABLED' || customer.status === 'BANNED'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-rose-950/80 border border-rose-500/40 hover:bg-rose-900 text-rose-300'
              }`}
            >
              {customer.status === 'SUSPENDED' || customer.status === 'DISABLED' || customer.status === 'BANNED' ? (
                <>
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Reactivate Account</span>
                </>
              ) : (
                <>
                  <UserX className="h-3.5 w-3.5" />
                  <span>Suspend Account</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onResetPassword(customer)}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-xs rounded-lg transition-all flex items-center gap-1.5"
            >
              <Key className="h-3.5 w-3.5 text-emerald-400" />
              <span>Reset Password</span>
            </button>

            <button
              onClick={() => onSendNotification(customer)}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30 font-mono text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
            >
              <Bell className="h-3.5 w-3.5 text-purple-400" />
              <span>Send Alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

