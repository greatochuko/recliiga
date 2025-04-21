import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { EventsContent } from "@/components/events/EventsContent";

const queryClient = new QueryClient();

export default function ManageEvents() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="relative flex-1 bg-background">
        <h1 className="ml-8 text-2xl font-bold">Manage Events</h1>
        <EventsContent />
      </main>
    </QueryClientProvider>
  );
}
