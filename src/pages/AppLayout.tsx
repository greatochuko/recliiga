import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="relative mx-auto flex max-w-5xl flex-1 px-6 py-4">
          <div className="top-4.5 absolute left-4 z-50 flex items-center">
            <SidebarTrigger className="z-[20] bg-white shadow-md" />
          </div>
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
