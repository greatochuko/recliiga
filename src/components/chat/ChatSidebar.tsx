import { SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatMessageTime, getInitials } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";
import { ChatType } from "@/types/message";

export default function ChatSidebar({
  activeChat,
  chats,
  handleChatSelect,
}: {
  activeChat: ChatType;
  chats: ChatType[];
  handleChatSelect: (chat: ChatType) => void;
}) {
  const { open } = useSidebar();

  return (
    <div
      className={`flex w-80 flex-col border-r border-gray-200 ${activeChat ? (open ? "hidden lg:flex" : "hidden md:flex") : open ? "flex-1 lg:flex-none" : "flex-1 md:flex-none"}`}
    >
      <div className="p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-inherit">Messages</h2>
        </div>
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#707B81]" />
          <input
            type="search"
            placeholder="Search groups and teammates..."
            className="w-full rounded-md border border-[#707B81] py-2 pl-10 pr-4 ring-accent-orange/50 ring-offset-2 focus:ring-2"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.user.id}
            className={`relative flex cursor-pointer items-center gap-2 p-4 ${
              chat.user.id === activeChat?.user.id
                ? "bg-gray-100 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-accent-orange"
                : "hover:bg-gray-50"
            }`}
            onClick={() => handleChatSelect(chat)}
          >
            <div className="relative">
              <Avatar>
                <AvatarImage
                  src={chat.user.avatar_url}
                  alt={chat.user.full_name}
                  className="object-cover"
                />
                <AvatarFallback
                  className={
                    chat.user.id === activeChat?.user.id ? "bg-gray-200" : ""
                  }
                >
                  {/* {chat.user.type === "group" ? (
                    <UsersIcon className="h-5 w-5 text-accent-orange" />
                  ) : (
                  )} */}
                  {getInitials(chat.user.full_name)}
                </AvatarFallback>
              </Avatar>
              {chat.unreadMessages.length > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-accent-orange p-0 text-xs"
                  aria-label={`${chat.unreadMessages.length} unread messages`}
                >
                  {chat.unreadMessages.length}
                </Badge>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`truncate font-medium ${
                    chat.user.id === activeChat?.user.id
                      ? "text-accent-orange"
                      : "text-gray-900"
                  }`}
                >
                  {chat.user.full_name}
                </p>
                {chat.lastMessage && (
                  <p className="text-xs text-[#707B81]">
                    {formatMessageTime(chat.lastMessage.createdAt)}
                  </p>
                )}
              </div>
              <p
                className={`truncate text-sm text-[#707B81] ${chat.lastMessage ? "" : "italic"}`}
              >
                {chat.lastMessage?.text || "No messages yet..."}
              </p>
            </div>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon className="h-4 w-4 text-[#707B81]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => handleDeleteChat(chat.id)}>
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        ))}
      </div>
    </div>
  );
}
