import React from 'react';

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '7xl' | 'full';
  className?: string;
  padding?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = '7xl',
  className = '',
  padding = true,
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8' : '';

  return (
    <div className={`w-full mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
};
