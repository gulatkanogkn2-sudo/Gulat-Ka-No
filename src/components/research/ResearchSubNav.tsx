import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, FileText, FlaskConical, Calculator, Tags } from 'lucide-react';

export const ResearchSubNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  const navItems = [
    {
      label: 'Research Hub',
      path: '/research',
      exact: true,
      icon: Database,
      activeColor: 'bg-cyan-500 text-slate-950 shadow-cyan-500/20',
      activeBorder: 'border-cyan-400',
    },
    {
      label: 'COA Library',
      path: '/research/coa-library',
      icon: FileText,
      activeColor: 'bg-cyan-500 text-slate-950 shadow-cyan-500/20',
      activeBorder: 'border-cyan-400',
    },
    {
      label: 'Protocol Library',
      path: '/research/protocol-library',
      icon: FlaskConical,
      activeColor: 'bg-purple-500 text-slate-950 shadow-purple-500/20',
      activeBorder: 'border-purple-400',
    },
    {
      label: 'Peptide Calculators',
      path: '/research/calculators/peptide',
      matchPrefix: '/research/calculators',
      icon: Calculator,
      activeColor: 'bg-amber-500 text-slate-950 shadow-amber-500/20',
      activeBorder: 'border-amber-400',
    },
    {
      label: 'Products Price List',
      path: '/research/price-list',
      icon: Tags,
      activeColor: 'bg-emerald-500 text-slate-950 shadow-emerald-500/20',
      activeBorder: 'border-emerald-400',
    },
  ];

  const isItemActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return currentPath === '/research' || currentPath === '/research/';
    }
    if (item.matchPrefix) {
      return currentPath.startsWith(item.matchPrefix);
    }
    return currentPath.startsWith(item.path);
  };

  return (
    <div className="mb-8 border-b border-white/10 pb-4">
      <div className="flex flex-wrap items-center gap-2">
        {navItems.map((item) => {
          const isActive = isItemActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? `${item.activeColor} shadow-lg`
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
