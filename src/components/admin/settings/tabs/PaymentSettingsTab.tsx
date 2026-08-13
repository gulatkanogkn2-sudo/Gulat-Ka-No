import React, { useState } from 'react';
import {
  PaymentSettings,
  ConfigurablePaymentMethod,
  PaymentMethodType,
} from '../../../../types/systemSettings';
import { SettingInput } from '../common/SettingInput';
import { SettingSelect } from '../common/SettingSelect';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { MediaLibraryPickerModal } from '../common/MediaLibraryPickerModal';
import { Button } from '../../../common/Button';
import { Badge } from '../../../common/Badge';
import {
  Plus,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Smartphone,
  Landmark,
  Coins,
  CreditCard,
  QrCode,
  Image as ImageIcon,
  AlertTriangle,
  X,
  Check,
  Layers,
  Power,
} from 'lucide-react';

export interface PaymentSettingsTabProps {
  settings: PaymentSettings;
  onChange: (updated: PaymentSettings) => void;
}

export const PaymentSettingsTab: React.FC<PaymentSettingsTabProps> = ({ settings, onChange }) => {
  // Ensure methods array is available
  const methods: ConfigurablePaymentMethod[] = Array.isArray(settings.methods) ? settings.methods : [];

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ConfigurablePaymentMethod | null>(null);
  const [formData, setFormData] = useState<Partial<ConfigurablePaymentMethod>>({
    methodType: 'E_WALLET',
    displayName: '',
    subtitle: '',
    enabled: true,
    providerBrand: '',
    accountName: '',
    accountNumber: '',
    bankName: '',
    branchDetails: '',
    asset: '',
    network: '',
    recipientDetails: '',
    instructions: '',
    accent: 'cyan',
    badge: 'INSTANT',
    requiresProof: true,
  });

  // Media Library Modal
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Delete Confirmation Modal
  const [deletingMethod, setDeletingMethod] = useState<ConfigurablePaymentMethod | null>(null);

  // Validation Error State
  const [formError, setFormError] = useState<string | null>(null);

  // Open modal for creating a new method
  const handleOpenAddModal = () => {
    setEditingMethod(null);
    setFormData({
      methodType: 'E_WALLET',
      displayName: '',
      subtitle: '',
      enabled: true,
      providerBrand: '',
      accountName: '',
      accountNumber: '',
      bankName: '',
      branchDetails: '',
      asset: 'USDT',
      network: '',
      recipientDetails: '',
      instructions: '',
      accent: 'cyan',
      badge: 'INSTANT',
      requiresProof: true,
      sortOrder: methods.length + 1,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing method
  const handleOpenEditModal = (method: ConfigurablePaymentMethod) => {
    setEditingMethod(method);
    setFormData({ ...method });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle Save (Add / Update)
  const handleSaveMethod = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.displayName || !formData.displayName.trim()) {
      setFormError('Display Payment Method Title is required.');
      return;
    }

    // Validation based on type
    const mType = formData.methodType || 'E_WALLET';
    if (mType === 'E_WALLET') {
      if (!formData.providerBrand?.trim()) {
        setFormError('Provider / Brand Name (e.g., GCash, Maya) is required for E-Wallets.');
        return;
      }
      if (!formData.accountName?.trim()) {
        setFormError('Account Registered Name is required.');
        return;
      }
      if (!formData.accountNumber?.trim()) {
        setFormError('Mobile / Account Number is required.');
        return;
      }
    } else if (mType === 'BANK_TRANSFER') {
      if (!formData.bankName?.trim()) {
        setFormError('Bank Name (e.g., BDO Unibank, BPI) is required.');
        return;
      }
      if (!formData.accountName?.trim()) {
        setFormError('Account Name is required.');
        return;
      }
      if (!formData.accountNumber?.trim()) {
        setFormError('Bank Account Number is required.');
        return;
      }
    } else if (mType === 'CRYPTOCURRENCY') {
      if (!formData.asset?.trim()) {
        setFormError('Cryptocurrency Asset (e.g., USDT, BTC) is required.');
        return;
      }
      if (!formData.accountNumber?.trim()) {
        setFormError('Wallet Address is required.');
        return;
      }
    } else if (mType === 'CUSTOM') {
      if (!formData.accountName?.trim() && !formData.recipientDetails?.trim()) {
        setFormError('Recipient / Account Details are required for custom methods.');
        return;
      }
    }

    let updatedMethods: ConfigurablePaymentMethod[];

    if (editingMethod) {
      // Update existing
      updatedMethods = methods.map((m) =>
        m.id === editingMethod.id
          ? ({
              ...m,
              ...formData,
              updatedAt: new Date().toISOString(),
            } as ConfigurablePaymentMethod)
          : m
      );
    } else {
      // Create new
      const newMethod: ConfigurablePaymentMethod = {
        id: `pay_${Date.now()}`,
        methodType: mType,
        displayName: formData.displayName.trim(),
        subtitle: formData.subtitle?.trim() || '',
        description: formData.description?.trim() || '',
        enabled: formData.enabled ?? true,
        sortOrder: methods.length + 1,
        providerBrand: formData.providerBrand?.trim(),
        accountName: formData.accountName?.trim(),
        accountNumber: formData.accountNumber?.trim(),
        bankName: formData.bankName?.trim(),
        branchDetails: formData.branchDetails?.trim(),
        asset: formData.asset?.trim(),
        network: formData.network?.trim(),
        recipientDetails: formData.recipientDetails?.trim(),
        qrCodeMediaId: formData.qrCodeMediaId,
        qrCodeUrl: formData.qrCodeUrl,
        instructions: formData.instructions?.trim() || '',
        accent: formData.accent || 'cyan',
        badge: formData.badge?.trim() || 'INSTANT',
        requiresProof: formData.requiresProof ?? true,
        availableStores: ['all'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedMethods = [...methods, newMethod];
    }

    // Re-index sort order
    updatedMethods = updatedMethods.map((m, idx) => ({ ...m, sortOrder: idx + 1 }));

    onChange({
      ...settings,
      methods: updatedMethods,
    });

    setIsModalOpen(false);
  };

  // Toggle Enable / Disable Status
  const handleToggleEnable = (methodId: string, enabled: boolean) => {
    const updatedMethods = methods.map((m) => (m.id === methodId ? { ...m, enabled } : m));
    onChange({
      ...settings,
      methods: updatedMethods,
    });
  };

  // Move Up in Sort Order
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newMethods = [...methods];
    const temp = newMethods[index];
    newMethods[index] = newMethods[index - 1];
    newMethods[index - 1] = temp;

    const reindexed = newMethods.map((m, idx) => ({ ...m, sortOrder: idx + 1 }));
    onChange({
      ...settings,
      methods: reindexed,
    });
  };

  // Move Down in Sort Order
  const handleMoveDown = (index: number) => {
    if (index === methods.length - 1) return;
    const newMethods = [...methods];
    const temp = newMethods[index];
    newMethods[index] = newMethods[index + 1];
    newMethods[index + 1] = temp;

    const reindexed = newMethods.map((m, idx) => ({ ...m, sortOrder: idx + 1 }));
    onChange({
      ...settings,
      methods: reindexed,
    });
  };

  // Delete Confirmation Handler
  const handleConfirmDelete = () => {
    if (!deletingMethod) return;
    const updatedMethods = methods
      .filter((m) => m.id !== deletingMethod.id)
      .map((m, idx) => ({ ...m, sortOrder: idx + 1 }));

    onChange({
      ...settings,
      methods: updatedMethods,
    });

    setDeletingMethod(null);
  };

  // Get Type Icon
  const getTypeIcon = (type: PaymentMethodType) => {
    switch (type) {
      case 'E_WALLET':
        return <Smartphone className="w-5 h-5 text-[#00D9FF]" />;
      case 'BANK_TRANSFER':
        return <Landmark className="w-5 h-5 text-[#8B5CF6]" />;
      case 'CRYPTOCURRENCY':
        return <Coins className="w-5 h-5 text-[#FF2ED1]" />;
      case 'CUSTOM':
      default:
        return <CreditCard className="w-5 h-5 text-[#10B981]" />;
    }
  };

  // Get Type Label
  const getTypeLabel = (type: PaymentMethodType) => {
    switch (type) {
      case 'E_WALLET':
        return 'E-Wallet';
      case 'BANK_TRANSFER':
        return 'Bank Transfer';
      case 'CRYPTOCURRENCY':
        return 'Cryptocurrency';
      case 'CUSTOM':
        return 'Custom Method';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-5 rounded-2xl bg-[#090D16]/90 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#00D9FF]" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              PAYMENT METHODS MANAGER
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Configure dynamic payment methods available to customers during checkout. Add, edit, reorder, or disable methods seamlessly.
          </p>
        </div>

        <Button
          onClick={handleOpenAddModal}
          variant="cyan"
          size="sm"
          className="font-mono text-xs font-bold uppercase flex items-center gap-1.5 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Payment Method</span>
        </Button>
      </div>

      {/* Methods List */}
      {methods.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#090D16]/80 border border-white/10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
            <Layers className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase">No Payment Methods Configured</h3>
            <p className="text-xs text-slate-400 font-mono mt-1 max-w-md mx-auto">
              There are no payment methods configured. Customers will not be able to complete checkout until at least one payment method is added and enabled.
            </p>
          </div>
          <Button
            onClick={handleOpenAddModal}
            variant="cyan"
            size="sm"
            className="font-mono text-xs font-bold uppercase inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Payment Method</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {methods.map((method, index) => {
            return (
              <div
                key={method.id}
                className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  method.enabled
                    ? 'bg-[#090D16]/90 border-white/10 hover:border-white/20'
                    : 'bg-[#050810]/60 border-white/5 opacity-75'
                }`}
              >
                {/* Method Header & Row Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex-shrink-0">
                      {getTypeIcon(method.methodType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white font-mono">{method.displayName}</h3>
                        <Badge
                          variant={
                            method.accent === 'cyan'
                              ? 'cyan'
                              : method.accent === 'purple'
                              ? 'purple'
                              : method.accent === 'magenta'
                              ? 'magenta'
                              : 'green'
                          }
                          className="text-[10px] px-2 py-0.5"
                        >
                          {getTypeLabel(method.methodType)}
                        </Badge>
                        {method.badge && (
                          <span className="text-[9px] font-mono font-bold bg-white/10 text-slate-300 px-2 py-0.5 rounded border border-white/10">
                            {method.badge}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                            method.enabled
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-slate-800/80 border-slate-700 text-slate-400'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          {method.enabled ? 'ACTIVE' : 'DISABLED'}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">
                        {method.subtitle || method.description || 'No subtitle provided'}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 cursor-pointer transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={index === methods.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 cursor-pointer transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Toggle Status */}
                    <button
                      type="button"
                      onClick={() => handleToggleEnable(method.id, !method.enabled)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer border flex items-center gap-1 ${
                        method.enabled
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                      }`}
                    >
                      {method.enabled ? 'Disable' : 'Enable'}
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(method)}
                      className="px-3 py-1.5 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF]/20 text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeletingMethod(method)}
                      className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                      title="Delete Payment Method"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Method Summary Body */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  {/* Account / Recipient Box */}
                  <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                    <span className="text-slate-400 block font-semibold text-[11px]">ACCOUNT DETAILS:</span>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account Name:</span>
                      <span className="text-white font-bold">{method.accountName || method.recipientDetails || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        {method.methodType === 'BANK_TRANSFER'
                          ? 'Account Number'
                          : method.methodType === 'CRYPTOCURRENCY'
                          ? 'Wallet Address'
                          : 'Mobile Number'}
                        :
                      </span>
                      <span className="text-[#00D9FF] font-bold truncate max-w-[150px]" title={method.accountNumber}>
                        {method.accountNumber || 'N/A'}
                      </span>
                    </div>
                    {(method.bankName || method.asset || method.providerBrand) && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Provider/Network:</span>
                        <span className="text-slate-200">
                          {method.methodType === 'BANK_TRANSFER'
                            ? `${method.bankName || ''} ${method.branchDetails ? `(${method.branchDetails})` : ''}`
                            : method.methodType === 'CRYPTOCURRENCY'
                            ? `${method.asset || ''} (${method.network || 'TRC20'})`
                            : method.providerBrand || 'Direct'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* QR Code Asset Box */}
                  <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-900 border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {method.qrCodeUrl ? (
                          <img src={method.qrCodeUrl} alt="QR Thumbnail" className="w-full h-full object-cover" />
                        ) : (
                          <QrCode className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <span className="text-white font-bold block text-xs">QR Code Asset</span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {method.qrCodeMediaId ? `Media ID: ${method.qrCodeMediaId}` : 'No QR Attached'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Instructions Preview */}
                  <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                    <span className="text-slate-400 block font-semibold text-[11px]">PAYMENT INSTRUCTIONS:</span>
                    <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                      {method.instructions || 'No special instructions provided.'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#090D16] border border-white/20 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#090D16]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                    {editingMethod ? 'EDIT PAYMENT METHOD' : 'ADD NEW PAYMENT METHOD'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Configure account coordinates and settlement rules.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body (Scrollable) */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form id="payment-method-form" onSubmit={handleSaveMethod} className="space-y-6">
                {/* Section 1: Core Type & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                  <SettingSelect
                    label="Payment Method Type"
                    value={formData.methodType || 'E_WALLET'}
                    options={[
                      { value: 'E_WALLET', label: 'E-Wallet (GCash, Maya, GrabPay)' },
                      { value: 'BANK_TRANSFER', label: 'Bank Transfer (BDO, BPI, UnionBank)' },
                      { value: 'CRYPTOCURRENCY', label: 'Cryptocurrency (USDT, BTC, ETH)' },
                      { value: 'CUSTOM', label: 'Custom Method (Check, Counter, Custom)' },
                    ]}
                    onChange={(val) => setFormData({ ...formData, methodType: val as PaymentMethodType })}
                    helperText="Select structural category for formatting recipient inputs."
                  />

                  <div className="flex flex-col space-y-1.5 w-full">
                    <div className="flex items-center justify-between min-h-[22px]">
                      <label className="text-xs font-semibold text-slate-300 leading-snug">
                        Status Toggle
                      </label>
                    </div>
                    <div className="h-10 px-3.5 bg-[#050810] border border-white/10 rounded-xl flex items-center justify-between w-full">
                      <span className="text-xs font-mono text-slate-300">Available at Checkout</span>
                      <ToggleSwitch
                        checked={formData.enabled ?? true}
                        onChange={(val) => setFormData({ ...formData, enabled: val })}
                        label={formData.enabled ? 'Enabled' : 'Disabled'}
                        activeColor="cyan"
                      />
                    </div>
                    <div className="min-h-[16px]">
                      <p className="text-[11px] font-mono text-slate-500 leading-tight">
                        Disabled methods will be hidden from customer checkout.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Display Titles & Description */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                  <SettingInput
                    label="Display Payment Method Title"
                    value={formData.displayName || ''}
                    onChange={(val) => setFormData({ ...formData, displayName: val })}
                    helperText="Primary header text shown to buyers in checkout."
                    exampleText="GCash Instant Transfer"
                  />
                  <SettingInput
                    label="Subtitle / Short Description"
                    value={formData.subtitle || ''}
                    onChange={(val) => setFormData({ ...formData, subtitle: val })}
                    helperText="Sub-label displayed right below method title."
                    exampleText="Direct mobile wallet settlement"
                  />
                </div>

                {/* Section 3: Badge & Accent */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                  <SettingInput
                    label="Badge Label (Optional)"
                    value={formData.badge || ''}
                    onChange={(val) => setFormData({ ...formData, badge: val })}
                    helperText="Small promotional tag shown next to title."
                    exampleText="FAST DISPATCH, INSTANT, SECURE B2B"
                  />
                  <SettingSelect
                    label="Accent Color"
                    value={formData.accent || 'cyan'}
                    options={[
                      { value: 'cyan', label: 'Electric Cyan (#00D9FF)' },
                      { value: 'purple', label: 'Deep Purple (#8B5CF6)' },
                      { value: 'magenta', label: 'Neon Pink (#FF2ED1)' },
                      { value: 'green', label: 'Emerald Green (#10B981)' },
                    ]}
                    onChange={(val) => setFormData({ ...formData, accent: val as any })}
                    helperText="Visual outline theme when selected by buyer."
                  />
                </div>

                {/* Section 4: Type Specific Fields */}
                <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-5">
                  <h4 className="text-xs font-bold text-[#00D9FF] font-mono uppercase tracking-wider border-b border-white/10 pb-2.5">
                    {getTypeLabel(formData.methodType || 'E_WALLET')} Specific Details
                  </h4>

                  {formData.methodType === 'E_WALLET' && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                        <SettingInput
                          label="E-Wallet Provider Brand"
                          value={formData.providerBrand || ''}
                          onChange={(val) => setFormData({ ...formData, providerBrand: val })}
                          helperText="Brand name for icon / identification."
                          exampleText="GCash, Maya, GrabPay"
                        />
                        <SettingInput
                          label="Account Registered Name"
                          value={formData.accountName || ''}
                          onChange={(val) => setFormData({ ...formData, accountName: val })}
                          helperText="Official account holder name."
                          exampleText="GKN RESEARCH OFFICIAL"
                        />
                      </div>
                      <SettingInput
                        label="Mobile / E-Wallet Number"
                        value={formData.accountNumber || ''}
                        onChange={(val) => setFormData({ ...formData, accountNumber: val })}
                        helperText="Phone number or wallet identifier buyers copy."
                        exampleText="0917-888-9900"
                      />
                    </div>
                  )}

                  {formData.methodType === 'BANK_TRANSFER' && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                        <SettingInput
                          label="Bank Name"
                          value={formData.bankName || ''}
                          onChange={(val) => setFormData({ ...formData, bankName: val })}
                          helperText="Full bank name."
                          exampleText="BDO Unibank, BPI, UnionBank"
                        />
                        <SettingInput
                          label="Account Registered Name"
                          value={formData.accountName || ''}
                          onChange={(val) => setFormData({ ...formData, accountName: val })}
                          helperText="Corporate or account holder name."
                          exampleText="GKN PHARMACEUTICAL CORP"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                        <SettingInput
                          label="Bank Account Number"
                          value={formData.accountNumber || ''}
                          onChange={(val) => setFormData({ ...formData, accountNumber: val })}
                          helperText="Exact bank account number."
                          exampleText="0045-8819-2041"
                        />
                        <SettingInput
                          label="Branch / Details (Optional)"
                          value={formData.branchDetails || ''}
                          onChange={(val) => setFormData({ ...formData, branchDetails: val })}
                          helperText="Branch location or swift code."
                          exampleText="Commercial Branch, Makati"
                        />
                      </div>
                    </div>
                  )}

                  {formData.methodType === 'CRYPTOCURRENCY' && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                        <SettingInput
                          label="Cryptocurrency Asset"
                          value={formData.asset || ''}
                          onChange={(val) => setFormData({ ...formData, asset: val })}
                          helperText="Asset symbol."
                          exampleText="USDT, BTC, ETH"
                        />
                        <SettingInput
                          label="Blockchain Network"
                          value={formData.network || ''}
                          onChange={(val) => setFormData({ ...formData, network: val })}
                          helperText="Supported network string."
                          exampleText="TRC20, ERC20, Polygon"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                        <SettingInput
                          label="Wallet Receiver Address"
                          value={formData.accountNumber || ''}
                          onChange={(val) => setFormData({ ...formData, accountNumber: val })}
                          helperText="Exact crypto deposit address."
                          exampleText="T9xGkn2026LabVaultUSDT394"
                        />
                        <SettingInput
                          label="Account / Treasury Identifier"
                          value={formData.accountName || ''}
                          onChange={(val) => setFormData({ ...formData, accountName: val })}
                          helperText="Internal wallet alias."
                          exampleText="GKN Cold Vault (TRC20)"
                        />
                      </div>
                    </div>
                  )}

                  {formData.methodType === 'CUSTOM' && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                        <SettingInput
                          label="Recipient Name / Payee"
                          value={formData.accountName || ''}
                          onChange={(val) => setFormData({ ...formData, accountName: val })}
                          helperText="Payee or beneficiary name."
                          exampleText="Payable to GKN Trading"
                        />
                        <SettingInput
                          label="Account / Order Identifier"
                          value={formData.accountNumber || ''}
                          onChange={(val) => setFormData({ ...formData, accountNumber: val })}
                          helperText="Identifier code or phone number."
                          exampleText="REF-GKN-CUSTOM-PAY"
                        />
                      </div>
                    </div>
                  )}

                  {/* QR Code Media Selector */}
                  <div className="p-3.5 bg-black/60 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-slate-900 border border-white/20 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {formData.qrCodeUrl ? (
                          <img src={formData.qrCodeUrl} alt="QR Code" className="w-full h-full object-cover" />
                        ) : (
                          <QrCode className="text-slate-600" size={20} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white font-mono block truncate">
                          QR Code Image Asset (Media Library)
                        </span>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                          Media ID: {formData.qrCodeMediaId || 'Not attached'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 border border-[#00D9FF]/30 text-[#00D9FF] text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <ImageIcon size={14} />
                      <span>Select Media</span>
                    </button>
                  </div>

                  {/* Instructions Textarea */}
                  <div className="flex flex-col space-y-1.5 w-full">
                    <div className="flex items-center justify-between min-h-[22px]">
                      <label className="text-xs font-semibold text-slate-300 leading-snug">
                        Customer Payment Instructions
                      </label>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.instructions || ''}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                      placeholder="Instructions displayed to buyers during checkout settlement..."
                      className="w-full bg-[#050810] border border-white/10 text-white text-xs p-3.5 rounded-xl focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] transition-all resize-y min-h-[72px]"
                    />
                    <div className="min-h-[16px]">
                      <p className="text-[11px] font-mono text-slate-500 leading-tight">
                        Clear guidance on upload proof or transfer process.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-5 sm:p-6 border-t border-white/10 bg-[#090D16] flex flex-col-reverse sm:flex-row items-center justify-end gap-3 shrink-0">
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto border-white/20 text-slate-300 hover:bg-white/10 font-mono text-xs uppercase"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="payment-method-form"
                variant="cyan"
                size="sm"
                className="w-full sm:w-auto font-mono text-xs font-bold uppercase flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{editingMethod ? 'Save Changes' : 'Create Payment Method'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#090D16] border border-red-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold font-mono text-white">DELETE PAYMENT METHOD?</h3>
                <p className="text-xs font-mono text-slate-400">Confirm permanent deletion of configuration record.</p>
              </div>
            </div>

            <p className="text-xs font-mono text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">{deletingMethod.displayName}</strong>?
              This will remove it from the payment manager configuration. Existing historical orders will retain their payment logs intact.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                onClick={() => setDeletingMethod(null)}
                variant="outline"
                size="sm"
                className="border-white/20 text-slate-300 font-mono text-xs uppercase"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                variant="danger"
                size="sm"
                className="font-mono text-xs font-bold uppercase flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Method</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media Library Picker Modal */}
      {isMediaPickerOpen && (
        <MediaLibraryPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          currentMediaId={formData.qrCodeMediaId}
          onSelect={(media) => {
            setFormData({
              ...formData,
              qrCodeMediaId: media.id,
              qrCodeUrl: media.url,
            });
            setIsMediaPickerOpen(false);
          }}
        />
      )}
    </div>
  );
};
