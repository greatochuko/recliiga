
import { Link } from "react-router-dom";
import { EventCard } from "./EventCard";
import { Event } from "@/types/dashboard";

export function UpcomingEvents() {
  const events: Event[] = [
    {
      id: "1",
      date: "20-Aug-2025",
      time: "6:00 PM",
      location: "Allianz Arena",
      team1: {
        name: "Eagle Claws",
        avatar: "/placeholder.svg?height=64&width=64",
        color: "#272D31",
      },
      team2: {
        name: "Ravens",
        avatar: "/placeholder.svg?height=64&width=64",
        color: "#FFC700",
      },
      rsvpDeadline: new Date("2025-08-19T18:00:00"),
      status: "attending",
      league: "Premier League",
      hasResults: false,
    },
    {
      id: "2",
      date: "25-Aug-2025",
      time: "7:30 PM",
      location: "Stamford Bridge",
      team1: {
        name: "Blue Lions",
        avatar: "/placeholder.svg?height=64&width=64",
        color: "#034694",
      },
      team2: {
        name: "Red Devils",
        avatar: "/placeholder.svg?height=64&width=64",
        color: "#DA291C",
      },
      rsvpDeadline: new Date("2025-08-24T19:30:00"),
      status: null,
      league: "Championship",
      hasResults: false,
      spotsLeft: 2,
    },
  ];

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Upcoming Events</h2>
        <Link to="/events" className="text-[#FF7A00] hover:underline text-sm">View all</Link>
      </div>
      <div className="space-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} showLeagueName={true} />
        ))}
      </div>
    </section>
  );
}
