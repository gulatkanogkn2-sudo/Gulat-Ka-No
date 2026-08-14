import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AdminRoute } from '../components/auth/AdminRoute';

// Customer Pages
import { HomePage } from '../pages/customer/HomePage';
import { GroupBuyPage } from '../pages/customer/GroupBuyPage';
import { OnHandPage } from '../pages/customer/OnHandPage';
import { MoqPage } from '../pages/customer/MoqPage';
import { ProductDetailPage } from '../pages/customer/ProductDetailPage';
import { CartPage } from '../pages/customer/CartPage';
import { CheckoutPage } from '../pages/customer/CheckoutPage';
import { OrderTrackerPage } from '../pages/customer/OrderTrackerPage';
import { OrderDetailsPage } from '../pages/customer/OrderDetailsPage';
import { ResearchHubPage } from '../pages/customer/ResearchHubPage';
import { CalculatorsPage } from '../pages/customer/CalculatorsPage';
import { CoaLibraryPage } from '../pages/customer/CoaLibraryPage';
import { ProtocolLibraryPage } from '../pages/customer/ProtocolLibraryPage';
import { PriceListPage } from '../pages/customer/PriceListPage';
import { StaticPageViewer } from '../pages/customer/StaticPageViewer';

// Calculator Pages
import { PeptideCalcPage } from '../pages/customer/calculators/PeptideCalcPage';
import { CycleCalcPage } from '../pages/customer/calculators/CycleCalcPage';

// Auth & Account Pages
import { LoginPage } from '../pages/customer/LoginPage';
import { RegisterPage } from '../pages/customer/RegisterPage';
import { ForgotPasswordPage } from '../pages/customer/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/customer/ResetPasswordPage';
import { AccountPage } from '../pages/customer/AccountPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminPaymentsPage } from '../pages/admin/AdminPaymentsPage';
import { AdminShippingPage } from '../pages/admin/AdminShippingPage';
import { AdminCustomersPage } from '../pages/admin/AdminCustomersPage';
import { AdminStoresPage } from '../pages/admin/AdminStoresPage';
import { AdminFinancePage } from '../pages/admin/AdminFinancePage';
import { AdminMediaPage } from '../pages/admin/AdminMediaPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';
import { AdminWebsitePage } from '../pages/admin/AdminWebsitePage';
import { AdminResearchLibraryPage } from '../pages/admin/AdminResearchLibraryPage';
import { AdminSetupPage } from '../pages/admin/AdminSetupPage';

// 404 & Placeholders
import { NotFoundPage } from '../pages/NotFoundPage';
import { GenericPlaceholderPage } from '../pages/GenericPlaceholderPage';

// ScrollToTop Component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Customer Routes with Customer Layout */}
        <Route element={<CustomerLayout />}>
          {/* Main Store & Nav Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/groupbuy" element={<GroupBuyPage />} />
          <Route path="/onhand" element={<OnHandPage />} />
          <Route path="/moq" element={<MoqPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/order-tracker" element={<OrderTrackerPage />} />
          <Route path="/order/:reference" element={<OrderDetailsPage />} />
          <Route path="/research" element={<ResearchHubPage />} />
          
          {/* Research Hub Subpages & Calculator Routes */}
          <Route path="/research/calculators" element={<CalculatorsPage />} />
          <Route path="/research/calculators/peptide" element={<PeptideCalcPage />} />
          <Route path="/research/cycle-calculator" element={<CycleCalcPage />} />
          {/* Redirect / Alias Legacy Calculator URLs to Unified Peptide Calculator */}
          <Route path="/research/calculators/reconstitution" element={<Navigate to="/research/calculators/peptide" replace />} />
          <Route path="/research/calculators/syringe" element={<Navigate to="/research/calculators/peptide" replace />} />
          <Route path="/research/calculators/dosage" element={<Navigate to="/research/calculators/peptide" replace />} />
          <Route path="/research/calculators/vials" element={<Navigate to="/research/calculators/peptide" replace />} />
          <Route path="/research/calculators/cycle" element={<CycleCalcPage />} />

          <Route path="/research/coa-library" element={<CoaLibraryPage />} />
          <Route path="/research/coa" element={<CoaLibraryPage />} />
          <Route path="/research/protocol-library" element={<ProtocolLibraryPage />} />
          <Route path="/research/protocols" element={<ProtocolLibraryPage />} />
          <Route path="/research/price-list" element={<PriceListPage />} />
          <Route path="/research/prices" element={<PriceListPage />} />
          <Route path="/research/pricing" element={<PriceListPage />} />
          
          {/* Footer Information Managed Pages */}
          <Route path="/about" element={<StaticPageViewer />} />
          <Route path="/contact" element={<StaticPageViewer />} />
          <Route path="/faq" element={<StaticPageViewer />} />
          <Route path="/shipping" element={<StaticPageViewer />} />
          <Route path="/returns" element={<StaticPageViewer />} />
          <Route path="/privacy-policy" element={<StaticPageViewer />} />
          <Route path="/privacy" element={<StaticPageViewer />} />
          <Route path="/terms-of-service" element={<StaticPageViewer />} />
          <Route path="/terms" element={<StaticPageViewer />} />
          <Route path="/disclaimer" element={<StaticPageViewer />} />
          <Route path="/p/:slug" element={<StaticPageViewer />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Protected Customer Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<AccountPage />} />
          </Route>

          {/* Keep unknown/internal URLs behind the same private application gate. */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Routes with Admin Layout */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="payment-verification" element={<AdminPaymentsPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="stores" element={<AdminStoresPage />} />
            <Route path="stores/:storeType" element={<AdminStoresPage />} />
            <Route path="finance" element={<AdminFinancePage />} />
            <Route path="shipping" element={<AdminShippingPage />} />
            <Route path="fulfillment" element={<AdminShippingPage />} />
            <Route path="website" element={<AdminWebsitePage />} />
            <Route path="website/*" element={<AdminWebsitePage />} />
            <Route path="website-manager" element={<AdminWebsitePage />} />
            <Route path="research-library" element={<AdminResearchLibraryPage />} />
            <Route path="coa" element={<AdminResearchLibraryPage />} />
            <Route path="protocols" element={<AdminResearchLibraryPage />} />
            <Route path="calculators" element={<AdminResearchLibraryPage />} />
            <Route path="price-list" element={<AdminResearchLibraryPage />} />
            <Route path="pricing" element={<AdminResearchLibraryPage />} />
            <Route path="research-hub" element={<AdminResearchLibraryPage />} />
            <Route path="research-manager" element={<AdminResearchLibraryPage />} />
            <Route path="media" element={<AdminMediaPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="accessories" element={<Navigate to="/admin/settings?tab=accessories" replace />} />
            <Route path="setup" element={<AdminSetupPage />} />
            <Route path="status" element={<AdminSetupPage />} />
            <Route path="system-status" element={<AdminSetupPage />} />
            <Route path="deployment" element={<Navigate to="/admin/settings?tab=deployment" replace />} />
            <Route path="system-validation" element={<AdminSetupPage />} />
          </Route>
        </Route>

      </Routes>
    </>
  );
};

