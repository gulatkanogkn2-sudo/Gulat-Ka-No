import React from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { CalculatorCard } from '../../components/research/CalculatorCard';
import { ResearchSubNav } from '../../components/research/ResearchSubNav';
import { Calculator, Repeat } from 'lucide-react';

export const CalculatorsPage: React.FC = () => {
  const calculators = [
    {
      id: 'peptide',
      title: 'Peptide Calculator',
      formulaTag: 'VIAL AMOUNT + BAC WATER ➔ SYRINGE UNITS',
      description:
        'Unified scientific calculator for peptide reconstitution, solution concentrations (mcg/mL & mg/mL), diluent ratios, and interactive SVG syringe scale unit conversions.',
      path: '/research/calculators/peptide',
      icon: Calculator,
      accentColor: 'cyan' as const,
      badgeText: 'PRIMARY TOOL',
    },
    {
      id: 'cycle',
      title: 'Peptide Cycle Calculator',
      formulaTag: 'DAYS / WEEKS ➔ TOTAL CYCLE MASS',
      description:
        'Calculate multi-week research cycle schedules, total peptide mass requirements, vial counts, and diluent BAC water needs.',
      path: '/research/calculators/cycle',
      icon: Repeat,
      accentColor: 'magenta' as const,
      badgeText: 'CYCLE SCHEDULE',
    },
  ];

  return (
    <PageContainer
      title="Peptide Calculators Hub"
      description="Select a precision calculation tool for laboratory reconstitution, solution concentrations, syringe units, and cycle planning."
      actions={
        <Badge variant="cyan" glow>
          2 PRECISION TOOLS
        </Badge>
      }
    >
      <ResearchSubNav />
      {/* Overview Banner */}
      <Card
        variant="glass"
        className="border-[#00D9FF]/30 mb-8 p-6 relative overflow-hidden bg-gradient-to-r from-[#00D9FF]/10 via-transparent to-[#FF2ED1]/10"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#00D9FF]" />
              Interactive Scientific Calculators
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Click any calculator card below to open real-time scientific calculations with interactive SVG syringe visualization.
            </p>
          </div>
          <Badge variant="cyan" className="px-3 py-1 font-mono text-xs">
            U-100 & U-40 SUPPORTED
          </Badge>
        </div>
      </Card>

      {/* Grid of 2 Calculator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {calculators.map((calc) => (
          <CalculatorCard key={calc.id} {...calc} />
        ))}
      </div>
    </PageContainer>
  );
};
