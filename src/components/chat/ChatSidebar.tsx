import { Input } from "../ui/input";
import { SearchIcon, UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChatType } from "@/pages/Chat";
import { getInitials } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";

export default function ChatSidebar({
  activeConversation,
  chats,
  handleChatSelect,
}: {
  activeConversation: ChatType;
  chats: ChatType[];
  handleChatSelect: (chat: ChatType) => void;
}) {
  const { open } = useSidebar();

  return (
    <div
      className={`flex w-72 flex-col border-r border-gray-200 ${activeConversation ? (open ? "hidden lg:flex" : "hidden md:flex") : "flex flex-1"}`}
    >
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-inherit">Messages</h2>
        </div>
        <div className="relative mb-4 w-full">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#707B81]" />
          <Input
            type="search"
            placeholder="Search"
            className="w-full border-[#707B81] pl-10 pr-4 focus:border-accent-orange focus:ring-accent-orange"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`relative flex cursor-pointer items-center gap-2 p-4 ${
              chat.id === activeConversation?.id
                ? "bg-gray-100 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-accent-orange"
                : "hover:bg-gray-50"
            }`}
            onClick={() => handleChatSelect(chat)}
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback>
                  {chat.type === "group" ? (
                    <UsersIcon className="h-5 w-5 text-accent-orange" />
                  ) : (
                    getInitials(chat.name)
                  )}
                </AvatarFallback>
              </Avatar>
              {chat.unread > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-accent-orange p-0 text-xs"
                  aria-label={`${chat.unread} unread messages`}
                >
                  {chat.unread}
                </Badge>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`truncate font-medium ${
                  chat.id === activeConversation?.id
                    ? "text-accent-orange"
                    : "text-gray-900"
                }`}
              >
                {chat.name}
              </p>
              <p className="truncate text-sm text-[#707B81]">
                {chat.lastMessage}
              </p>
            </div>
            <p className="text-xs text-[#707B81]">{chat.timestamp}</p>
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
