import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { LucideIcon } from 'lucide-react';

export interface CalculatorCardProps {
  id: string;
  title: string;
  formulaTag: string;
  description: string;
  path: string;
  icon: LucideIcon;
  badgeText?: string;
  accentColor?: 'cyan' | 'purple' | 'magenta' | 'amber';
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  title,
  formulaTag,
  description,
  path,
  icon: Icon,
  badgeText = 'UTILITY',
  accentColor = 'cyan',
}) => {
  const getAccentStyles = () => {
    switch (accentColor) {
      case 'purple':
        return {
          border: 'border-[#8B5CF6]/30 hover:border-[#8B5CF6]',
          iconBg: 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#8B5CF6] group-hover:scale-110',
          badgeVar: 'purple' as const,
          textHover: 'group-hover:text-[#8B5CF6]',
          glow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]',
        };
      case 'magenta':
        return {
          border: 'border-[#FF2ED1]/30 hover:border-[#FF2ED1]',
          iconBg: 'bg-[#FF2ED1]/10 border-[#FF2ED1]/30 text-[#FF2ED1] group-hover:scale-110',
          badgeVar: 'magenta' as const,
          textHover: 'group-hover:text-[#FF2ED1]',
          glow: 'hover:shadow-[0_0_30px_rgba(255,46,209,0.3)]',
        };
      case 'amber':
        return {
          border: 'border-amber-500/30 hover:border-amber-500',
          iconBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400 group-hover:scale-110',
          badgeVar: 'amber' as const,
          textHover: 'group-hover:text-amber-400',
          glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
        };
      case 'cyan':
      default:
        return {
          border: 'border-[#00D9FF]/30 hover:border-[#00D9FF]',
          iconBg: 'bg-[#00D9FF]/10 border-[#00D9FF]/30 text-[#00D9FF] group-hover:scale-110',
          badgeVar: 'cyan' as const,
          textHover: 'group-hover:text-[#00D9FF]',
          glow: 'hover:shadow-[0_0_30px_rgba(0,217,255,0.35)]',
        };
    }
  };

  const style = getAccentStyles();

  return (
    <Link to={path} className="block group h-full">
      <Card
        variant="glass"
        className={`${style.border} ${style.glow} p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden h-full group-hover:-translate-y-1 bg-gradient-to-br from-white/5 to-transparent hover:from-white/10`}
      >
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div
              className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 ${style.iconBg}`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <Badge variant={style.badgeVar} glow>{badgeText}</Badge>
          </div>

          <div>
            <div className="inline-block text-[10px] font-mono font-bold tracking-widest text-slate-300 bg-white/5 px-2.5 py-1 rounded border border-white/10 mb-3">
              {formulaTag}
            </div>
            <h3
              className={`text-xl font-bold text-white mb-2 transition-colors duration-300 ${style.textHover}`}
            >
              {title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {description}
            </p>
          </div>
        </div>

        {/* Hover subtle bottom accent bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-white transition-colors">
          <span>SELECT CALCULATOR</span>
          <span className="text-lg leading-none transition-transform group-hover:translate-x-1">➔</span>
        </div>
      </Card>
    </Link>
  );
};
