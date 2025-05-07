import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router-dom";

export default function AppLayout() {
  const { pathname } = useLocation();
  const isInvitePage = pathname.startsWith("/invite");

  if (isInvitePage)
    return (
      <div
        className={`flex min-h-dvh w-full ${isInvitePage ? "bg-gradient-to-b from-accent-orange/10 to-white" : ""}`}
      >
        <Outlet />
      </div>
    );

  return (
    <SidebarProvider>
      <div
        className={`flex min-h-dvh w-full ${isInvitePage ? "bg-gradient-to-b from-accent-orange/10 to-white" : ""}`}
      >
        <AppSidebar />
        <div className="relative mx-auto flex w-full max-w-6xl flex-1 px-4 py-4 sm:px-6">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
