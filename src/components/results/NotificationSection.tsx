
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

type NotificationProps = {
  title: string;
  notifications: {
    avatar: string;
    fallback: string;
    alt: string;
    message: string;
    time: string;
  }[];
};

export const NotificationSection = ({ title, notifications }: NotificationProps) => {
  return (
    <>
      <DropdownMenuLabel className="font-bold">{title}</DropdownMenuLabel>
      {notifications.map((notification, index) => (
        <DropdownMenuItem key={index} className="flex items-center py-2">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={notification.avatar} alt={notification.alt} />
            <AvatarFallback>{notification.fallback}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{notification.message}</p>
            <p className="text-xs text-gray-500">{notification.time}</p>
          </div>
        </DropdownMenuItem>
      ))}
    </>
  );
};
