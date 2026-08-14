import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Atom } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface EmptyCartProps {
  onContinueShopping?: () => void;
  className?: string;
}

export const EmptyCart: React.FC<EmptyCartProps> = ({ onContinueShopping, className = '' }) => {
  return (
    <Card variant="glass" className={`text-center py-16 px-6 sm:px-12 max-w-2xl mx-auto border-white/10 space-y-6 ${className}`}>
      {/* Cyberpunk Laboratory Illustration Graphic */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00D9FF]/20 via-[#8B5CF6]/20 to-[#FF2ED1]/20 rounded-full blur-xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-2xl bg-[#090D16] border border-[#00D9FF]/30 flex items-center justify-center shadow-[0_0_25px_rgba(0,217,255,0.2)]">
          <ShoppingBag className="w-10 h-10 text-[#00D9FF]" />
          <Atom className="w-4 h-4 text-[#FF2ED1] absolute top-2 right-2 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Your Allocation Cart is Empty</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Your cart is empty. Explore the stores to add products to your order.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to="/groupbuy">
          <Button
            variant="cyan"
            size="md"
            onClick={onContinueShopping}
            className="w-full sm:w-auto font-mono text-xs tracking-wider"
          >
            <span>Explore GroupBuy Store</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link to="/onhand">
          <Button
            variant="outline"
            size="md"
            onClick={onContinueShopping}
            className="w-full sm:w-auto border-purple-500/30 text-purple-300 hover:bg-purple-500/10 font-mono text-xs tracking-wider"
          >
            <span>OnHand Inventory</span>
          </Button>
        </Link>
      </div>

      {/* Quality Guarantee Footer */}
      <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
        <ShieldCheck className="w-4 h-4 text-[#00D9FF]" />
        <span>Secure Order Reservation â€¢ Fast Dispatch</span>
      </div>
    </Card>
  );
};

