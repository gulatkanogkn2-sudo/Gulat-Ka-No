import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface BackButtonProps {
  label?: string;
  fallbackPath?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  fallbackPath,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else if (fallbackPath) {
      navigate(fallbackPath);
    } else {
      navigate('/');
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center space-x-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-[#00D9FF] transition-colors py-1 px-2 rounded hover:bg-white/5 active:scale-95 cursor-pointer ${className}`}
      aria-label="Go back to previous page"
    >
      <span className="text-sm">←</span>
      <span>{label}</span>
    </button>
  );
};
