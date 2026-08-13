import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ArrowUpRight, LucideIcon } from 'lucide-react';

export interface ResearchCardProps {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
  badgeText: string;
  badgeVariant?: 'cyan' | 'purple' | 'magenta' | 'amber';
  buttonText?: string;
  neonColor?: 'cyan' | 'purple' | 'magenta' | 'blue' | 'amber';
}

export const ResearchCard: React.FC<ResearchCardProps> = ({
  title,
  description,
  path,
  icon: Icon,
  badgeText,
  badgeVariant = 'cyan',
  neonColor = 'cyan',
}) => {
  const getGlowStyles = () => {
    switch (neonColor) {
      case 'purple':
        return {
          border: 'border-[#8B5CF6]/30 group-hover:border-[#8B5CF6]/80',
          iconBg: 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#8B5CF6]',
          titleHover: 'group-hover:text-[#8B5CF6]',
          arrowColor: 'text-[#8B5CF6]',
          shadow: 'shadow-[0_0_15px_rgba(139,92,246,0.1)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]',
        };
      case 'magenta':
        return {
          border: 'border-[#FF2ED1]/30 group-hover:border-[#FF2ED1]/80',
          iconBg: 'bg-[#FF2ED1]/10 border-[#FF2ED1]/30 text-[#FF2ED1]',
          titleHover: 'group-hover:text-[#FF2ED1]',
          arrowColor: 'text-[#FF2ED1]',
          shadow: 'shadow-[0_0_15px_rgba(255,46,209,0.1)] group-hover:shadow-[0_0_30px_rgba(255,46,209,0.25)]',
        };
      case 'amber':
        return {
          border: 'border-[#FFB020]/30 group-hover:border-[#FFB020]/80',
          iconBg: 'bg-[#FFB020]/10 border-[#FFB020]/30 text-[#FFB020]',
          titleHover: 'group-hover:text-[#FFB020]',
          arrowColor: 'text-[#FFB020]',
          shadow: 'shadow-[0_0_15px_rgba(255,176,32,0.1)] group-hover:shadow-[0_0_30px_rgba(255,176,32,0.25)]',
        };
      case 'blue':
        return {
          border: 'border-[#2979FF]/30 group-hover:border-[#2979FF]/80',
          iconBg: 'bg-[#2979FF]/10 border-[#2979FF]/30 text-[#2979FF]',
          titleHover: 'group-hover:text-[#2979FF]',
          arrowColor: 'text-[#2979FF]',
          shadow: 'shadow-[0_0_15px_rgba(41,121,255,0.1)] group-hover:shadow-[0_0_30px_rgba(41,121,255,0.25)]',
        };
      case 'cyan':
      default:
        return {
          border: 'border-[#00D9FF]/30 group-hover:border-[#00D9FF]/80',
          iconBg: 'bg-[#00D9FF]/10 border-[#00D9FF]/30 text-[#00D9FF]',
          titleHover: 'group-hover:text-[#00D9FF]',
          arrowColor: 'text-[#00D9FF]',
          shadow: 'shadow-[0_0_15px_rgba(0,217,255,0.1)] group-hover:shadow-[0_0_30px_rgba(0,217,255,0.25)]',
        };
    }
  };

  const styles = getGlowStyles();

  return (
    <Link to={path} className="block group h-full">
      <Card
        variant="glass"
        className={`${styles.border} ${styles.shadow} group-hover:-translate-y-1.5 group-hover:scale-[1.01] transition-all duration-300 cursor-pointer p-6 flex flex-col justify-between h-full relative overflow-hidden`}
      >
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${styles.iconBg}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={badgeVariant}>{badgeText}</Badge>
              <ArrowUpRight className={`w-5 h-5 ${styles.arrowColor} opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all`} />
            </div>
          </div>

          <div>
            <h3 className={`text-xl font-bold text-white mb-2 transition-colors ${styles.titleHover}`}>
              {title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
