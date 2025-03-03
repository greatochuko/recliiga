
import React, { ReactNode } from 'react';

interface ContentLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
}

export function ContentLayout({
  children,
  title,
  subtitle,
  actions,
  maxWidth = '4xl'
}: ContentLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    'full': 'max-w-full'
  };

  return (
    <div className={`container ${maxWidthClasses[maxWidth]} mx-auto p-4 md:p-6`}>
      {(title || actions) && (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            {title && <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>}
            {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="mt-4 md:mt-0">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
