import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartBadgeProps {
  onClick?: () => void;
  className?: string;
}

export const CartBadge: React.FC<CartBadgeProps> = ({ onClick, className = '' }) => {
  const { totalItemCount } = useCart();

  return (
    <button
      onClick={onClick}
      className={`relative w-11 h-11 p-0 flex items-center justify-center rounded-xl text-[#00D9FF] bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 border border-[#00D9FF]/40 hover:border-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.2)] hover:shadow-[0_0_18px_rgba(0,217,255,0.4)] transition-all duration-200 cursor-pointer group flex-shrink-0 ${className}`}
      aria-label={`Shopping cart with ${totalItemCount} items`}
    >
      <ShoppingCart className="w-6 h-6 text-[#00D9FF] group-hover:scale-110 transition-transform" />
      
      {totalItemCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-mono font-black text-black bg-[#00D9FF] rounded-full shadow-[0_0_10px_rgba(0,217,255,0.8)] animate-pulse">
          {totalItemCount > 99 ? '99+' : totalItemCount}
        </span>
      )}
    </button>
  );
};
