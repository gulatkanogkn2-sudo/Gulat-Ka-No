import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { Button } from '../../components/common/Button';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { StoreType } from '../../types';
import {
  CustomerInfo,
  ShippingAddress,
  PaymentMethodOption,
  PaymentProofFile,
  OrderSubmissionResult,
} from '../../types/checkout';
import {
  CheckoutService,
} from '../../services/checkoutService';
import { loadProductionCheckoutConfig } from '../../services/productionService';
import { CheckoutAccessory } from '../../types/checkout';
import { accessoryService } from '../../services/accessoryService';
import { convertPhpToUsd, convertUsdToPhp } from '../../utils/currencyUtils';
import { CheckoutForm } from '../../components/checkout/CheckoutForm';
import { CheckoutSidebar } from '../../components/checkout/CheckoutSidebar';
import { SuccessModal } from '../../components/checkout/SuccessModal';
import { QrCodeModal } from '../../components/checkout/QrCodeModal';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { activeStore, getCartForStore, clearCart } = useCart();
  const { user } = useAuth();

  const checkoutStore: StoreType = (searchParams.get('store') as StoreType) || activeStore || 'groupbuy';
  const storeSummary = getCartForStore(checkoutStore);
  const { items, estimatedDiscount } = storeSummary;

  // Customer Info State (Auto-fill from user account when available)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    companyOrInstitution: '',
  });

  // Shipping Address State
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress>({ recipientName: '', phone: '', addressLine1: '', city: '', province: '', postalCode: '', country: 'Philippines' });

  // Payment Method State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([]);
  const [checkoutAccessories, setCheckoutAccessories] = useState<CheckoutAccessory[]>([]);
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [additionalFees, setAdditionalFees] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodOption | null>(null);

  // QR Code Modal State
  const [qrModalMethod, setQrModalMethod] = useState<PaymentMethodOption | null>(null);

  // Accessories State (key: accessoryId, value: quantity)
  const [selectedAccessoriesState, setSelectedAccessoriesState] = useState<Record<string, number>>({});

  // Payment Proof State
  const [paymentProof, setPaymentProof] = useState<PaymentProofFile>({
    file: null,
    previewUrl: null,
    fileName: null,
    fileSize: null,
  });

  // Order Notes
  const [orderNotes, setOrderNotes] = useState<string>('');

  // Validation & Processing State
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderResult, setOrderResult] = useState<OrderSubmissionResult | null>(null);

  // Calculate live dynamic breakdown using CheckoutService Fee Engine
  const baseBreakdown = CheckoutService.calculateCheckoutBreakdown(
    checkoutStore,
    items,
    selectedAccessoriesState,
    estimatedDiscount,
    undefined,
    selectedAddress?.region || selectedAddress?.province
  );
  const configuredShippingPhp = shippingMethods[0]
    ? Number(shippingMethods[0].base_fee_php) + Math.max(0, baseBreakdown.totalVialsCount - Number(shippingMethods[0].base_included_qty)) * Number(shippingMethods[0].additional_per_vial_fee_php)
    : 0;
  const configuredFeesPhp = additionalFees.reduce((sum, fee) => {
    const feeVal = Number(fee.amount ?? fee.amount_php ?? 0);
    return sum + (fee.fee_type === 'PERCENTAGE' ? (baseBreakdown.subtotalPhp || 0) * feeVal / 100 : feeVal);
  }, 0);
  const configuredAppliedFees = additionalFees.map((fee) => {
    const feeVal = Number(fee.amount ?? fee.amount_php ?? 0);
    const amountPhp = fee.fee_type === 'PERCENTAGE'
      ? (baseBreakdown.subtotalPhp || 0) * feeVal / 100
      : feeVal;
    return {
      feeId: fee.id,
      displayName: fee.name,
      amountPhp,
      amountUsd: convertPhpToUsd(amountPhp),
      calculationType: fee.fee_type,
      description: fee.description || undefined,
    };
  });
  const breakdown = {
    ...baseBreakdown,
    shippingMethodId: shippingMethods[0]?.id,
    shippingMethodName: shippingMethods[0]?.name || '',
    shippingFeePhp: configuredShippingPhp,
    shippingFeeUsd: convertPhpToUsd(configuredShippingPhp),
    appliedFees: configuredAppliedFees,
    totalFeesPhp: configuredShippingPhp + configuredFeesPhp,
    totalFeesUsd: convertPhpToUsd(configuredShippingPhp + configuredFeesPhp),
    grandTotalPhp: Math.max(0, (baseBreakdown.subtotalPhp || 0) + configuredShippingPhp + configuredFeesPhp + convertUsdToPhp(baseBreakdown.accessoriesTotalUsd) - (baseBreakdown.discountPhp || 0)),
    grandTotalUsd: Math.max(0, baseBreakdown.subtotalUsd + convertPhpToUsd(configuredShippingPhp + configuredFeesPhp) + baseBreakdown.accessoriesTotalUsd - baseBreakdown.discountUsd),
    earnedPoints: 0,
  };

  // Sync user details if loaded later
  useEffect(() => {
    if (user) {
      setCustomerInfo((prev) => ({
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        phone: prev.phone,
        companyOrInstitution: prev.companyOrInstitution,
      }));
    }
  }, [user]);

  useEffect(() => {
    loadProductionCheckoutConfig(String(checkoutStore)).then((config) => {
      setPaymentMethods(config.paymentMethods);
      setCheckoutAccessories(config.accessories);
      accessoryService.saveAccessories(config.accessories);
      setShippingMethods(config.shippingMethods);
      setAdditionalFees(config.additionalFees);
      setSavedAddresses(config.addresses);
      setSelectedPaymentMethod(config.paymentMethods[0] || null);
      if (config.addresses[0]) setSelectedAddress(config.addresses[0]);
    }).catch((error) => setValidationError(error instanceof Error ? error.message : 'Unable to load checkout configuration.'));
  }, [checkoutStore]);

  const handleAccessoryQuantityChange = (accessoryId: string, qty: number) => {
    setSelectedAccessoriesState((prev) => ({
      ...prev,
      [accessoryId]: qty,
    }));
  };

  const handleAddressChange = (address: ShippingAddress) => {
    setSelectedAddress(address);

    // Auto-fill customer info fields from selected address
    setCustomerInfo((prev) => ({
      ...prev,
      fullName: address.recipientName || prev.fullName,
      phone: address.phone || prev.phone,
      email: address.email || prev.email,
      companyOrInstitution: address.companyOrInstitution || prev.companyOrInstitution,
      customerFields: {
        ...(prev.customerFields || {}),
        ...(address.customerFields || {}),
      },
    }));
  };

  const validateCheckout = (): boolean => {
    setValidationError(null);

    // 1. Customer Information
    if (!customerInfo.fullName.trim()) {
      setValidationError('Please provide the full name for the customer or receiving contact.');
      return false;
    }
    if (!customerInfo.email.trim() || !customerInfo.email.includes('@')) {
      setValidationError('Please enter a valid email address for order tracking updates.');
      return false;
    }
    if (!customerInfo.phone.trim()) {
      setValidationError('Please enter a contact phone number for delivery dispatch notification.');
      return false;
    }

    // 2. Shipping Address
    if (
      !selectedAddress.recipientName.trim() ||
      !selectedAddress.addressLine1.trim() ||
      !selectedAddress.city.trim() ||
      !selectedAddress.province.trim() ||
      !selectedAddress.postalCode.trim()
    ) {
      setValidationError('Please complete all required shipping address fields (Recipient, Address Line 1, City, Province, Postal Code).');
      return false;
    }

    // 3. Payment Method
    if (!selectedPaymentMethod) {
      setValidationError('Please select a payment clearing method.');
      return false;
    }

    // 4. Mandatory Payment Proof Upload
    if (selectedPaymentMethod.requiresProof && !paymentProof.file) {
      setValidationError(
        `Proof of payment image upload is MANDATORY. Please select or drag a receipt screenshot for ${selectedPaymentMethod.name}.`
      );
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateCheckout()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await CheckoutService.submitOrder({
        storeType: checkoutStore,
        customerInfo,
        shippingAddress: selectedAddress,
        paymentMethodId: selectedPaymentMethod!.id,
        paymentProofFile: paymentProof.file,
        orderNotes,
        items: items.map((i) => ({
          id: i.id,
          productId: i.productId,
          variantId: i.variantId,
          name: i.name,
          variantLabel: i.variantLabel,
          quantity: i.quantity,
          price: i.price,
          storeType: i.storeType || checkoutStore,
          sellingUnit: i.sellingUnit,
          vialsPerKit: i.vialsPerKit,
          isAccessory: i.isAccessory,
          category: (i as any).category,
        })),
        selectedAccessories: breakdown.accessories,
        appliedFees: breakdown.appliedFees,
        subtotal: breakdown.subtotalUsd,
        shippingFee: breakdown.totalFeesUsd,
        discount: breakdown.discountUsd,
        earnedPoints: breakdown.earnedPoints,
        grandTotal: breakdown.grandTotalUsd,
      });

      setOrderResult(result);
      clearCart(checkoutStore);
    } catch (err) {
      console.error('Checkout error:', err);
      setValidationError('Failed to submit order allocation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If cart is empty and no order result modal open
  if (items.length === 0 && !orderResult) {
    return (
      <PageContainer
        title="Order Summary Checkout"
        description="Complete destination details and settlement to reserve batch allocation."
      >
        <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-[#090D16]/90 border border-white/10 text-center space-y-5 my-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <ShoppingCart className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">No Staged Allocations Found</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your cart is empty. Please select products from the stores before proceeding to checkout.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/groupbuy">
              <Button variant="cyan" size="md" className="font-mono text-xs font-bold uppercase">
                Explore GroupBuy Store
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline" size="md" className="font-mono text-xs border-white/20 text-slate-300">
                View Cart
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Order Summary Checkout"
      description="Review customer information, destination address, accessories, and settlement proof to finalize your batch reservation."
      actions={
        <Link to="/cart">
          <Button variant="outline" size="sm" className="border-white/20 text-slate-300 hover:bg-white/10 text-xs font-mono">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back to Cart
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Checkout Form (8 columns) */}
        <div className="lg:col-span-8">
          <CheckoutForm
            storeType={checkoutStore}
            customerInfo={customerInfo}
            onCustomerInfoChange={setCustomerInfo}
            selectedAddress={selectedAddress}
            onAddressChange={handleAddressChange}
            selectedPaymentMethod={selectedPaymentMethod}
            onPaymentMethodChange={setSelectedPaymentMethod}
            paymentProof={paymentProof}
            onPaymentProofChange={setPaymentProof}
            orderNotes={orderNotes}
            onOrderNotesChange={setOrderNotes}
            totalVialsCount={breakdown.totalVialsCount}
            totalKitsCount={items.reduce((sum, item) => sum + (item.quantity || 1), 0)}
            selectedAccessoriesState={selectedAccessoriesState}
            onAccessoryQuantityChange={handleAccessoryQuantityChange}
            onOpenQrModal={setQrModalMethod}
            validationError={validationError}
            paymentMethods={paymentMethods}
            savedAddresses={savedAddresses}
            accessories={checkoutAccessories}
          />
        </div>

        {/* Right Column: Checkout Sidebar / Order Summary (4 columns) */}
        <div className="lg:col-span-4">
          <div className="sticky top-20">
            <CheckoutSidebar
              breakdown={breakdown}
              items={items}
              onPlaceOrder={handlePlaceOrder}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* QR Enlarged / Download Modal */}
      {qrModalMethod && (
        <QrCodeModal method={qrModalMethod} onClose={() => setQrModalMethod(null)} />
      )}

      {/* Success Confirmation Modal */}
      {orderResult && <SuccessModal orderResult={orderResult} />}
    </PageContainer>
  );
};


