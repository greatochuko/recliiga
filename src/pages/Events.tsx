import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { EventsList } from "@/components/events/EventsList";
import { upcomingEvents, pastEvents } from "@/components/events/MockEventData";

function EventsContent() {
  return <EventsList upcomingEvents={upcomingEvents} pastEvents={pastEvents} />;
}

export default function Events() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <main className="flex-1 bg-background relative">
          <div className="absolute top-4 left-4 z-50 flex items-center">
            <SidebarTrigger className="bg-white shadow-md" />
            <h1 className="ml-4 text-2xl font-bold">Events</h1>
          </div>
          <div className="pt-16">
            <EventsContent />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
