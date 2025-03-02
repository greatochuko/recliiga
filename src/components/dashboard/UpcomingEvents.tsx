
import { EventCard } from "./EventCard";

export function UpcomingEvents() {
  const events = [
    {
      id: "1",
      date: "2023-06-20",
      time: "10:00 AM",
      location: "Main Field",
      team1: {
        name: "Red Dragons",
        avatar: "",
        color: "bg-red-500",
      },
      team2: {
        name: "Blue Tigers",
        avatar: "",
        color: "bg-blue-500",
      },
      rsvp_deadline: new Date("2023-06-19T10:00:00"),
      status: null,
      league: "Soccer League",
      hasResults: false,
      spotsLeft: 2,
    },
    {
      id: "2",
      date: "2023-06-22",
      time: "3:00 PM",
      location: "Courts",
      team1: {
        name: "Green Goblins",
        avatar: "",
        color: "bg-green-500",
      },
      team2: {
        name: "Yellow Jackets",
        avatar: "",
        color: "bg-yellow-500",
      },
      rsvp_deadline: new Date("2023-06-21T15:00:00"),
      status: null,
      league: "Basketball League",
      hasResults: false,
      spotsLeft: 1,
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
      <div className="space-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
