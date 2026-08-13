import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Download, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { ProductManagementService } from '../../../services/productManagementService';

interface ProductImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: () => void;
  activeStore?: string;
}

export const ProductImportModal: React.FC<ProductImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
  activeStore = 'groupbuy',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importLog, setImportLog] = useState<string[]>([]);

  if (!isOpen) return null;

  const storeLabel = activeStore === 'all' ? 'All Stores' : `${activeStore.toUpperCase()} Store`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setImportLog([]);
    }
  };

  const handleStartImport = () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setImportLog([`Reading file ${selectedFile.name}...`, `Target store: ${storeLabel}`]);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileContent = event.target?.result as string;
        if (!fileContent) {
          throw new Error('File content is empty.');
        }

        const res = await ProductManagementService.importProductsFromCsv(fileContent, activeStore);
        setImportLog((prev) => [...prev, ...res.log, 'Import process completed successfully!']);
        setIsProcessing(false);
        if (onImportComplete) onImportComplete();
      } catch (err: any) {
        console.error(err);
        setImportLog((prev) => [...prev, `ERROR: ${err.message || 'Failed to parse CSV file.'}`]);
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setImportLog((prev) => [...prev, 'ERROR: Failed to read local file.']);
      setIsProcessing(false);
    };

    reader.readAsText(selectedFile);
  };

  const downloadSampleTemplate = () => {
    let csvContent = '';
    let filename = `gkn_${activeStore}_sample.csv`;

    if (activeStore === 'onhand') {
      csvContent =
        'Product Name,Variant Name,Category,CAS Registry Number,Short Description,SKU,USD Retail Price,Manufacturer Cost,Minimum Order,Order Step,Inventory Quantity,Visibility,Status\n' +
        '"Semaglutide 5mg Vials","5mg Single Vial","OnHand","910463-68-2","In-stock ready to ship","GKN-SEMA-5MG",95.00,42.00,1,1,340,"Visible","Active"\n' +
        '"BPC-157 5mg Vials","5mg Single Vial","OnHand","863288-34-0","In-stock cold vault","GKN-BPC-5MG",45.00,20.00,1,1,120,"Visible","Active"\n';
    } else if (activeStore === 'moq') {
      csvContent =
        'Product Name,Variant Name,Category,CAS Registry Number,Short Description,SKU,USD Retail Price,Manufacturer Cost,Minimum Order,Order Step,Target Kits,MOQ Status,Visibility,Status\n' +
        '"Retatrutide 10mg","10mg (10 Vials / Tray)","Custom Synthesis","2381089-83-2","Custom synthesis batch","GKN-RETA-10MG-MOQ",340.00,180.00,5,1,100,"Collecting Orders","Visible","Active"\n';
    } else {
      // GroupBuy / Default
      csvContent =
        'Product Name,Variant Name,Category,CAS Registry Number,Short Description,SKU,USD Retail Price,Manufacturer Cost,Minimum Order,Order Step,Visibility,Status\n' +
        '"Tirzepatide","10mg","Active","2023788-19-2","Research peptide pre-order","GKN-TZ10-10MG",120.00,65.00,1,1,"Visible","Active"\n' +
        '"Semaglutide","5mg","Active","910463-68-2","GLP-1 pre-order","GKN-SEMA-5MG",95.00,42.00,1,1,"Visible","Active"\n';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans animate-fade-in">
      <div className="w-full max-w-xl bg-[#070B14] border border-[#00D9FF]/40 rounded-2xl shadow-[0_0_40px_rgba(0,217,255,0.2)] overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/90">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Import CSV — {storeLabel}</h3>
              <p className="text-[11px] text-slate-400">
                Bulk import products into {storeLabel}. Only Product Name & Variant Name required.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-white font-bold block">{activeStore.toUpperCase()} CSV Format</span>
              <span className="text-[10px] text-slate-400">
                Download store-specific sample CSV template.
              </span>
            </div>
            <button
              onClick={downloadSampleTemplate}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[#00D9FF] font-bold flex items-center gap-1.5 text-[11px] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              DOWNLOAD SAMPLE
            </button>
          </div>

          {/* Upload Dropzone */}
          <div className="p-6 rounded-2xl border-2 border-dashed border-[#00D9FF]/30 hover:border-[#00D9FF]/60 bg-slate-950/40 text-center space-y-3 transition-colors">
            <Upload className="w-8 h-8 text-[#00D9FF] mx-auto animate-pulse" />
            <div>
              <p className="text-white font-bold">Select CSV File to Upload</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Supports .csv files
              </p>
            </div>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-file-input"
            />
            <label
              htmlFor="csv-file-input"
              className="inline-block px-4 py-2 rounded-lg bg-[#00D9FF]/20 border border-[#00D9FF]/40 text-[#00D9FF] font-bold cursor-pointer hover:bg-[#00D9FF]/30 transition-colors"
            >
              CHOOSE FILE
            </label>

            {selectedFile && (
              <div className="pt-2 text-[#00D9FF] font-bold text-[11px] flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Loaded: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>

          {/* Import Logs */}
          {importLog.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-1 text-[11px] max-h-48 overflow-y-auto">
              <span className="text-slate-400 uppercase font-bold text-[9px]">IMPORT RESULTS LOG</span>
              {importLog.map((log, i) => (
                <div key={i} className="text-slate-300 flex items-center gap-1.5">
                  <span className="text-[#00D9FF]">›</span>
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white"
          >
            Close
          </button>
          <button
            onClick={handleStartImport}
            disabled={!selectedFile || isProcessing}
            className="px-5 py-2 rounded-lg bg-[#00D9FF] text-black font-bold disabled:opacity-50 hover:bg-[#00D9FF]/90 transition-colors shadow-[0_0_15px_rgba(0,217,255,0.4)]"
          >
            {isProcessing ? 'PARSING CSV...' : 'EXECUTE IMPORT'}
          </button>
        </div>
      </div>
    </div>
  );
};
