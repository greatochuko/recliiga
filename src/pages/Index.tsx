
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { HomeScreen } from "@/components/dashboard/HomeScreen";

export default function Index() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <HomeScreen />
        </main>
      </div>
    </SidebarProvider>
  );
}
