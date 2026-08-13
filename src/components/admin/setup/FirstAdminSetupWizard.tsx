import React, { useState } from 'react';
import { SetupData } from '../../../types/initialSetup';
import { initialSetupService } from '../../../services/initialSetupService';
import {
  Building2,
  Crown,
  Globe,
  ShoppingBag,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Zap,
  Lock,
  Sparkles,
  X,
} from 'lucide-react';

export interface FirstAdminSetupWizardProps {
  onComplete: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const FirstAdminSetupWizard: React.FC<FirstAdminSetupWizardProps> = ({
  onComplete,
  onCancel,
  isModal = false,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<SetupData>(() => initialSetupService.getSetupData());
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleTextChange = (field: keyof SetupData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValidationError(null);
  };

  const handleStoreToggle = (storeKey: 'groupBuyEnabled' | 'onHandEnabled' | 'moqEnabled') => {
    setFormData((prev) => ({
      ...prev,
      initialStores: {
        ...prev.initialStores,
        [storeKey]: !prev.initialStores[storeKey],
      },
    }));
  };

  const handleNextStep = () => {
    setValidationError(null);

    if (currentStep === 1) {
      if (!formData.companyName.trim() || !formData.brandName.trim()) {
        setValidationError('Company Name and Brand Name are required.');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.ownerName.trim() || !formData.ownerEmail.trim()) {
        setValidationError('Owner Name and Owner Email are required.');
        return;
      }
      if (formData.ownerPassword && formData.ownerPassword !== passwordConfirm) {
        setValidationError('Passwords do not match.');
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinishSetup = async () => {
    setIsSubmitting(true);
    try {
      await initialSetupService.initializeSystem(formData);
      setIsSubmitting(false);
      onComplete();
    } catch {
      setIsSubmitting(false);
      setValidationError('Failed to complete setup initialization.');
    }
  };

  const wizardContainerClasses = isModal
    ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn'
    : 'w-full';

  const cardInnerClasses =
    'glass-card p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0A0F1D]/95 shadow-2xl relative max-w-2xl w-full mx-auto space-y-6';

  return (
    <div className={wizardContainerClasses}>
      <div className={cardInnerClasses}>
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9FF] to-[#8B5CF6] p-0.5 shadow-[0_0_15px_rgba(0,217,255,0.4)]">
              <div className="w-full h-full bg-[#050810] rounded-[10px] flex items-center justify-center text-[#00D9FF]">
                <Zap size={20} />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">First Admin Setup Wizard</h2>
              <p className="text-xs text-slate-400">Initialize GKN V2 System Parameters & Super Admin Credentials</p>
            </div>
          </div>

          {isModal && onCancel && (
            <button
              onClick={onCancel}
              className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Step Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#00D9FF] font-bold">STEP {currentStep} OF 5</span>
            <span className="text-slate-400">
              {currentStep === 1 && 'Company & Brand'}
              {currentStep === 2 && 'Owner & Governance'}
              {currentStep === 3 && 'Localization'}
              {currentStep === 4 && 'Initial Stores'}
              {currentStep === 5 && 'Finish & Verify'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00D9FF] via-[#8B5CF6] to-[#FF2ED1] transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Validation Error Alert */}
        {validationError && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono flex items-center space-x-2">
            <Lock size={14} className="text-red-400 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Step 1: Company & Brand Identity */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center space-x-2 text-[#00D9FF] text-xs font-bold font-mono">
              <Building2 size={16} />
              <span>COMPANY & BRAND IDENTIFICATION</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Legal Entity / Company Name <span className="text-[#FF2ED1]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleTextChange('companyName', e.target.value)}
                  placeholder="e.g., GKN Bio-Analytical Research Laboratories Ltd."
                  className="w-full bg-[#050810] border border-white/10 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#00D9FF]"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Official corporate entity name used for order invoices and legal disclaimers
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Public Brand Name <span className="text-[#FF2ED1]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => handleTextChange('brandName', e.target.value)}
                  placeholder="e.g., GKN Research"
                  className="w-full bg-[#050810] border border-white/10 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#00D9FF]"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Storefront header brand title shown on public customer pages
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Owner & Governance Account */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center space-x-2 text-[#FF2ED1] text-xs font-bold font-mono">
              <Crown size={16} />
              <span>ROOT OWNER & SUPER ADMIN ACCOUNT</span>
            </div>

            <div className="p-3 bg-[#FF2ED1]/10 border border-[#FF2ED1]/30 rounded-xl text-xs text-slate-300">
              The Owner account created here is designated as the primary Super Admin with root permission override authority.
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Owner Full Name <span className="text-[#FF2ED1]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => handleTextChange('ownerName', e.target.value)}
                  placeholder="e.g., Dr. Alexander Vance"
                  className="w-full bg-[#050810] border border-white/10 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Owner Email Address <span className="text-[#FF2ED1]">*</span>
                </label>
                <input
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) => handleTextChange('ownerEmail', e.target.value)}
                  placeholder="e.g., owner@gkn.research"
                  className="w-full bg-[#050810] border border-white/10 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Master Password (Optional)
                  </label>
                  <input
                    type="password"
                    value={formData.ownerPassword || ''}
                    onChange={(e) => handleTextChange('ownerPassword', e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#050810] border border-white/10 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#00D9FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#050810] border border-white/10 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#00D9FF]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Regional & Localization Defaults */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center space-x-2 text-[#8B5CF6] text-xs font-bold font-mono">
              <Globe size={16} />
              <span>REGIONAL & LOCALIZATION DEFAULTS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Default Currency</label>
                <select
                  value={formData.defaultCurrency}
                  onChange={(e) => handleTextChange('defaultCurrency', e.target.value)}
                  className="w-full bg-[#050810] border border-white/10 text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#00D9FF]"
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="PHP (₱)">PHP (₱)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Default Timezone</label>
                <select
                  value={formData.defaultTimezone}
                  onChange={(e) => handleTextChange('defaultTimezone', e.target.value)}
                  className="w-full bg-[#050810] border border-white/10 text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#00D9FF]"
                >
                  <option value="Asia/Manila (UTC+8)">Asia/Manila (UTC+8)</option>
                  <option value="UTC">UTC (Universal)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Default Language</label>
                <select
                  value={formData.defaultLanguage}
                  onChange={(e) => handleTextChange('defaultLanguage', e.target.value)}
                  className="w-full bg-[#050810] border border-white/10 text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#00D9FF]"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="English (UK)">English (UK)</option>
                  <option value="Filipino (PH)">Filipino (PH)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Initial Store Configuration */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center space-x-2 text-[#00D9FF] text-xs font-bold font-mono">
              <ShoppingBag size={16} />
              <span>INITIAL STORE MODULES & VISIBILITY</span>
            </div>

            <p className="text-xs text-slate-400">
              Select which storefront sales channels are active upon system launch. You can modify these settings anytime in Admin Settings.
            </p>

            <div className="space-y-3">
              {/* GroupBuy Store */}
              <div
                onClick={() => handleStoreToggle('groupBuyEnabled')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  formData.initialStores.groupBuyEnabled
                    ? 'border-[#00D9FF] bg-[#00D9FF]/10'
                    : 'border-white/10 bg-white/5 opacity-60'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">GroupBuy Batch Store</h4>
                  <p className="text-[11px] text-slate-400">Batch manufacturing pre-orders with group progress meters</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.initialStores.groupBuyEnabled}
                  onChange={() => {}}
                  className="rounded border-white/20 bg-slate-900 text-[#00D9FF] focus:ring-[#00D9FF]"
                />
              </div>

              {/* OnHand Store */}
              <div
                onClick={() => handleStoreToggle('onHandEnabled')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  formData.initialStores.onHandEnabled
                    ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
                    : 'border-white/10 bg-white/5 opacity-60'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">OnHand Ready-Stock Store</h4>
                  <p className="text-[11px] text-slate-400">Immediate dispatch inventory catalog with live stock counts</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.initialStores.onHandEnabled}
                  onChange={() => {}}
                  className="rounded border-white/20 bg-slate-900 text-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
              </div>

              {/* MOQ Store */}
              <div
                onClick={() => handleStoreToggle('moqEnabled')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  formData.initialStores.moqEnabled
                    ? 'border-[#FF2ED1] bg-[#FF2ED1]/10'
                    : 'border-white/10 bg-white/5 opacity-60'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">MOQ Volume Wholesale Store</h4>
                  <p className="text-[11px] text-slate-400">Minimum order quantity tier pricing for bulk laboratory orders</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.initialStores.moqEnabled}
                  onChange={() => {}}
                  className="rounded border-white/20 bg-slate-900 text-[#FF2ED1] focus:ring-[#FF2ED1]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Finish Setup & Verification Summary */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold font-mono">
              <Sparkles size={16} />
              <span>FINISH SETUP & SYSTEM INITIALIZATION</span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-slate-400">Company Name:</span>
                <span className="text-white font-bold">{formData.companyName}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-slate-400">Brand Name:</span>
                <span className="text-[#00D9FF] font-bold">{formData.brandName}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-slate-400">Super Admin Email:</span>
                <span className="text-[#FF2ED1] font-bold">{formData.ownerEmail}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-slate-400">Localization:</span>
                <span className="text-white">{formData.defaultCurrency} • {formData.defaultTimezone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Stores:</span>
                <span className="text-emerald-400 font-bold">
                  {[
                    formData.initialStores.groupBuyEnabled && 'GroupBuy',
                    formData.initialStores.onHandEnabled && 'OnHand',
                    formData.initialStores.moqEnabled && 'MOQ',
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Action Controls */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] text-white font-bold text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(0,217,255,0.3)] hover:brightness-110 cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishSetup}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] via-[#8B5CF6] to-[#FF2ED1] text-white font-bold text-xs flex items-center space-x-2 shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:brightness-110 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle size={16} />
              <span>{isSubmitting ? 'Initializing System...' : 'Finish & Activate Admin Portal'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
