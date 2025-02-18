
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  id: string;
  title: string;
  time: string;
  isNew?: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    title: 'New message from Team A',
    time: '2 minutes ago',
    isNew: true
  },
  {
    id: '2',
    title: 'Upcoming event: Tournament Finals',
    time: '1 hour ago',
    isNew: true
  },
  {
    id: '3',
    title: 'League standings updated',
    time: 'Yesterday, 3:45 PM'
  },
  {
    id: '4',
    title: 'New team joined the league',
    time: 'May 15, 2024'
  }
];

export function NotificationsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-500" />
          <Badge variant="secondary" className="bg-[#FF7A00] text-white">4</Badge>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold">New</h2>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                index < notifications.length - 1 ? 'border-b border-gray-100' : ''
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
      </PopoverContent>
    </Popover>
  );
}
