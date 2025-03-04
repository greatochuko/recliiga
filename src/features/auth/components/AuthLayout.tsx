
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <Link to="/" className="mb-8">
        <h1 className="text-4xl font-bold text-[#FF7A00]">REC LiiGA</h1>
      </Link>
      
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-1">{title}</h2>
        {subtitle && <p className="text-center text-[#707B81] text-sm mb-6">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
