import React from 'react';
import { PriceListItem } from '../../services/researchService';
import { Badge } from '../common/Badge';
import { Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { convertUsdToPhp, formatPhpAmount, formatUsdAmount } from '../../utils/currencyUtils';

export interface PriceListTableProps {
  items: PriceListItem[];
}

export const PriceListTable: React.FC<PriceListTableProps> = ({ items }) => {
  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'GroupBuy':
        return 'cyan' as const;
      case 'OnHand':
        return 'purple' as const;
      case 'MOQ Bulk':
        return 'magenta' as const;
      default:
        return 'cyan' as const;
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#0A0F1D]/80 backdrop-blur-md shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              <th className="py-4 px-4 sm:px-6">Product Name</th>
              <th className="py-4 px-4 sm:px-6">Channel / Store</th>
              <th className="py-4 px-4 sm:px-6">Format / Variant</th>
              <th className="py-4 px-4 sm:px-6">Purity</th>
              <th className="py-4 px-4 sm:px-6">Primary Price (PHP ₱)</th>
              <th className="py-4 px-4 sm:px-6">Reference (USD $)</th>
              <th className="py-4 px-4 sm:px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-white/5 transition-colors group"
              >
                {/* Product Name */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#00D9FF] group-hover:border-[#00D9FF]/40 transition-colors">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white group-hover:text-[#00D9FF] transition-colors block">
                        {item.productName}
                      </span>
                      {item.moqUnits && (
                        <span className="text-[10px] font-mono text-slate-400 block">
                          Tier: {item.moqUnits}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Channel / Store */}
                <td className="py-4 px-4 sm:px-6">
                  <Badge variant={getCategoryBadgeVariant(item.category)}>
                    {item.category}
                  </Badge>
                </td>

                {/* Variant */}
                <td className="py-4 px-4 sm:px-6 font-mono text-slate-300">
                  {item.variant}
                </td>

                {/* Purity */}
                <td className="py-4 px-4 sm:px-6">
                  <span className="font-mono font-bold text-[#00D9FF] bg-[#00D9FF]/10 border border-[#00D9FF]/30 px-2 py-0.5 rounded text-[11px]">
                    {item.purity}
                  </span>
                </td>

                {/* Price PHP Primary */}
                <td className="py-4 px-4 sm:px-6">
                  <span className="font-mono font-bold text-sm text-[#FF2ED1] drop-shadow-[0_0_8px_rgba(255,46,209,0.3)]">
                    {item.pricePHP ? formatPhpAmount(item.pricePHP) : formatPhpAmount(convertUsdToPhp(item.priceUSD))}
                  </span>
                </td>

                {/* Price USD Secondary */}
                <td className="py-4 px-4 sm:px-6 font-mono text-xs font-semibold text-[#00D9FF]">
                  {formatUsdAmount(item.priceUSD)}
                </td>

                {/* Availability Status */}
                <td className="py-4 px-4 sm:px-6">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.availability}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-[#00D9FF]" />
          <span>Official catalog pricing schedule matrix. Read-only reference list.</span>
        </span>
        <span>Total Cataloged Items: {items.length}</span>
      </div>
    </div>
  );
};
