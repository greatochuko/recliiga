
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  logoAction?: () => void;
}

export function AuthLayout({ children, title, subtitle, logoAction }: AuthLayoutProps) {
  const handleLogoClick = () => {
    if (logoAction) {
      logoAction();
    } else {
      // Reset form and errors by refreshing
      window.location.href = window.location.pathname;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <h1 
        className="text-4xl font-bold text-[#FF7A00] mb-8 cursor-pointer hover:text-[#FF9A30] transition-colors" 
        onClick={handleLogoClick}
      >
        REC LiiGA
      </h1>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          {subtitle && <p className="text-[#707B81] text-sm">{subtitle}</p>}
        </div>
        
        {children}
      </div>
    </div>
  );
}
