import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex py-4 relative">
          <div className="absolute top-4.5 left-4 z-50 flex items-center">
            <SidebarTrigger className="bg-white shadow-md z-[20]" />
          </div>
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
