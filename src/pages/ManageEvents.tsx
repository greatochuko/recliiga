
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { EventsContent } from "@/components/events/EventsContent";

// Create a queryClient for the entire page
const queryClient = new QueryClient();

// Export the page with the necessary sidebar and layout structure
export default function ManageEvents() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 bg-background relative">
            <div className="absolute top-4 left-4 z-50 flex items-center">
              <SidebarTrigger className="bg-white shadow-md" />
              <h1 className="ml-4 text-2xl font-bold">Manage Events</h1>
            </div>
            <div className="pt-16">
              <EventsContent />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
