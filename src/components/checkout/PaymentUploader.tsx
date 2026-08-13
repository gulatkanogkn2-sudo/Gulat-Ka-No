import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { PaymentProofFile } from '../../types/checkout';

interface PaymentUploaderProps {
  paymentProof: PaymentProofFile;
  onChange: (proof: PaymentProofFile) => void;
  className?: string;
  error?: string;
}

export const PaymentUploader: React.FC<PaymentUploaderProps> = ({
  paymentProof,
  onChange,
  className = '',
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE_MB = 10;

  const handleFileSelected = (file: File) => {
    setUploadError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Invalid file format. Please upload JPG, PNG, or WEBP image only.');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadError(`File exceeds maximum size limit of ${MAX_SIZE_MB}MB.`);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const sizeInKb = (file.size / 1024).toFixed(1);
    const formattedSize = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeInKb} KB`;

    onChange({
      file,
      previewUrl,
      fileName: file.name,
      fileSize: formattedSize,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    if (paymentProof.previewUrl) {
      URL.revokeObjectURL(paymentProof.previewUrl);
    }
    onChange({
      file: null,
      previewUrl: null,
      fileName: null,
      fileSize: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadError(null);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Upload className="w-4 h-4 text-[#00D9FF]" />
          4. Proof of Payment Upload <span className="text-red-400">*</span>
        </label>
        <span className="text-[10px] font-mono text-slate-400">
          Device File Only (JPG, PNG, WEBP max 10MB)
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelected(e.target.files[0]);
          }
        }}
      />

      {/* Upload Dropzone OR File Preview */}
      {!paymentProof.file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 sm:p-8 rounded-xl border-2 border-dashed text-center transition-all cursor-pointer group space-y-3 ${
            isDragging
              ? 'border-[#00D9FF] bg-[#00D9FF]/10 scale-[1.01]'
              : error || uploadError
              ? 'border-red-500/50 bg-red-500/5 hover:border-red-400'
              : 'border-white/20 bg-[#090D16]/90 hover:border-[#00D9FF]/50 hover:bg-white/5'
          }`}
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-white font-mono">
              Click to select proof image or drag and drop
            </p>
            <p className="text-[11px] font-mono text-slate-400">
              Attach receipt screenshot, deposit slip, or transaction reference image.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">JPG</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">PNG</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">WEBP</span>
          </div>
        </div>
      ) : (
        /* Image Preview Box with Remove & Replace controls */
        <div className="p-4 rounded-xl bg-[#090D16]/90 border border-[#00D9FF] space-y-3 shadow-[0_0_20px_rgba(0,217,255,0.15)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span>Payment Proof Staged</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                title="Replace proof image"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Image Thumbnail */}
            {paymentProof.previewUrl && (
              <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden border border-white/20 bg-black/60 relative flex-shrink-0 group">
                <img
                  src={paymentProof.previewUrl}
                  alt="Payment proof preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* File details */}
            <div className="space-y-1.5 text-xs font-mono flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-white font-bold truncate">
                <FileText className="w-4 h-4 text-[#00D9FF] flex-shrink-0" />
                <span className="truncate">{paymentProof.fileName}</span>
              </div>
              <p className="text-slate-400 text-[11px]">Size: {paymentProof.fileSize}</p>
              <div className="pt-2 text-[10px] text-[#00D9FF] flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                <span>Ready for admin verification in Phase 3</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation or Error Message */}
      {(uploadError || error) && (
        <div className="flex items-center gap-2 text-xs font-mono text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError || error}</span>
        </div>
      )}
    </div>
  );
};
