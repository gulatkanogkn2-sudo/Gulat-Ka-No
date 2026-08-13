export interface NavGroup {
  category: string;
  items: {
    label: string;
    path: string;
    badge?: string;
    description?: string;
  }[];
}

export const APP_CONFIG = {
  name: 'GKN',
  tagline: 'Gulat Ka No!!?',
  version: '2.0.0-foundation',
  supportEmail: 'support@gkn.research',
  whatsappSupport: '+1 (555) 019-2831',
  laboratoryDisclaimer: 'FOR LABORATORY AND ANALYTICAL RESEARCH PURPOSES ONLY. NOT FOR HUMAN OR VETERINARY USE.',

  // Customer Navigation Categories
  customerNav: [
    { label: 'Home', path: '/' },
    { label: 'GroupBuy', path: '/groupbuy' },
    { label: 'OnHand', path: '/onhand' },
    { label: 'MOQ', path: '/moq' },
    { label: 'Order Tracker', path: '/order-tracker' },
    { label: 'Research Hub', path: '/research' },
  ],

  // Admin Navigation Groups
  adminNavGroups: [
    {
      category: 'MAIN',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard' },
      ],
    },
    {
      category: 'STORES',
      items: [
        { label: 'GroupBuy Store', path: '/admin/stores/groupbuy', badge: 'Active' },
        { label: 'OnHand Store', path: '/admin/stores/onhand' },
        { label: 'MOQ Store', path: '/admin/stores/moq' },
      ],
    },
    {
      category: 'OPERATIONS',
      items: [
        { label: 'Orders', path: '/admin/orders' },
        { label: 'Payment Verification', path: '/admin/payments', badge: 'Queue' },
        { label: 'Customers', path: '/admin/customers' },
        { label: 'Shipping & Fulfillment', path: '/admin/shipping' },
        { label: 'Finance & Ledger', path: '/admin/finance' },
      ],
    },
    {
      category: 'CONTENT',
      items: [
        { label: 'Website', path: '/admin/website' },
        { label: 'Research', path: '/admin/research-library' },
        { label: 'Media', path: '/admin/media' },
      ],
    },
    {
      category: 'SETTINGS',
      items: [
        { label: 'General', path: '/admin/settings?tab=general' },
        { label: 'Stores & Products', path: '/admin/settings?tab=stores' },
        { label: 'Checkout & Fees', path: '/admin/settings?tab=checkout' },
        { label: 'Orders & Timelines', path: '/admin/settings?tab=orders' },
        { label: 'Shipping', path: '/admin/settings?tab=shipping' },
        { label: 'Payments', path: '/admin/settings?tab=payments' },
      ],
    },
    {
      category: 'SYSTEM',
      items: [
        { label: 'System Status', path: '/admin/setup' },
        { label: 'Admin & Owner', path: '/admin/settings?tab=adminOwner' },
        { label: 'Deployment / Advanced', path: '/admin/settings?tab=deployment' },
      ],
    },
  ] as NavGroup[],
};
