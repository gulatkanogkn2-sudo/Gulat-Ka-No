import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline' | 'cyan' | 'purple' | 'magenta';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  glow = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-bold rounded-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050810] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer relative overflow-hidden group';

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#00D9FF] to-[#FF2ED1] text-white hover:brightness-110 shadow-[0_0_15px_rgba(0,217,255,0.4)] hover:shadow-[0_0_30px_rgba(255,46,209,0.5)] focus:ring-[#00D9FF] border border-white/20 hover:-translate-y-0.5',
    secondary:
      'bg-white/5 backdrop-blur-md text-white border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] focus:ring-white/30 hover:-translate-y-0.5',
    success:
      'bg-gradient-to-r from-[#00E676] to-[#059669] text-white hover:brightness-110 shadow-[0_0_15px_rgba(0,230,118,0.3)] hover:shadow-[0_0_25px_rgba(0,230,118,0.5)] focus:ring-[#00E676] border border-white/20 hover:-translate-y-0.5',
    danger:
      'bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white hover:brightness-110 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] focus:ring-[#EF4444] border border-white/20 hover:-translate-y-0.5',
    ghost:
      'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white focus:ring-white/20',
    outline:
      'bg-transparent border border-white/20 text-white hover:border-[#00D9FF] hover:text-[#00D9FF] hover:bg-[#00D9FF]/10 hover:shadow-[inset_0_0_20px_rgba(0,217,255,0.2),_0_0_20px_rgba(0,217,255,0.3)] focus:ring-[#00D9FF] backdrop-blur-sm transition-all duration-300',
    cyan:
      'bg-gradient-to-r from-[#00D9FF] to-[#0284C7] text-white hover:brightness-110 shadow-[0_0_15px_rgba(0,217,255,0.3)] hover:shadow-[0_0_25px_rgba(0,217,255,0.5)] focus:ring-[#00D9FF] border border-white/20 hover:-translate-y-0.5',
    purple:
      'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white hover:brightness-110 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] focus:ring-[#8B5CF6] border border-white/20 hover:-translate-y-0.5',
    magenta:
      'bg-gradient-to-r from-[#FF2ED1] to-[#BE185D] text-white hover:brightness-110 shadow-[0_0_15px_rgba(255,46,209,0.3)] hover:shadow-[0_0_25px_rgba(255,46,209,0.5)] focus:ring-[#FF2ED1] border border-white/20 hover:-translate-y-0.5',
  };

  const glowClassMap: Record<string, string> = {
    cyan: 'glow-cyan-lg',
    magenta: 'shadow-[0_0_15px_rgba(255,46,209,0.5)]',
    purple: 'shadow-[0_0_15px_rgba(139,92,246,0.5)]',
    primary: 'glow-cyan-lg',
  };
  const glowStyles = glow ? (glowClassMap[variant] || 'glow-cyan-lg') : '';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 min-h-[32px]',
    md: 'px-5 py-2.5 text-sm gap-2 min-h-[42px]',
    lg: 'px-8 py-3.5 text-base gap-2.5 min-h-[50px]',
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${glowStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none rounded-lg" />
      
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current relative z-10"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="relative z-10">Loading...</span>
        </>
      ) : (
        <span className="relative z-10 flex items-center justify-center gap-2 w-full">{children}</span>
      )}
    </button>
  );
};
