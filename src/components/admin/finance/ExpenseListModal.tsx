import React, { useState } from 'react';
import { ExpenseItem, ExpenseCategory } from '../../../types/finance';
import { ActionMenu } from '../../common/ActionMenu';
import {
  Receipt,
  Plus,
  Trash2,
  X,
  AlertCircle,
  Check,
  Tag,
  Calendar,
  Layers,
  DollarSign,
  Eye,
  Edit,
} from 'lucide-react';

interface ExpenseListModalProps {
  expenses: ExpenseItem[];
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onUpdateExpense?: (expense: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
  usdToPhpRate: number;
}

export const ExpenseListModal: React.FC<ExpenseListModalProps> = ({
  expenses,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  usdToPhpRate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // View / Edit / Delete Modal states
  const [viewExpense, setViewExpense] = useState<ExpenseItem | null>(null);
  const [editExpense, setEditExpense] = useState<ExpenseItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Add Form State
  const [name, setName] = useState<string>('');
  const [amountPhp, setAmountPhp] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ExpenseCategory>('Shipping');
  const [storeType, setStoreType] = useState<'all' | 'groupbuy' | 'onhand' | 'moq'>('groupbuy');
  const [batchNumber, setBatchNumber] = useState<string>('GB-2026-08A');
  const [notes, setNotes] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Edit Form State
  const [editName, setEditName] = useState<string>('');
  const [editAmountPhp, setEditAmountPhp] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editCategory, setEditCategory] = useState<ExpenseCategory>('Shipping');
  const [editStoreType, setEditStoreType] = useState<'all' | 'groupbuy' | 'onhand' | 'moq'>('groupbuy');
  const [editBatchNumber, setEditBatchNumber] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editFormError, setEditFormError] = useState<string>('');

  const handleOpenModal = () => {
    setName('');
    setAmountPhp('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('Shipping');
    setStoreType('groupbuy');
    setBatchNumber('GB-2026-08A');
    setNotes('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleStartEdit = (exp: ExpenseItem) => {
    setEditExpense(exp);
    setEditName(exp.name);
    setEditAmountPhp(exp.amountPhp.toString());
    setEditDate(exp.date);
    setEditCategory(exp.category);
    setEditStoreType(exp.storeType || 'groupbuy');
    setEditBatchNumber(exp.batchNumber || 'GB-2026-08A');
    setEditNotes(exp.notes || '');
    setEditFormError('');
    setOpenDropdownId(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editExpense) return;

    if (!editName.trim()) {
      setEditFormError('Expense name is required.');
      return;
    }
    const num = parseFloat(editAmountPhp);
    if (isNaN(num) || num <= 0) {
      setEditFormError('Please enter a valid positive amount in PHP ₱.');
      return;
    }

    if (onUpdateExpense) {
      onUpdateExpense({
        ...editExpense,
        name: editName.trim(),
        amountPhp: num,
        date: editDate,
        category: editCategory,
        storeType: editStoreType,
        batchNumber: editBatchNumber,
        notes: editNotes.trim(),
      });
    }

    setEditExpense(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Expense name is required.');
      return;
    }
    const num = parseFloat(amountPhp);
    if (isNaN(num) || num <= 0) {
      setFormError('Please enter a valid positive amount in PHP ₱.');
      return;
    }

    onAddExpense({
      name: name.trim(),
      amountPhp: num,
      date,
      category,
      storeType,
      batchNumber,
      notes: notes.trim(),
      recordedBy: 'Admin Team',
    });

    setIsModalOpen(false);
  };

  const formatPhp = (val: number) => `₱${Math.round(val).toLocaleString('en-US')}`;
  const formatUsd = (val: number) => `$${(val / usdToPhpRate).toFixed(2)} USD`;

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const getCategoryBadgeClass = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'Shipping':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Packaging':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Laboratory / Testing':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Payment Fees':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Procurement':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#0A0F1D]/90 border border-white/10 shadow-lg space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Recorded Business Expenses
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Operating costs, cold-chain courier fees, lab testing COAs, and payment charges
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenModal}
          className="h-10 px-4 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,217,255,0.3)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Record Expense
        </button>
      </div>

      {/* Expense Table */}
      {expenses.length === 0 ? (
        <div className="py-8 text-center text-slate-500 font-mono text-xs">
          No expenses recorded for the current filter criteria.
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left font-mono text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-slate-400 uppercase tracking-widest bg-slate-950/60">
                <th className="py-3 px-3.5">Date</th>
                <th className="py-3 px-3.5">Expense Name & Category</th>
                <th className="py-3 px-3.5">Store / Batch</th>
                <th className="py-3 px-3.5 text-right">Amount (PHP / USD)</th>
                <th className="py-3 px-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3.5 text-slate-400 font-mono text-xs">
                    {exp.date}
                  </td>
                  <td className="py-3 px-3.5 space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{exp.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getCategoryBadgeClass(
                          exp.category
                        )}`}
                      >
                        {exp.category}
                      </span>
                    </div>
                    {exp.notes && (
                      <div className="text-[11px] text-slate-400 font-sans italic">
                        {exp.notes}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-slate-300">
                    <div className="uppercase font-bold text-[11px] text-[#00D9FF]">
                      {exp.storeType || 'ALL'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {exp.batchNumber || 'General'}
                    </div>
                  </td>
                  <td className="py-3 px-3.5 text-right font-bold text-amber-300">
                    <div>{formatPhp(exp.amountPhp)}</div>
                    <div className="text-[10px] text-slate-400 font-mono font-normal">
                      {formatUsd(exp.amountPhp)}
                    </div>
                  </td>

                  {/* Standardized ACTIONS Dropdown */}
                  <td className="py-3 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                      items={[
                        {
                          label: 'View Details',
                          icon: <Eye className="w-3.5 h-3.5 text-[#00D9FF]" />,
                          onClick: () => setViewExpense(exp),
                        },
                        {
                          label: 'Edit Expense',
                          icon: <Edit className="w-3.5 h-3.5 text-amber-400" />,
                          onClick: () => handleStartEdit(exp),
                        },
                        {
                          divider: true,
                          label: 'Delete Expense',
                          icon: <Trash2 className="w-3.5 h-3.5 text-rose-400" />,
                          variant: 'danger',
                          onClick: () => setDeleteTargetId(exp.id),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Details Modal */}
      {viewExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
          <div className="w-full max-w-md bg-[#070B14] border border-[#00D9FF]/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="p-4 bg-[#0A0F1D] border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">EXPENSE RECORD DETAILS</h3>
              <button
                onClick={() => setViewExpense(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                <div className="text-[10px] text-slate-500">Expense Title</div>
                <div className="font-bold text-white text-sm">{viewExpense.name}</div>
                <div className="text-amber-400 font-bold">{formatPhp(viewExpense.amountPhp)} ({formatUsd(viewExpense.amountPhp)})</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>Category: <strong className="text-white">{viewExpense.category}</strong></div>
                <div>Date: <strong className="text-white">{viewExpense.date}</strong></div>
                <div>Channel: <strong className="text-[#00D9FF]">{viewExpense.storeType || 'ALL'}</strong></div>
                <div>Batch: <strong className="text-white">{viewExpense.batchNumber || 'General'}</strong></div>
              </div>
              {viewExpense.notes && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 italic">
                  "{viewExpense.notes}"
                </div>
              )}
            </div>
            <div className="p-4 bg-[#0A0F1D] border-t border-white/10 flex justify-end">
              <button
                onClick={() => setViewExpense(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {editExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
          <div className="w-full max-w-lg bg-[#070B14] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 bg-[#0A0F1D] border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">EDIT EXPENSE RECORD</h3>
              <button
                onClick={() => setEditExpense(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-5 space-y-3">
              {editFormError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {editFormError}
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Expense Title</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Amount (PHP ₱)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editAmountPhp}
                    onChange={(e) => setEditAmountPhp(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as ExpenseCategory)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-white"
                  >
                    <option value="Shipping">Shipping</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Laboratory / Testing">Laboratory / Testing</option>
                    <option value="Payment Fees">Payment Fees</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Batch</label>
                  <select
                    value={editBatchNumber}
                    onChange={(e) => setEditBatchNumber(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-white"
                  >
                    <option value="all">General (All)</option>
                    <option value="GB-2026-08A">Batch #1 (GB-2026-08A)</option>
                    <option value="GB-2026-08B">Batch #2 (GB-2026-08B)</option>
                    <option value="GB-2026-07C">Batch #3 (GB-2026-07C)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Notes</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditExpense(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
          <div className="w-full max-w-sm bg-[#070B14] border border-rose-500/40 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-bold text-white text-sm">CONFIRM DELETE</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete this expense record? This action will update all profit and margin calculations.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteExpense(deleteTargetId);
                  setDeleteTargetId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs cursor-pointer"
              >
                Delete Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#070B14] border border-[#00D9FF]/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0A0F1D] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF]">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide font-mono">
                    Record New Expense
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Add operational or fulfillment costs to financial calculations
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Expense Name */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-semibold text-slate-300">
                  EXPENSE NAME *
                </label>
                <input
                  type="text"
                  placeholder="e.g. LBC Express Cold-Chain Shipping"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3.5 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00D9FF]"
                />
                <span className="block text-[10px] font-mono text-slate-500">
                  Short descriptive name of the expense item
                </span>
              </div>

              {/* Amount PHP & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-semibold text-slate-300">
                    AMOUNT (PHP ₱) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amountPhp}
                    onChange={(e) => setAmountPhp(e.target.value)}
                    className="w-full h-10 px-3.5 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00D9FF]"
                  />
                  <span className="block text-[10px] font-mono text-slate-500">
                    Amount in Philippine Pesos (₱)
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono font-semibold text-slate-300">
                    DATE RECORDED *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-10 px-3.5 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00D9FF]"
                  />
                  <span className="block text-[10px] font-mono text-slate-500">
                    Transaction date
                  </span>
                </div>
              </div>

              {/* Category & Store */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-mono font-semibold text-slate-300">
                    CATEGORY *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full h-10 px-3.5 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00D9FF]"
                  >
                    <option value="Shipping">Shipping</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Laboratory / Testing">Laboratory / Testing</option>
                    <option value="Payment Fees">Payment Fees</option>
                    <option value="Other">Other</option>
                  </select>
                  <span className="block text-[10px] font-mono text-slate-500">
                    Expense classification
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-mono font-semibold text-slate-300">
                    ASSOCIATED BATCH
                  </label>
                  <select
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full h-10 px-3.5 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00D9FF]"
                  >
                    <option value="all">General (All Batches)</option>
                    <option value="GB-2026-08A">Batch #1 (GB-2026-08A)</option>
                    <option value="GB-2026-08B">Batch #2 (GB-2026-08B)</option>
                    <option value="GB-2026-07C">Batch #3 (GB-2026-07C)</option>
                  </select>
                  <span className="block text-[10px] font-mono text-slate-500">
                    Link expense to batch
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-semibold text-slate-300">
                  NOTES & DETAILS
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional context or invoice reference numbers..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/90 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00D9FF]"
                />
                <span className="block text-[10px] font-mono text-slate-500">
                  Optional administrative reference notes
                </span>
              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,217,255,0.3)]"
                >
                  <Check className="w-4 h-4" />
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

