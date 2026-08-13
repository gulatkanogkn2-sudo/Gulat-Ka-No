import React from 'react';
import { CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react';
import { OrderDetail, TimelineStep } from '../../../types/order';
import { OrderManagementService } from '../../../services/orderManagementService';

interface OrderTimelineProps {
  order: OrderDetail;
  compact?: boolean;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ order, compact = false }) => {
  const steps: TimelineStep[] = OrderManagementService.getTimeline(order);
  const isCancelled = order.status === 'CANCELLED' || order.status === 'REFUNDED';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Clock className="h-4 w-4" /> Order Execution Timeline
        </h4>
        <span className="text-xs text-slate-400 font-mono">
          Status: <strong className="text-white">{order.status}</strong>
        </span>
      </div>

      {isCancelled ? (
        <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-lg flex items-center gap-3 text-rose-300 text-sm">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
          <div>
            <p className="font-medium">
              {order.status === 'CANCELLED' ? 'Order Cancelled' : 'Order Refunded'}
            </p>
            <p className="text-xs text-rose-400/80">
              This order pipeline has been stopped. Stock reservations and ledger holds are released.
            </p>
          </div>
        </div>
      ) : null}

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {steps.map((step, idx) => {
          return (
            <div key={idx} className="relative flex items-start group">
              {/* Step indicator node */}
              <div
                className={`absolute -left-6 top-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs transition-all ${
                  step.isCompleted
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                    : step.isCurrent
                    ? 'bg-amber-950 border-amber-400 text-amber-300 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : 'bg-slate-900 border-slate-700 text-slate-600'
                }`}
              >
                {step.isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 fill-cyan-950" />
                ) : step.isCurrent ? (
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                ) : (
                  <Circle className="h-2 w-2 text-slate-600" />
                )}
              </div>

              {/* Step content */}
              <div className="ml-2 flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      step.isCompleted
                        ? 'text-slate-100'
                        : step.isCurrent
                        ? 'text-amber-300 font-semibold'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.timestamp && (
                    <span className="text-xs font-mono text-slate-400">
                      {step.timestamp}
                    </span>
                  )}
                </div>

                {!compact && step.description && (
                  <p
                    className={`text-xs mt-0.5 ${
                      step.isCompleted
                        ? 'text-slate-400'
                        : step.isCurrent
                        ? 'text-amber-200/80'
                        : 'text-slate-600'
                    }`}
                  >
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
