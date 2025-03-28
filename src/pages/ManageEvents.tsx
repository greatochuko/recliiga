import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { EventsContent } from "@/components/events/EventsContent";

// Create a queryClient for the entire page
const queryClient = new QueryClient();

// Export the page with the necessary sidebar and layout structure
export default function ManageEvents() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex w-full">
        <main className="flex-1 bg-background relative">
          <h1 className="ml-14 text-2xl font-bold">Manage Events</h1>
          <div className=" px-6">
            <EventsContent />
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
