
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { HomeScreen } from "@/components/dashboard/HomeScreen";

export default function Index() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background relative">
          <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger className="bg-white shadow-md" />
          </div>
          <HomeScreen />
        </main>
      </div>
    </SidebarProvider>
  );
}
