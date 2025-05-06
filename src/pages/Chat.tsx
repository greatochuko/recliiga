import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Send,
  Eye,
  Users,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data for conversations
const conversations = [
  {
    id: 1,
    name: "Team Chat",
    type: "group",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "Coach: Don't forget practice tomorrow at 6PM!",
    timestamp: "10:30 AM",
    unread: 2,
    members: Array(17)
      .fill(null)
      .map((_, index) => ({
        name: `Player ${index + 1}`,
        initials: `P${index + 1}`,
        image: "/placeholder.svg",
      })),
  },
  {
    id: 2,
    name: "John Smith",
    type: "individual",
    role: "player",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "Are you coming to the game on Saturday?",
    timestamp: "Yesterday",
    unread: 0,
  },
  {
    id: 3,
    name: "Sarah Davis",
    type: "individual",
    role: "organizer",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "Great game yesterday!",
    timestamp: "Tuesday",
    unread: 0,
  },
  {
    id: 4,
    name: "Premier League",
    type: "group",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "New game scheduled for next week",
    timestamp: "Monday",
    unread: 0,
    members: Array(12)
      .fill(null)
      .map((_, index) => ({
        name: `Player ${index + 1}`,
        initials: `P${index + 1}`,
        image: "/placeholder.svg",
      })),
  },
];

// Mock data for messages in the active conversation
const groupMessages = [
  {
    name: "Alex Johnson",
    message: "Hey everyone! Excited for the upcoming match. Any predictions?",
    time: "10:30 AM",
    initials: "AJ",
  },
  {
    name: "Sarah Lee",
    message: "I think it's going to be a close one. 2-1 to us!",
    time: "10:32 AM",
    initials: "SL",
  },
  {
    name: "Mike Brown",
    message: "Our defense has been solid lately. I'm predicting a clean sheet.",
    time: "10:35 AM",
    initials: "MB",
  },
  {
    name: "John Doe",
    message:
      "Great insights, team! Let's focus on our strengths during practice this week.",
    time: "10:40 AM",
    initials: "JD",
  },
  {
    name: "Alex Johnson",
    message: "Agreed, Coach! When's our next training session?",
    time: "10:42 AM",
    initials: "AJ",
  },
  {
    name: "John Doe",
    message:
      "We'll have an intensive session tomorrow at 4 PM. Be ready to work on our new formation!",
    time: "10:45 AM",
    initials: "JD",
  },
];
const individualMessages = [
  {
    name: "Contact",
    message:
      "Hey coach, I wanted to discuss our strategy for the upcoming game. Do you have any specific plays in mind?",
    time: "8:55 PM",
    initials: "CT",
  },
  {
    name: "John Doe",
    message:
      "Hi there! Yes, I've been working on a new offensive formation. Let's go over it at tomorrow's practice.",
    time: "8:59 PM",
    initials: "JD",
  },
  {
    name: "Contact",
    message:
      "Sounds great! Should we focus on our passing game or running plays?",
    time: "9:01 PM",
    initials: "CT",
  },
  {
    name: "John Doe",
    message:
      "I think we should emphasize our passing game. Our receivers have been showing great improvement lately.",
    time: "9:05 PM",
    initials: "JD",
  },
  {
    name: "Contact",
    message:
      "Agreed. I'll let the team know to be prepared for some intensive passing drills tomorrow.",
    time: "9:10 PM",
    initials: "CT",
  },
];
function ChatContent() {
  const [activeConversation, setActiveConversation] = useState(
    conversations[0],
  );
  const [messageInput, setMessageInput] = useState("");
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [newChatType, setNewChatType] = useState("individual");
  const [chats, setChats] = useState(conversations);
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      // In a real app, we would add the message to the conversation
      setMessageInput("");
    }
  };
  const handleChatSelect = (chat: any) => {
    setActiveConversation(chat);
    setIsProfileVisible(false);
  };
  const handleDeleteChat = (chatId: number) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);
    if (activeConversation && activeConversation.id === chatId) {
      setActiveConversation(updatedChats[0] || null);
    }
  };
  const handleCreateNewChat = () => {
    const newChat = {
      id: chats.length + 1,
      name: newChatName,
      type: newChatType,
      lastMessage: "",
      timestamp: "Just now",
      unread: 0,
      avatar: "/placeholder.svg?height=48&width=48",
      role: "player",
    };
    setChats([newChat, ...chats]);
    setNewChatName("");
    setNewChatType("individual");
    setIsNewChatDialogOpen(false);
    setActiveConversation(newChat);
  };
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  const getMessageData = (conversation: any) => {
    if (conversation.type === "group") {
      return groupMessages;
    } else {
      // Update the contact name in individual messages
      return individualMessages.map((msg) => {
        if (msg.name === "Contact") {
          return {
            ...msg,
            name: conversation.name,
            initials: getInitials(conversation.name),
          };
        }
        return msg;
      });
    }
  };
  return (
    <div className="p-4 md:p-6">
      <div className="flex h-[calc(100vh-120px)] overflow-hidden rounded-lg border">
        {/* Conversations sidebar */}
        <div className="flex w-80 flex-col border-r border-gray-200">
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
                    <Plus className="mr-1 h-5 w-5" />
                    New Chat
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Chat</DialogTitle>
                    <DialogDescription>
                      Start a new conversation with a team member or create a
                      group chat.
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
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#707B81]" />
              <Input
                type="search"
                placeholder="Search"
                className="focus:border-accent-orange focus:ring-accent-orange w-full border-[#707B81] pl-10 pr-4"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`relative flex cursor-pointer items-center space-x-3 p-4 ${
                  chat.id === activeConversation?.id
                    ? "before:bg-accent-orange bg-gray-100 before:absolute before:left-0 before:top-0 before:h-full before:w-1"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={chat.avatar} alt={chat.name} />
                    <AvatarFallback>
                      {chat.type === "group" ? (
                        <Users className="text-accent-orange h-6 w-6" />
                      ) : (
                        getInitials(chat.name)
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {chat.unread > 0 && (
                    <Badge
                      className="bg-accent-orange absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4 text-[#707B81]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={() => handleDeleteChat(chat.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <section className="flex flex-1 flex-col">
          {activeConversation && (
            <>
              <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <div className="flex items-center">
                  <Avatar className="mr-3 h-10 w-10">
                    <AvatarImage
                      src={activeConversation.avatar}
                      alt={activeConversation.name}
                    />
                    <AvatarFallback>
                      {activeConversation.type === "group" ? (
                        <Users className="text-accent-orange h-6 w-6" />
                      ) : (
                        getInitials(activeConversation.name)
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-inherit">
                      {activeConversation.name}
                    </h3>
                    <p className="text-sm text-[#707B81]">
                      {activeConversation.type === "group"
                        ? "Group Chat"
                        : activeConversation.role === "organizer"
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
                          onClick={() => setIsProfileVisible(!isProfileVisible)}
                        >
                          {isProfileVisible ? (
                            <ChevronRight className="h-5 w-5 text-[#707B81]" />
                          ) : (
                            <ChevronLeft className="h-5 w-5 text-[#707B81]" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isProfileVisible ? "Hide Details" : "Show Details"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {getMessageData(activeConversation).map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-2 ${
                      message.name === "John Doe" ? "justify-end" : ""
                    }`}
                  >
                    {message.name !== "John Doe" && (
                      <Avatar>
                        <AvatarFallback>{message.initials}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] ${
                        message.name === "John Doe"
                          ? "bg-accent-orange text-white"
                          : "bg-gray-100"
                      } rounded-lg p-3`}
                    >
                      <p className="text-sm font-medium">
                        {message.name}{" "}
                        <span className="text-xs font-normal opacity-70">
                          {message.time}
                        </span>
                      </p>
                      <p className="mt-1 text-sm">{message.message}</p>
                    </div>
                    {message.name === "John Doe" && (
                      <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 p-4">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center space-x-2"
                >
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="focus:border-accent-orange focus:ring-accent-orange flex-1 border-[#707B81]"
                  />
                  <Button variant="ghost" size="icon" type="button">
                    <Paperclip className="h-5 w-5 text-[#707B81]" />
                  </Button>
                  <Button
                    type="submit"
                    className="bg-accent-orange hover:bg-accent-orange/90"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </section>

        {/* Profile sidebar */}
        {isProfileVisible && activeConversation && (
          <aside className="w-64 border-l border-gray-200 p-4">
            <div className="flex flex-col items-center">
              <Avatar className="mb-4 h-24 w-24">
                <AvatarImage
                  src={activeConversation.avatar}
                  alt={activeConversation.name}
                />
                <AvatarFallback className="bg-accent-orange text-2xl text-white">
                  {activeConversation.type === "group" ? (
                    <Users className="h-12 w-12" />
                  ) : (
                    getInitials(activeConversation.name)
                  )}
                </AvatarFallback>
              </Avatar>
              <h4 className="text-accent-orange text-lg font-medium">
                {activeConversation.name}
              </h4>
              <p className="mb-2 text-sm text-[#707B81]">
                {activeConversation.type === "group"
                  ? "Group Chat"
                  : `${
                      activeConversation.role === "organizer"
                        ? "League Organizer"
                        : "Player"
                    } | New York`}
              </p>
              <p className="mb-8 text-sm text-[#707B81]">
                {activeConversation.type === "group"
                  ? `${activeConversation.members?.length || 0} members`
                  : "7:08 PM EST"}
              </p>
              <div className="w-full space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="text-accent-orange mr-2 h-4 w-4" />
                  {activeConversation.type === "group"
                    ? "View League Info"
                    : "View Profile"}
                </Button>
              </div>
              {activeConversation.type === "group" &&
                activeConversation.members && (
                  <div className="mt-4 w-full">
                    <h5 className="mb-2 text-sm font-medium text-[#707B81]">
                      Members
                    </h5>
                    <div className="max-h-[300px] overflow-y-auto">
                      {activeConversation.members.map((member, index) => (
                        <div
                          key={index}
                          className="mb-2 flex items-center space-x-2"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.image} alt={member.name} />
                            <AvatarFallback>{member.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-[#707B81]">
                            {member.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
export default function Chat() {
  return (
    <main className="relative flex-1 bg-background">
      <h1 className="ml-14 text-2xl font-bold">Chat</h1>

      {/* Chat content starting below the header */}
      <div className="">
        <ChatContent />
      </div>
    </main>
  );
}
