import React from 'react';
import {
  Eye,
  Edit,
  UserCheck,
  UserX,
  Key,
  Bell,
  ChevronLeft,
  ChevronRight,
  Building,
  ShoppingBag,
  ShieldAlert,
  Lock,
} from 'lucide-react';
import { ActionMenu } from '../../common/ActionMenu';
import {
  CustomerDetail,
  CustomerAccountStatus,
} from '../../../types/customer';
import {
  CustomerAccountStatusBadge,
  CustomerTierBadge,
  CustomerVerificationBadge,
} from './CustomerStatusBadge';

interface CustomerTableProps {
  customers: CustomerDetail[];
  selectedCustomerIds: string[];
  onSelectCustomer: (customerId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  onViewProfile: (customer: CustomerDetail) => void;
  onEditCustomer: (customer: CustomerDetail) => void;
  onQuickStatusChange: (customer: CustomerDetail, newStatus: CustomerAccountStatus) => void;
  onResetPassword: (customer: CustomerDetail) => void;
  onSendNotification: (customer: CustomerDetail) => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  selectedCustomerIds,
  onSelectCustomer,
  onSelectAll,
  onViewProfile,
  onEditCustomer,
  onQuickStatusChange,
  onResetPassword,
  onSendNotification,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
}) => {
  const isAllSelected =
    customers.length > 0 && customers.every((c) => selectedCustomerIds.includes(c.id));

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col relative">
      {/* Scrollable Table Container */}
      <div className="overflow-x-auto custom-scrollbar min-h-[360px]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  aria-label="Select all customers on page"
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3 whitespace-nowrap">Customer ID / Code</th>
              <th className="py-3 px-3 min-w-[200px]">Name & Institution</th>
              <th className="py-3 px-3 text-center whitespace-nowrap">Orders</th>
              <th className="py-3 px-3 text-right whitespace-nowrap">Qualifying Spending (â‚±)</th>
              <th className="py-3 px-3 whitespace-nowrap">Account Status</th>
              <th className="py-3 px-3 whitespace-nowrap">Tier</th>
              <th className="py-3 px-3 whitespace-nowrap">KYC Verification</th>
              <th className="py-3 px-3 text-right pr-4 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500 font-mono">
                  No customers matched your filter criteria.
                </td>
              </tr>
            ) : (
              customers.map((c) => {
                const isSelected = selectedCustomerIds.includes(c.id);
                const qualifyingSpend = c.qualifyingLifetimeSpending ?? c.stats.lifetimeSpending;

                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isSelected ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelectCustomer(c.id, e.target.checked)}
                        aria-label={`Select customer ${c.name}`}
                        className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Customer ID & Code (Stacked) */}
                    <td className="py-3 px-3 font-mono align-middle whitespace-nowrap">
                      <button
                        onClick={() => onViewProfile(c)}
                        className="font-bold text-cyan-400 hover:underline hover:text-cyan-300 block text-left cursor-pointer"
                      >
                        {c.customerCode}
                      </button>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{c.id}</span>
                    </td>

                    {/* Name & Institution (Stacked) */}
                    <td className="py-3 px-3 align-middle">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            c.avatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              c.name
                            )}&background=0F172A&color=38BDF8`
                          }
                          alt={c.name}
                          className="h-8 w-8 rounded-full border border-slate-700 object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <button
                            onClick={() => onViewProfile(c)}
                            className="font-semibold text-white hover:text-cyan-300 transition-colors text-left cursor-pointer block truncate max-w-[220px]"
                            title={c.name}
                          >
                            {c.name}
                          </button>
                          {c.companyOrInstitution ? (
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono mt-0.5">
                              <Building className="h-3 w-3 text-slate-500 shrink-0" />
                              <span className="truncate max-w-[200px]" title={c.companyOrInstitution}>
                                {c.companyOrInstitution}
                              </span>
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              Individual Customer
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Total Orders */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-200 align-middle whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        <ShoppingBag className="h-3 w-3 text-cyan-400" />
                        <span>{c.stats.totalOrders}</span>
                      </div>
                    </td>

                    {/* Qualifying Spending (PHP â‚±) */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400 align-middle whitespace-nowrap">
                      â‚±
                      {qualifyingSpend.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* Account Status */}
                    <td className="py-3 px-3 align-middle whitespace-nowrap">
                      <CustomerAccountStatusBadge status={c.status} size="sm" />
                    </td>

                    {/* Tier */}
                    <td className="py-3 px-3 align-middle whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1">
                        <CustomerTierBadge tier={c.tier} size="sm" />
                        {c.isManualTierOverride && c.tier !== 'OWNER' && (
                          <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/40 flex items-center gap-0.5">
                            <ShieldAlert size={9} />
                            <span>MANUAL OVERRIDE</span>
                          </span>
                        )}
                        {c.tier === 'OWNER' && (
                          <span className="text-[9px] font-mono font-bold text-pink-300 bg-pink-950/80 px-1.5 py-0.5 rounded border border-pink-500/40 flex items-center gap-0.5">
                            <Lock size={9} />
                            <span>MANUAL ONLY</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Verification */}
                    <td className="py-3 px-3 align-middle whitespace-nowrap">
                      <CustomerVerificationBadge status={c.verificationStatus} size="sm" />
                    </td>

                    {/* Actions Menu Trigger & Popover */}
                    <td className="py-3 px-3 text-right pr-4 align-middle whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        ariaLabel={`Actions for ${c.name}`}
                        items={[
                          {
                            label: 'View Customer',
                            icon: <Eye className="h-4 w-4 text-cyan-400 shrink-0" />,
                            onClick: () => onViewProfile(c),
                          },
                          {
                            label: 'Edit Customer',
                            icon: <Edit className="h-4 w-4 text-amber-400 shrink-0" />,
                            onClick: () => onEditCustomer(c),
                          },
                          {
                            label: 'Send Alert',
                            icon: <Bell className="h-4 w-4 text-purple-400 shrink-0" />,
                            onClick: () => onSendNotification(c),
                          },
                          {
                            label: 'Reset Password',
                            icon: <Key className="h-4 w-4 text-emerald-400 shrink-0" />,
                            onClick: () => onResetPassword(c),
                          },
                          {
                            divider: true,
                            label: c.status === 'SUSPENDED' || c.status === 'DISABLED' || c.status === 'BANNED'
                              ? 'Reactivate Account'
                              : 'Suspend Account',
                            icon: c.status === 'SUSPENDED' || c.status === 'DISABLED' || c.status === 'BANNED' ? (
                              <UserCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                            ) : (
                              <UserX className="h-4 w-4 text-rose-400 shrink-0" />
                            ),
                            variant: c.status === 'SUSPENDED' || c.status === 'DISABLED' || c.status === 'BANNED'
                              ? 'emerald'
                              : 'danger',
                            onClick: () => onQuickStatusChange(c, c.status === 'SUSPENDED' || c.status === 'DISABLED' || c.status === 'BANNED' ? 'ACTIVE' : 'SUSPENDED'),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-slate-950 p-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400 z-10">
        <div>
          Showing Page <strong className="text-white">{currentPage}</strong> of{' '}
          <strong className="text-white">{totalPages}</strong> ({totalCount} total researchers)
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
            className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 text-slate-200 rounded flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </button>

          <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-cyan-400 font-bold rounded">
            {currentPage}
          </span>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
            className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 text-slate-200 rounded flex items-center gap-1 cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};


