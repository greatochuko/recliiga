
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function Chat() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background p-8">
          <h1 className="text-2xl font-bold">Chat</h1>
          <p className="text-gray-500 mt-2">Coming soon...</p>
        </main>
      </div>
    </SidebarProvider>
  );
}
