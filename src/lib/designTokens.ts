// Official GKN V2 Design Tokens - Luxury Scientific Laboratory

export const colors = {
  // Backgrounds
  obsidian: '#050810',
  secondaryBg: '#0A0F1D',
  panelBg: '#0A0F1D',
  navBg: 'rgba(5, 8, 16, 0.85)',

  // Accents
  electricCyan: '#00D9FF',
  neonPurple: '#8B5CF6',
  laserMagenta: '#FF2ED1',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#38BDF8',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',

  // Borders
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  borderGlow: 'rgba(0, 229, 255, 0.3)',
} as const;

export const gradients = {
  primary: 'linear-gradient(135deg, #00D9FF 0%, #8B5CF6 100%)',
  secondary: 'linear-gradient(135deg, #00D9FF 0%, #FF2ED1 100%)',
  obsidianCard: 'linear-gradient(180deg, rgba(22, 31, 50, 0.7) 0%, rgba(11, 16, 32, 0.85) 100%)',
  glassOverlay: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
} as const;

export const glows = {
  cyanSoft: '0 0 20px rgba(0, 229, 255, 0.25)',
  purpleSoft: '0 0 20px rgba(124, 58, 237, 0.25)',
  magentaSoft: '0 0 20px rgba(255, 47, 211, 0.25)',
  cyanActive: '0 0 30px rgba(0, 229, 255, 0.45)',
} as const;

export const transitions = {
  fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  standard: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const borderRadius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  pill: '9999px',
} as const;
