import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="relative mx-auto flex max-w-6xl flex-1 px-4 py-4 sm:px-6">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
