import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ArrowLeftIcon, UserIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { getInitials } from "@/lib/utils";
import { ChatType } from "@/types/message";

export default function ChatAreaHeader({
  activeChat,
  closeChatArea,
  setIsProfileVisible,
  isProfileVisible,
}: {
  activeChat: ChatType;
  closeChatArea: () => void;
  setIsProfileVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isProfileVisible: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-gray-200 p-2 sm:gap-4 sm:p-4">
      <button
        onClick={closeChatArea}
        className="p-2 duration-200 hover:text-accent-orange lg:hidden"
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </button>
      <div className="mr-auto flex items-center">
        <Avatar className="mr-3 h-10 w-10">
          <AvatarImage
            src={activeChat.user.avatar_url}
            alt={activeChat.user.full_name}
            className="object-cover"
          />
          <AvatarFallback>
            {/* {activeConversation.user.type === "group" ? (
                      <UsersIcon className="h-6 w-6 text-accent-orange" />
                    ) : (
                    )} */}
            {getInitials(activeChat.user.full_name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-inherit sm:text-lg">
            {activeChat.user.full_name}
          </h3>
          <p className="text-xs text-[#707B81] sm:text-sm">
            {/* {activeConversation.user.type === "group"
                      ? "Group Chat" :*/}
            {activeChat.user.role === "organizer"
              ? "League Organizer"
              : "Player"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsProfileVisible((prev) => !prev)}
              >
                <UserIcon className="h-5 w-5 text-[#707B81]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isProfileVisible ? "Hide Details" : "Show Details"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
