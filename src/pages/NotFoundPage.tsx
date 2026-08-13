import React from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { APP_CONFIG } from '../app/config';

export const NotFoundPage: React.FC = () => {
  return (
    <PageContainer title="404 - Route Not Found" maxWidth="lg">
      <Card variant="glass" className="border-[#00D9FF]/30 text-center py-12 px-6 shadow-[0_0_30px_rgba(0,217,255,0.1)] relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#FF2ED1]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,217,255,0.3)]">
            <AlertTriangle className="w-10 h-10 text-[#00D9FF]" />
          </div>

          <h1 className="text-6xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] via-white to-[#FF2ED1] mb-2 drop-shadow-[0_0_15px_rgba(0,217,255,0.5)]">
            404
          </h1>
          <h2 className="text-xl font-bold text-white tracking-wide mb-3">
            ROUTE OR DESTINATION UNRESOLVED
          </h2>

          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            The requested page path does not exist within the <span className="text-[#00D9FF] font-semibold">{APP_CONFIG.name}</span> platform architecture or may have been relocated.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button variant="cyan" size="md" glow className="gap-2 font-bold tracking-wider">
                <Home className="w-4 h-4" />
                RETURN HOME
              </Button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 rounded-lg transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              GO BACK
            </button>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};
