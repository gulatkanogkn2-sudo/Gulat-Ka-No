import React from 'react';
import { User, Mail, Phone, FileText, CreditCard, Building2 } from 'lucide-react';
import {
  CustomerInfo,
  ShippingAddress,
  PaymentMethodOption,
  PaymentProofFile,
  StoreType,
} from '../../types/checkout';
import { DEFAULT_CUSTOMER_FIELDS } from '../../services/checkoutService';
import { CheckoutAccessory } from '../../types/checkout';
import { AddressSelector } from './AddressSelector';
import { PaymentMethodCard } from './PaymentMethodCard';
import { PaymentUploader } from './PaymentUploader';
import { AccessoriesSelector } from './AccessoriesSelector';
import { ValidationMessage } from './ValidationMessage';

interface CheckoutFormProps {
  storeType?: StoreType | string;
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (info: CustomerInfo) => void;
  selectedAddress: ShippingAddress;
  onAddressChange: (address: ShippingAddress) => void;
  selectedPaymentMethod: PaymentMethodOption | null;
  onPaymentMethodChange: (method: PaymentMethodOption) => void;
  paymentProof: PaymentProofFile;
  onPaymentProofChange: (proof: PaymentProofFile) => void;
  orderNotes: string;
  onOrderNotesChange: (notes: string) => void;
  totalVialsCount: number;
  totalKitsCount?: number;
  selectedAccessoriesState: Record<string, number>;
  onAccessoryQuantityChange: (accessoryId: string, quantity: number) => void;
  onOpenQrModal: (method: PaymentMethodOption) => void;
  validationError: string | null;
  paymentMethods?: PaymentMethodOption[];
  savedAddresses?: ShippingAddress[];
  accessories?: CheckoutAccessory[];
  className?: string;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  storeType,
  customerInfo,
  onCustomerInfoChange,
  selectedAddress,
  onAddressChange,
  selectedPaymentMethod,
  onPaymentMethodChange,
  paymentProof,
  onPaymentProofChange,
  orderNotes,
  onOrderNotesChange,
  totalVialsCount,
  totalKitsCount = 1,
  selectedAccessoriesState,
  onAccessoryQuantityChange,
  onOpenQrModal,
  validationError,
  paymentMethods = [],
  savedAddresses = [],
  accessories = [],
  className = '',
}) => {
  const handleCustomerFieldChange = (field: string, value: string) => {
    onCustomerInfoChange({ ...customerInfo, [field]: value });
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Validation Message Display */}
      {validationError && (
        <ValidationMessage type="error" message={validationError} className="animate-fadeIn" />
      )}

      {/* 1. Customer Information Panel (Configurable Field Definitions) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <User className="w-4 h-4 text-[#00D9FF]" />
            1. Customer Information
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Form Builder Ready</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 rounded-xl bg-[#090D16]/90 border border-white/10">
          {DEFAULT_CUSTOMER_FIELDS.filter((f) => f.visible).map((field) => {
            const isFullWidth = field.name === 'fullName' || field.type === 'textarea';
            return (
              <div
                key={field.id}
                className={`space-y-1 ${isFullWidth ? 'sm:col-span-2' : ''}`}
              >
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  {field.label} {field.required && <span className="text-red-400">*</span>}
                </label>
                <div className="relative">
                  {field.name === 'email' ? (
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  ) : field.name === 'phone' ? (
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  ) : field.name === 'companyOrInstitution' ? (
                    <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  ) : (
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  )}
                  <input
                    type={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
                    value={customerInfo[field.name] || ''}
                    onChange={(e) => handleCustomerFieldChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-black/60 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:border-[#00D9FF] focus:outline-none transition-colors"
                    required={field.required}
                  />
                </div>
                {field.helpText && (
                  <p className="text-[10px] text-slate-500 font-mono pt-0.5">{field.helpText}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Destination Address Selector */}
      <AddressSelector
        selectedAddress={selectedAddress}
        onChange={onAddressChange}
        savedAddresses={savedAddresses}
      />

      {/* 3. Settlement & Payment Method Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#00D9FF]" />
            3. Settlement & Payment Method
          </h3>
          <span className="text-[10px] font-mono text-slate-400">P2P Direct Clearing</span>
        </div>

        <div className="space-y-3">
          {paymentMethods.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 text-slate-400 text-xs font-mono text-center">
              No active payment methods available. Please contact support or administrator.
            </div>
          ) : (
            paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                isSelected={selectedPaymentMethod?.id === method.id}
                onSelect={() => onPaymentMethodChange(method)}
                onOpenQrModal={onOpenQrModal}
              />
            ))
          )}
        </div>
      </div>

      {/* 4. Accessories Selector */}
      <AccessoriesSelector
        accessories={accessories}
        storeType={storeType}
        totalVialsCount={totalVialsCount}
        totalKitsCount={totalKitsCount}
        selectedAccessoriesState={selectedAccessoriesState}
        onAccessoryQuantityChange={onAccessoryQuantityChange}
      />

      {/* 5. Payment Proof Upload (Mandatory) */}
      <PaymentUploader
        paymentProof={paymentProof}
        onChange={onPaymentProofChange}
      />

      {/* 6. Order Notes (Optional) */}
      <div className="space-y-2">
        <label className="block text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#00D9FF]" />
          6. Order & Delivery Instructions (Optional)
        </label>
        <textarea
          value={orderNotes}
          onChange={(e) => onOrderNotesChange(e.target.value)}
          placeholder="Specify any special delivery requests, address landmarks, or gate pass requirements..."
          rows={3}
          className="w-full bg-[#090D16]/90 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 font-mono focus:border-[#00D9FF] focus:outline-none transition-colors"
        />
      </div>
    </div>
  );
};

