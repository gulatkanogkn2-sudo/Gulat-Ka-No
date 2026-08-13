import React from 'react';
import {
  Clock,
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  UserCheck,
  Building,
} from 'lucide-react';
import { ShippingTimelineEvent, ShippingStatus } from '../../../types/shipping';

interface ShippingTimelineVisualizerProps {
  timeline: ShippingTimelineEvent[];
  currentStatus: ShippingStatus;
}

export const ShippingTimelineVisualizer: React.FC<ShippingTimelineVisualizerProps> = ({
  timeline,
  currentStatus,
}) => {
  const getStatusIcon = (status: ShippingStatus) => {
    switch (status) {
      case 'PENDING_PACKING':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'PACKING':
        return <Package className="w-4 h-4 text-purple-400" />;
      case 'READY_FOR_PICKUP':
        return <Building className="w-4 h-4 text-cyan-400" />;
      case 'PICKED_UP':
      case 'IN_TRANSIT':
      case 'OUT_FOR_DELIVERY':
        return <Truck className="w-4 h-4 text-blue-400" />;
      case 'DELIVERED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'DELIVERY_FAILED':
      case 'RETURNED':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadgeClass = (status: ShippingStatus) => {
    switch (status) {
      case 'PENDING_PACKING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'PACKING':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'READY_FOR_PICKUP':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'PICKED_UP':
      case 'IN_TRANSIT':
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'DELIVERED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'DELIVERY_FAILED':
      case 'RETURNED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const sortedEvents = [...timeline].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-cyan-400" /> Shipping Timeline & Audit Log
        </h4>
        <span className="text-xs text-slate-500">{timeline.length} Recorded Milestones</span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {sortedEvents.map((evt, idx) => {
          const isLatest = idx === 0;
          return (
            <div key={evt.id || idx} className="relative group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center bg-slate-950 ${
                  isLatest
                    ? 'border-cyan-400 shadow-sm shadow-cyan-500/50 ring-2 ring-cyan-500/20'
                    : 'border-slate-800'
                }`}
              >
                {getStatusIcon(evt.status)}
              </div>

              {/* Event Box */}
              <div
                className={`p-3 rounded-lg border backdrop-blur-sm text-xs space-y-1 transition-all ${
                  isLatest
                    ? 'bg-slate-900/90 border-slate-700/80 shadow-md'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-90'
                }`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-semibold text-slate-100 flex items-center gap-2">
                    {evt.title}
                    {isLatest && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
                        Latest Step
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(evt.timestamp).toLocaleString()}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed">{evt.description}</p>

                <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1 border-t border-slate-800/40 flex-wrap">
                  {evt.operator && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <UserCheck className="w-3 h-3 text-cyan-400" /> Operator: {evt.operator}
                    </span>
                  )}
                  {evt.location && (
                    <span className="flex items-center gap-1 text-cyan-400">
                      <MapPin className="w-3 h-3 text-cyan-400" /> Location: {evt.location}
                    </span>
                  )}
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded border font-semibold ${getStatusBadgeClass(
                      evt.status
                    )}`}
                  >
                    {evt.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
