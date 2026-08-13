import React, { useState } from 'react';
import {
  Truck,
  Edit3,
  Printer,
  Download,
  X,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { CourierName, ShippingStatus } from '../../../types/shipping';

interface ShippingBulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onBulkAssignCourier: (courier: CourierName) => void;
  onBulkUpdateStatus: (status: ShippingStatus) => void;
  onBulkPrintLabels: () => void;
  onBulkExport: (format: 'csv' | 'excel' | 'sheets') => void;
}

export const ShippingBulkActions: React.FC<ShippingBulkActionsProps> = ({
  selectedIds,
  onClearSelection,
  onBulkAssignCourier,
  onBulkUpdateStatus,
  onBulkPrintLabels,
  onBulkExport,
}) => {
  const [showCourierMenu, setShowCourierMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 rounded-2xl p-3 backdrop-blur-md flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 text-xs text-slate-100 max-w-2xl w-full mx-auto">
      {/* Selected Indicator */}
      <div className="flex items-center gap-2 pl-2 pr-3 border-r border-slate-800">
        <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center font-mono">
          {selectedIds.length}
        </span>
        <span className="font-medium text-slate-200 hidden sm:inline">
          {selectedIds.length === 1 ? 'Shipment Selected' : 'Shipments Selected'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-1 justify-center relative">
        {/* Bulk Assign Courier */}
        <div className="relative">
          <button
            onClick={() => {
              setShowCourierMenu(!showCourierMenu);
              setShowStatusMenu(false);
              setShowExportMenu(false);
            }}
            className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-lg border border-cyan-800 flex items-center gap-1.5 font-medium transition-colors"
          >
            <Truck className="w-3.5 h-3.5" /> Assign Courier
          </button>

          {showCourierMenu && (
            <div className="absolute bottom-full mb-2 left-0 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-1.5 space-y-1 z-50">
              <span className="block px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase">
                Assign Carrier to Selected
              </span>
              <button
                onClick={() => {
                  onBulkAssignCourier('DHL_EXPRESS');
                  setShowCourierMenu(false);
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs text-slate-200"
              >
                DHL Express Cold Chain
              </button>
              <button
                onClick={() => {
                  onBulkAssignCourier('FEDEX_LAB_EXPRESS');
                  setShowCourierMenu(false);
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs text-slate-200"
              >
                FedEx Lab Priority Express
              </button>
              <button
                onClick={() => {
                  onBulkAssignCourier('UPS_COLD_CHAIN');
                  setShowCourierMenu(false);
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs text-slate-200"
              >
                UPS Next Day Air Cryo
              </button>
              <button
                onClick={() => {
                  onBulkAssignCourier('USPS_PRIORITY');
                  setShowCourierMenu(false);
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs text-slate-200"
              >
                USPS Priority Express
              </button>
            </div>
          )}
        </div>

        {/* Bulk Update Status */}
        <div className="relative">
          <button
            onClick={() => {
              setShowStatusMenu(!showStatusMenu);
              setShowCourierMenu(false);
              setShowExportMenu(false);
            }}
            className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 text-purple-300 rounded-lg border border-purple-800 flex items-center gap-1.5 font-medium transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" /> Update Status
          </button>

          {showStatusMenu && (
            <div className="absolute bottom-full mb-2 left-0 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-1.5 space-y-1 z-50">
              <span className="block px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase">
                Set Status for Selected
              </span>
              <button
                onClick={() => {
                  onBulkUpdateStatus('PACKING');
                  setShowStatusMenu(false);
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs text-purple-300"
              >
                Packing In Progress
              </button>
              <button
                onClick={() => {
                  onBulkUpdateStatus('READY_FOR_PICKUP');
                  setShowStatusMenu(false);
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs text-cyan-300"
              >
                Ready for Pickup
              </button>
              <button
                onClick={() => {
                  onBulkUpdateStatus('IN_TRANSIT');
                  setShowStatusMenu(false);
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs text-blue-300"
              >
                In Transit
              </button>
              <button
                onClick={() => {
                  onBulkUpdateStatus('DELIVERED');
                  setShowStatusMenu(false);
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs text-emerald-300"
              >
                Delivered
              </button>
            </div>
          )}
        </div>

        {/* Bulk Print Labels */}
        <button
          onClick={onBulkPrintLabels}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 font-medium transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-slate-400" /> Print Labels
        </button>

        {/* Bulk Export */}
        <div className="relative">
          <button
            onClick={() => {
              setShowExportMenu(!showExportMenu);
              setShowCourierMenu(false);
              setShowStatusMenu(false);
            }}
            className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-lg border border-emerald-800 flex items-center gap-1.5 font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>

          {showExportMenu && (
            <div className="absolute bottom-full mb-2 right-0 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-1.5 space-y-1 z-50">
              <span className="block px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase">
                Export Selected Data
              </span>
              <button
                onClick={() => {
                  onBulkExport('csv');
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs text-emerald-300 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> CSV Format
              </button>
              <button
                onClick={() => {
                  onBulkExport('excel');
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs text-emerald-300 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Excel (.xls)
              </button>
              <button
                onClick={() => {
                  onBulkExport('sheets');
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded text-xs text-emerald-300 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Google Sheets CSV
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Clear Selection */}
      <button
        onClick={onClearSelection}
        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border-l border-slate-800 pl-3"
        title="Deselect All"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
