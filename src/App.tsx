import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './app/routes';
import { AuthProvider } from './auth/AuthContext';
import { CartProvider } from './context/CartContext';
import { CartDrawer } from './components/cart/CartDrawer';
import { initDynamicBranding } from './utils/dynamicBranding';

export default function App() {
  useEffect(() => {
    const unsubscribe = initDynamicBranding();
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <CartDrawer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}



