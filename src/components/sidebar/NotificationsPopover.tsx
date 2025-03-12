import { useState } from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  title: string;
  time: string;
  isNew?: boolean;
}

interface JoinRequest {
  id: number;
  name: string;
  position: string;
  avatar: string;
  league: string;
  action: "accept" | "decline" | null;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "New message from Team A",
    time: "2 minutes ago",
    isNew: true,
  },
  {
    id: "2",
    title: "Upcoming event: Tournament Finals",
    time: "1 hour ago",
    isNew: true,
  },
  {
    id: "3",
    title: "League standings updated",
    time: "Yesterday, 3:45 PM",
  },
  {
    id: "4",
    title: "New team joined the league",
    time: "May 15, 2024",
  },
];

export function NotificationsPopover() {
  const { user } = useAuth();

  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([
    {
      id: 1,
      name: "Mehdi Taremi",
      position: "Defensive Midfielder",
      avatar: "/placeholder.svg",
      league: "Summer Soccer League",
      action: null,
    },
    {
      id: 2,
      name: "John Doe",
      position: "Forward",
      avatar: "/placeholder.svg",
      league: "Winter Futsal League",
      action: null,
    },
    {
      id: 3,
      name: "Jane Smith",
      position: "Goalkeeper",
      avatar: "/placeholder.svg",
      league: "Spring Tournament",
      action: null,
    },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const handleJoinRequest = (
    id: number,
    action: "accept" | "decline",
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setJoinRequests(
      joinRequests.map((request) =>
        request.id === id ? { ...request, action } : request
      )
    );
    setEditingId(null);
    console.log(`${action} join request for player ${id}`);
  };

  const totalNotifications = joinRequests.length + notifications.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-500" />
          <Badge
            variant="secondary"
            className="bg-[#FF7A00] text-white hover:bg-[#FF7A00]"
          >
            {totalNotifications}
          </Badge>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[400px] p-0" align="start">
        {user && user.role === "organizer" && joinRequests.length > 0 && (
          <>
            <DropdownMenuLabel className="p-4 font-bold">
              Join Requests
            </DropdownMenuLabel>
            {joinRequests.map((request) => (
              <DropdownMenuItem
                key={request.id}
                className="flex items-center py-3 px-4 hover:bg-gray-50 cursor-default"
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={request.avatar} alt={request.name} />
                  <AvatarFallback>
                    {request.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{request.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {request.position}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {request.action && editingId !== request.id
                      ? ""
                      : `Requests to join ${request.league}`}
                  </p>
                </div>
                {request.action && editingId !== request.id ? (
                  <div className="flex flex-col items-end">
                    <p className="text-xs text-muted-foreground">
                      {request.action === "accept" ? "Accepted" : "Declined"}{" "}
                      request
                    </p>
                    <button
                      className="text-xs text-[#F79602] hover:underline focus:outline-none"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingId(request.id);
                      }}
                    >
                      Edit Request
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 ml-2">
                    <Button
                      size="sm"
                      className="h-7 px-2 bg-[#F79602] hover:bg-[#E68A00] text-white text-xs"
                      onClick={(e) =>
                        handleJoinRequest(request.id, "accept", e)
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 border-[#F79602] text-[#F79602] hover:bg-[#FFF5E6] text-xs"
                      onClick={(e) =>
                        handleJoinRequest(request.id, "decline", e)
                      }
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}

        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold">New</h2>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                index < notifications.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
