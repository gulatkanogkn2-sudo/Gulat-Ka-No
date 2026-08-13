import React from 'react';
import {
  HardDrive,
  Image,
  FileText,
  FileCode,
  ShieldCheck,
  Package,
  Globe,
  Tag,
  Clock,
  Sparkles,
  Layers,
  FileCheck,
} from 'lucide-react';
import { MediaStats } from '../../../types/mediaLibrary';

interface MediaDashboardStatsProps {
  stats: MediaStats;
}

export const MediaDashboardStats: React.FC<MediaDashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* Total Assets */}
      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-cyan-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Total Assets
          </span>
          <div className="p-1.5 bg-cyan-950 text-cyan-400 rounded-xl border border-cyan-800/80">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-extrabold font-mono text-white mt-2">
          {stats.totalAssets}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">Centralized Media Index</div>
      </div>

      {/* Storage Usage */}
      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Storage Usage
          </span>
          <div className="p-1.5 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800/80">
            <HardDrive className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-extrabold font-mono text-emerald-300 mt-2">
          {stats.storageUsageFormatted}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">Supabase Bucket Volume</div>
      </div>

      {/* Images */}
      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl group hover:border-cyan-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Images
          </span>
          <div className="p-1.5 bg-cyan-950 text-cyan-400 rounded-xl border border-cyan-800/80">
            <Image className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-extrabold font-mono text-cyan-300 mt-2">
          {stats.imagesCount}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP, SVG</div>
      </div>

      {/* Documents & PDFs */}
      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl group hover:border-purple-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            PDFs & Documents
          </span>
          <div className="p-1.5 bg-purple-950 text-purple-400 rounded-xl border border-purple-800/80">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-extrabold font-mono text-purple-300 mt-2">
          {stats.documentsCount}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">{stats.pdfsCount} Verified PDFs</div>
      </div>

      {/* COAs & Protocols */}
      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl group hover:border-blue-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            COAs & Research
          </span>
          <div className="p-1.5 bg-blue-950 text-blue-400 rounded-xl border border-blue-800/80">
            <FileCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-extrabold font-mono text-blue-300 mt-2">
          {stats.coasCount}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">{stats.researchAssetsCount} Protocol Assets</div>
      </div>

      {/* Recent Uploads */}
      <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl group hover:border-amber-500/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Recent Uploads
          </span>
          <div className="p-1.5 bg-amber-950 text-amber-400 rounded-xl border border-amber-800/80">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-extrabold font-mono text-amber-300 mt-2">
          {stats.recentUploadsCount}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">Last 7 Days Activity</div>
      </div>
    </div>
  );
};
