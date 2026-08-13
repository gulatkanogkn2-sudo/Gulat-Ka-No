import { getSupabaseClient } from '../lib/supabase';
import { CheckoutAccessory, PaymentMethodOption, ShippingAddress } from '../types/checkout';
import { OrderDetail, OrderItem, OrderStatus } from '../types/order';
import { convertPhpToUsd, convertUsdToPhp } from '../utils/currencyUtils';

const requireClient = (): any => {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase is not configured.');
  return client;
};

const storeMatches = (stores: string[] | null, store: string) =>
  !stores?.length || stores.includes('all') || stores.some((value) => value.toLowerCase() === store.toLowerCase());

export type ProductionCheckoutConfig = {
  paymentMethods: PaymentMethodOption[];
  shippingMethods: any[];
  accessories: CheckoutAccessory[];
  additionalFees: any[];
  addresses: ShippingAddress[];
};

export async function loadProductionCheckoutConfig(store: string): Promise<ProductionCheckoutConfig> {
  const client = requireClient();
  const [payments, shipping, accessories, fees, addresses] = await Promise.all([
    client.from('payment_methods').select('*').eq('is_enabled', true).order('sort_order'),
    client.from('shipping_methods').select('*').eq('is_enabled', true).order('sort_order'),
    client.from('checkout_accessories').select('*').eq('is_enabled', true).order('sort_order'),
    client.from('additional_fees').select('*').eq('is_enabled', true).order('sort_order'),
    client.from('customer_addresses').select('*').order('is_default', { ascending: false }),
  ]);
  for (const result of [payments, shipping, accessories, fees, addresses]) {
    if (result.error) throw result.error;
  }
  return {
    paymentMethods: (payments.data || []).filter((row: any) => storeMatches(row.available_stores, store)).map((row: any, index: number) => ({
      id: row.id,
      name: row.name,
      subtitle: (row.method_type || '').replaceAll('_', ' '),
      badge: row.method_type || 'PAYMENT',
      accountName: row.account_name || '',
      accountNumber: row.account_number || row.wallet_address || '',
      bankOrNetwork: row.settings_jsonb?.bank_or_network || (row.method_type === 'E_WALLET' ? `${row.name} Wallet` : undefined),
      instructions: row.instructions || '',
      accent: ['cyan', 'purple', 'magenta', 'green'][index % 4] as PaymentMethodOption['accent'],
      requiresProof: row.settings_jsonb?.requires_proof !== false,
      qrCodeUrl: row.qr_code_storage_path || undefined,
      enabled: row.is_enabled ?? true,
      displayOrder: row.sort_order || index + 1,
      availableStores: row.available_stores || ['all'],
    })),
    shippingMethods: (shipping.data || []).filter((row: any) => storeMatches(row.available_stores, store)),
    accessories: (accessories.data || []).filter((row: any) => storeMatches(row.available_stores, store)).map((row: any, index: number) => ({
      id: row.id,
      name: row.name,
      description: row.description || '',
      priceUsd: convertPhpToUsd(Number(row.price_php || 0)),
      enabled: row.is_enabled ?? true,
      displayOrder: row.sort_order || index + 1,
      availableStores: row.available_stores || ['all'],
      calculationMode: (row.calculation_mode || 'manual').toLowerCase(),
      multiplier: Number(row.multiplier || 1),
    })),
    additionalFees: (fees.data || []).filter((row: any) => storeMatches(row.available_stores, store)),
    addresses: (addresses.data || []).map((row: any) => ({
      id: row.id, recipientName: row.recipient_name, phone: row.phone || '', addressLine1: row.address_line_1,
      addressLine2: row.address_line_2 || '', city: row.city || '', province: row.province || '', region: row.region || '',
      postalCode: row.postal_code || '', country: row.country || 'Philippines', isDefault: row.is_default,
    })),
  };
}

const mapItem = (row: any): OrderItem => ({
  id: row.id, productId: row.product_id || row.accessory_id || row.id, name: row.product_name,
  variantLabel: row.variant_name || '', quantity: Number(row.quantity), price: convertPhpToUsd(Number(row.unit_price_php)),
  storeType: row.store_type, sellingUnit: row.selling_unit, vialsPerKit: row.vials_per_kit,
  totalVials: Number(row.total_vials), isAccessory: row.is_accessory,
});

export const mapOrder = (row: any): OrderDetail => ({
  id: row.id, referenceNumber: row.order_number, storeType: row.store_type, orderDate: row.placed_at,
  status: row.status, paymentStatus: row.payment_status,
  shippingStatus: row.fulfillment_status === 'PENDING' ? 'UNFULFILLED' : row.fulfillment_status,
  paymentMethod: row.payment_method_snapshot?.name || '',
  paymentSummary: row.payment_verifications?.[0] ? {
    paymentMethod: row.payment_method_snapshot?.name || '', amount: convertPhpToUsd(Number(row.grand_total_php)),
    paymentReference: row.payment_verifications[0].reference_number || '',
    paymentProofStatus: row.payment_verifications[0].proof_storage_path ? 'SUBMITTED' : 'NOT_SUBMITTED',
    verificationStatus: row.payment_verifications[0].verification_status === 'APPROVED' ? 'VERIFIED' : row.payment_verifications[0].verification_status,
    proofUrl: row.payment_verifications[0].proof_storage_path || undefined,
  } : undefined,
  shippingAddress: row.shipping_address_snapshot,
  items: (row.order_items || []).map(mapItem), subtotal: convertPhpToUsd(Number(row.subtotal_php)),
  shippingFee: convertPhpToUsd(Number(row.shipping_fee_php)), discount: convertPhpToUsd(Number(row.discount_php)),
  grandTotal: convertPhpToUsd(Number(row.grand_total_php)), customerName: row.customer_name,
  customerEmail: row.customer_email, customerPhone: row.customer_phone,
  trackingNumber: row.order_metadata_jsonb?.tracking_number, courier: row.order_metadata_jsonb?.courier,
  orderNotes: row.order_metadata_jsonb?.order_notes,
});

const ORDER_SELECT = '*, order_items(*), payment_verifications(*)';

export async function fetchOrders(reference?: string): Promise<OrderDetail[]> {
  const client = requireClient();
  let query = client.from('orders').select(ORDER_SELECT).order('placed_at', { ascending: false });
  if (reference) query = query.eq('order_number', reference.trim().toUpperCase());
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapOrder);
}

export async function createProductionOrder(payload: any, proofFile: File | null) {
  const client = requireClient();
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (userError || !user) throw new Error('Please sign in before placing an order.');
  const config = await loadProductionCheckoutConfig(payload.storeType);
  const method = config.paymentMethods.find((item) => item.id === payload.paymentMethodId);
  if (!method) throw new Error('The selected payment method is no longer available.');
  const shipping = config.shippingMethods[0];
  if (!shipping) throw new Error('No shipping method is configured for this store.');
  const subtotalPhp = convertUsdToPhp(payload.subtotal);
  const discountPhp = convertUsdToPhp(payload.discount);
  const accessoriesPhp = (payload.selectedAccessories || []).reduce((sum: number, item: any) => sum + convertUsdToPhp(item.totalPriceUsd), 0);
  const additionalFeesPhp = config.additionalFees.reduce((sum: number, fee: any) => {
    const feeVal = Number(fee.amount ?? fee.amount_php ?? 0);
    return sum + (fee.fee_type === 'PERCENTAGE' ? subtotalPhp * feeVal / 100 : feeVal);
  }, 0);
  const totalVials = payload.items.reduce((sum: number, item: any) => sum + item.quantity * (item.sellingUnit === 'kit' ? item.vialsPerKit || 10 : 1), 0);
  const shippingFeePhp = Number(shipping.base_fee_php) + Math.max(0, totalVials - Number(shipping.base_included_qty)) * Number(shipping.additional_per_vial_fee_php);
  const grandTotalPhp = Math.max(0, subtotalPhp + shippingFeePhp + accessoriesPhp + additionalFeesPhp - discountPhp);
  const { data: order, error: orderError } = await client.from('orders').insert({
    customer_id: user.id, customer_name: payload.customerInfo.fullName, customer_email: payload.customerInfo.email,
    customer_phone: payload.customerInfo.phone, store_type: payload.storeType.toLowerCase(), status: 'PAYMENT_VERIFICATION',
    payment_status: 'VERIFICATION_PENDING', fulfillment_status: 'PENDING', subtotal_php: subtotalPhp,
    shipping_fee_php: shippingFeePhp, discount_php: discountPhp, other_fees_php: accessoriesPhp + additionalFeesPhp,
    grand_total_php: grandTotalPhp, earned_reward_points: payload.earnedPoints,
    shipping_address_snapshot: payload.shippingAddress,
    payment_method_snapshot: { id: method.id, name: method.name, methodType: method.badge },
    order_metadata_jsonb: { order_notes: payload.orderNotes || '', shipping_method_id: shipping.id, shipping_method_name: shipping.name },
  }).select().single();
  if (orderError) throw orderError;
  const rows = [
    ...payload.items.map((item: any) => ({ order_id: order.id, product_id: item.productId, variant_id: item.variantId || null,
      product_name: item.name, variant_name: item.variantLabel, store_type: payload.storeType.toLowerCase(),
      selling_unit: item.sellingUnit || 'vial', vials_per_kit: item.vialsPerKit || 1, quantity: item.quantity,
      total_vials: item.quantity * (item.sellingUnit === 'kit' ? item.vialsPerKit || 10 : 1), unit_price_php: convertUsdToPhp(item.price),
      line_total_php: convertUsdToPhp(item.price * item.quantity), item_snapshot: item })),
    ...(payload.selectedAccessories || []).map((item: any) => ({ order_id: order.id, accessory_id: item.accessoryId,
      product_name: item.name, variant_name: null, store_type: payload.storeType.toLowerCase(), selling_unit: 'vial',
      vials_per_kit: 1, quantity: item.quantity, total_vials: 0, unit_price_php: convertUsdToPhp(item.unitPriceUsd),
      line_total_php: convertUsdToPhp(item.totalPriceUsd), is_accessory: true, item_snapshot: item })),
  ];
  const { error: itemError } = await client.from('order_items').insert(rows);
  if (itemError) throw itemError;
  let proofPath: string | null = null;
  if (proofFile) {
    const extension = proofFile.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin';
    proofPath = `${user.id}/${order.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await client.storage.from('gkn-payment-proofs').upload(proofPath, proofFile, { contentType: proofFile.type, upsert: false });
    if (uploadError) throw uploadError;
  }
  const { error: verificationError } = await client.from('payment_verifications').insert({
    order_id: order.id, payment_method_id: method.id, submitted_amount_php: grandTotalPhp,
    proof_storage_path: proofPath, verification_status: 'PENDING',
  });
  if (verificationError) throw verificationError;
  return { orderId: order.id, referenceNumber: order.order_number, createdAt: order.placed_at,
    status: 'PENDING_VERIFICATION' as const, estimatedDispatch: 'Pending payment verification', totalAmount: convertPhpToUsd(grandTotalPhp) };
}

export async function updateProductionOrderStatus(id: string, status: OrderStatus) {
  const client = requireClient();
  const fulfillment = status === 'PACKING' ? 'PACKED' : status === 'SHIPPED' ? 'IN_TRANSIT' : status === 'DELIVERED' || status === 'COMPLETED' ? 'DELIVERED' : undefined;
  const updates: any = { status };
  if (fulfillment) updates.fulfillment_status = fulfillment;
  const { error } = await client.from('orders').update(updates).eq('id', id);
  if (error) throw error;
  return (await fetchOrders()).find((order) => order.id === id)!;
}

export async function reviewPayment(id: string, approved: boolean, reason?: string) {
  const client = requireClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) throw new Error('Not authenticated.');
  const { data: payment, error } = await client.from('payment_verifications').update({
    verification_status: approved ? 'APPROVED' : 'REJECTED', verified_by: user.id, verified_at: new Date().toISOString(),
    rejection_reason: approved ? null : reason || 'Rejected by reviewer',
  }).eq('id', id).select('order_id').single();
  if (error) throw error;
  await client.from('orders').update(approved ? { status: 'CONFIRMED', payment_status: 'PAID' } : { payment_status: 'FAILED' }).eq('id', payment.order_id);
}

export async function fetchProductionPayments(): Promise<any[]> {
  const client = requireClient();
  const { data, error } = await client.from('payment_verifications').select('*, orders(*)').order('submitted_at', { ascending: false });
  if (error) throw error;
  return Promise.all((data || []).map(async (row: any) => {
    let proofUrl = '';
    if (row.proof_storage_path) {
      const signed = await client.storage.from('gkn-payment-proofs').createSignedUrl(row.proof_storage_path, 300);
      proofUrl = signed.data?.signedUrl || '';
    }
    const order = row.orders;
    const status = row.verification_status === 'APPROVED' ? 'VERIFIED' : row.verification_status === 'PENDING' ? 'PENDING_REVIEW' : row.verification_status;
    return {
      id: row.id, paymentReference: row.reference_number || row.id.slice(0, 8).toUpperCase(), orderNumber: order.order_number,
      orderId: order.id, customerId: order.customer_id, customerName: order.customer_name, customerEmail: order.customer_email || '',
      customerPhone: order.customer_phone || '', storeType: order.store_type, paymentMethod: order.payment_method_snapshot?.methodType || 'OTHER',
      amountPaid: convertPhpToUsd(Number(row.submitted_amount_php)), currency: 'USD', paymentDate: row.submitted_at,
      transactionReference: row.reference_number || '', verificationStatus: status, assignedVerifier: row.verified_by,
      lastUpdated: row.updated_at, uploadedProofUrl: proofUrl, uploadedProofFileName: row.proof_storage_path?.split('/').pop() || '',
      uploadedProofFileSize: '', verificationHistory: [], adminNotes: [], rejectionReason: row.rejection_reason,
      associatedOrderStatus: order.status, orderTotalAmount: convertPhpToUsd(Number(order.grand_total_php)),
    };
  }));
}

export async function fetchCustomers() {
  const client = requireClient();
  const { data, error } = await client.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
