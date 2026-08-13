import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './app/routes';
import { AuthProvider } from './auth/AuthContext';
import { CartProvider } from './context/CartContext';
import { CartDrawer } from './components/cart/CartDrawer';

export default function App() {
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


