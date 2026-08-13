import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../common/PageContainer';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ArrowLeft, RefreshCw, AlertCircle, Sparkles, LucideIcon } from 'lucide-react';

export interface CalculatorLayoutProps {
  title: string;
  description: string;
  badgeText: string;
  badgeVariant?: 'cyan' | 'purple' | 'magenta' | 'amber';
  icon: LucideIcon;
  inputs: React.ReactNode;
  results: React.ReactNode;
  onReset?: () => void;
  disclaimerText?: string;
  extraInfo?: React.ReactNode;
}

export const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({
  title,
  description,
  badgeText,
  badgeVariant = 'cyan',
  icon: Icon,
  inputs,
  results,
  onReset,
  disclaimerText = 'For laboratory and analytical research reference purposes only. Not intended for human or clinical diagnosis.',
  extraInfo,
}) => {
  return (
    <PageContainer
      title={title}
      description={description}
      actions={
        <div className="flex items-center gap-3">
          <Link
            to="/research/calculators"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>Calculators Hub</span>
          </Link>
          <Badge variant={badgeVariant} glow>
            {badgeText}
          </Badge>
        </div>
      }
    >
      {/* Top Breadcrumb Navigation */}
      <div className="mb-6 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Link to="/research" className="hover:text-[#00D9FF] transition-colors">Research Hub</Link>
          <span>/</span>
          <Link to="/research/calculators" className="hover:text-[#00D9FF] transition-colors">Calculators</Link>
          <span>/</span>
          <span className="text-white font-bold">{title}</span>
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-slate-400 hover:text-[#00D9FF] transition-colors cursor-pointer text-xs font-mono"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Default Values
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: Input Form Controls */}
        <div className="lg:col-span-6 space-y-6">
          <Card variant="glass" className="border-[#00D9FF]/30 p-6 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2.5 border-b border-white/10 pb-4">
              <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF]">
                <Icon className="w-4 h-4" />
              </div>
              <span>Input Parameters</span>
            </h2>

            {inputs}
          </Card>
        </div>

        {/* Right Column: Output Calculation Matrix */}
        <div className="lg:col-span-6 space-y-6">
          <Card
            variant="glass"
            className="border-[#00D9FF]/40 p-6 space-y-6 relative overflow-hidden bg-gradient-to-br from-[#00D9FF]/10 via-transparent to-transparent"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00D9FF]" />
                <span>Calculation Output</span>
              </h2>
              <Badge variant="cyan">REALTIME MATRIX</Badge>
            </div>

            {results}

            {/* Disclaimer Footer */}
            <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-white/5 p-3.5 rounded-xl border border-white/10">
              <AlertCircle className="w-4 h-4 text-[#00D9FF] flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{disclaimerText}</span>
            </div>
          </Card>

          {extraInfo}
        </div>
      </div>
    </PageContainer>
  );
};
