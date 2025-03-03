
import React, { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
}

export function PageLayout({ children, title }: PageLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background relative">
          {title && (
            <div className="absolute top-4 left-4 z-50 flex items-center">
              <SidebarTrigger className="bg-white shadow-md" />
              <h1 className="ml-4 text-2xl font-bold">{title}</h1>
            </div>
          )}
          <div className={title ? "pt-16" : ""}>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
