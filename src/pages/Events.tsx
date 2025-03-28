import { EventsList } from "@/components/events/EventsList";
import { upcomingEvents, pastEvents } from "@/components/events/MockEventData";

function EventsContent() {
  return <EventsList upcomingEvents={upcomingEvents} pastEvents={pastEvents} />;
}

export default function Events() {
  return (
    <div className="min-h-screen flex w-full">
      <main className="flex-1 bg-background relative">
        <h1 className="ml-14 text-2xl font-bold">Events</h1>
        <div className="">
          <EventsContent />
        </div>
      </main>
    </div>
  );
}
