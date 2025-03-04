
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface PageLayoutProps {
  title?: string;
  children: React.ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
}

export function PageLayout({ title, children, showSidebar = true, showHeader = true }: PageLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {showSidebar && <AppSidebar />}
        <main className="flex-1 bg-background relative">
          {showHeader && (
            <div className="absolute top-4 left-4 z-50 flex items-center">
              <SidebarTrigger className="bg-white shadow-md" />
              {title && <h1 className="ml-4 text-2xl font-bold">{title}</h1>}
            </div>
          )}
          <div className={showHeader ? "pt-16" : ""}>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
