import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { PaymentStats } from '../../../types/paymentVerification';
import { PaymentVerificationService } from '../../../services/paymentVerificationService';

export const PaymentStatsHeader: React.FC = () => {
  const [stats, setStats] = useState<PaymentStats | null>(null);

  const loadStats = async () => {
    const s = await PaymentVerificationService.getStats();
    setStats(s);
  };

  useEffect(() => {
    loadStats();
    const unsub = PaymentVerificationService.subscribeToPaymentUpdates(() => {
      loadStats();
    });
    return () => unsub();
  }, []);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {/* Metric 1: Total Queue Volume */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
        <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider">
          <span>Total Queue Volume</span>
          <DollarSign className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-xl font-mono font-bold text-white mt-1">
          ${stats.totalVolumeUSD.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <div className="text-[10px] font-mono text-slate-500 mt-1 flex items-center justify-between">
          <span>{stats.totalPayments} total submissions</span>
          <span className="text-cyan-400 font-semibold">100% Ingested</span>
        </div>
      </div>

      {/* Metric 2: Pending & Under Review */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-colors">
        <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider">
          <span>Pending & Under Review</span>
          <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
        </div>
        <div className="text-xl font-mono font-bold text-amber-400 mt-1">
          {stats.pendingCount + stats.underReviewCount} <span className="text-xs text-slate-400 font-normal">items</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center justify-between">
          <span>
            ${stats.pendingVolumeUSD.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-amber-400 font-semibold">
            {stats.pendingCount} Pending / {stats.underReviewCount} Reviewing
          </span>
        </div>
      </div>

      {/* Metric 3: Verified Payments */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
        <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider">
          <span>Verified Funds</span>
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
          ${stats.verifiedVolumeUSD.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center justify-between">
          <span>{stats.verifiedCount} verified</span>
          <span className="text-emerald-400 font-semibold">Cleared to Order</span>
        </div>
      </div>

      {/* Metric 4: Requires More Info */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-colors">
        <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider">
          <span>Info Requested</span>
          <HelpCircle className="h-4 w-4 text-purple-400" />
        </div>
        <div className="text-xl font-mono font-bold text-purple-400 mt-1">
          {stats.moreInfoCount} <span className="text-xs text-slate-400 font-normal">pending response</span>
        </div>
        <div className="text-[10px] font-mono text-slate-500 mt-1 flex items-center justify-between">
          <span>Awaiting proof update</span>
          <span className="text-purple-400 font-semibold">Portal Alert Sent</span>
        </div>
      </div>

      {/* Metric 5: Rejected Payments */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-rose-500/40 transition-colors">
        <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider">
          <span>Rejected / Failed</span>
          <XCircle className="h-4 w-4 text-rose-400" />
        </div>
        <div className="text-xl font-mono font-bold text-rose-400 mt-1">
          {stats.rejectedCount} <span className="text-xs text-slate-400 font-normal">rejected</span>
        </div>
        <div className="text-[10px] font-mono text-slate-500 mt-1 flex items-center justify-between">
          <span>Invalid tx / name mismatch</span>
          <span className="text-rose-400 font-semibold">Action Logged</span>
        </div>
      </div>
    </div>
  );
};
