
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { HomeScreen } from "@/components/dashboard/HomeScreen";

export default function Index() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 bg-background">
          <div className="absolute top-4 left-4 z-50 md:hidden">
            <SidebarTrigger className="bg-white shadow-md" />
          </div>
          <HomeScreen />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
