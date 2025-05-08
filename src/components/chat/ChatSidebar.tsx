import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { PlusIcon, SearchIcon, UsersIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React from "react";
import { ChatType } from "@/pages/Chat";
import { getInitials } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";

export default function ChatSidebar({
  isNewChatDialogOpen,
  setIsNewChatDialogOpen,
  newChatName,
  setNewChatName,
  newChatType,
  setNewChatType,
  handleCreateNewChat,
  activeConversation,
  chats,
  handleChatSelect,
}: {
  isNewChatDialogOpen: boolean;
  setIsNewChatDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newChatName: string;
  setNewChatName: React.Dispatch<React.SetStateAction<string>>;
  newChatType: string;
  setNewChatType: React.Dispatch<React.SetStateAction<string>>;
  handleCreateNewChat: () => void;
  chats: ChatType[];
  activeConversation: ChatType;
  handleChatSelect: (chat: ChatType) => void;
  handleDeleteChat: (id: number) => void;
}) {
  const { open } = useSidebar();

  return (
    <div
      className={`flex w-72 flex-col border-r border-gray-200 ${activeConversation ? (open ? "hidden lg:flex" : "hidden md:flex") : "flex flex-1"}`}
    >
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-inherit">Messages</h2>
          <Dialog
            open={isNewChatDialogOpen}
            onOpenChange={setIsNewChatDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-accent-orange hover:bg-accent-orange hover:text-white"
              >
                <PlusIcon className="mr-1 h-5 w-5" />
                New Chat
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Chat</DialogTitle>
                <DialogDescription>
                  Start a new conversation with a team member or create a group
                  chat.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <select
                    id="type"
                    value={newChatType}
                    onChange={(e) => setNewChatType(e.target.value)}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="individual">Individual</option>
                    <option value="group">Group</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateNewChat}>Create Chat</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
