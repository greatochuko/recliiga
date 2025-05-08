import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChatType } from "@/pages/Chat";
import {
  ArrowLeftIcon,
  PaperclipIcon,
  SendIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { getInitials } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";

export default function ChatArea({
  activeConversation,
  isProfileVisible,
  setIsProfileVisible,
  getMessageData,
  messageInput,
  setMessageInput,
  handleSendMessage,
  closeChatArea,
}: {
  activeConversation: ChatType;
  isProfileVisible: boolean;
  setIsProfileVisible: React.Dispatch<React.SetStateAction<boolean>>;
  getMessageData: (conversation: any) => {
    name: string;
    initials: string;
    message: string;
    time: string;
  }[];
  messageInput: string;
  setMessageInput: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (e: React.FormEvent) => void;
  closeChatArea: () => void;
}) {
  const { open } = useSidebar();

  return (
    <section
      className={`flex flex-1 flex-col ${activeConversation ? (isProfileVisible ? (open ? "hidden xl:flex" : "hidden lg:flex") : "flex") : open ? "hidden lg:flex" : "hidden md:flex"}`}
    >
      {activeConversation ? (
        <>
          <div className="flex items-center justify-between gap-4 border-b border-gray-200 p-4">
            <button
              onClick={closeChatArea}
              className="p-2 duration-200 hover:text-accent-orange lg:hidden"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div className="mr-auto flex items-center">
              <Avatar className="mr-3 h-10 w-10">
                <AvatarImage
                  src={activeConversation.avatar}
                  alt={activeConversation.name}
                />
                <AvatarFallback>
                  {activeConversation.type === "group" ? (
                    <UsersIcon className="h-6 w-6 text-accent-orange" />
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
                className="flex-1 border-[#707B81] focus:border-accent-orange focus:ring-accent-orange"
              />
              <Button variant="ghost" size="icon" type="button">
                <PaperclipIcon className="h-5 w-5 text-[#707B81]" />
              </Button>
              <Button
                type="submit"
                className="bg-accent-orange hover:bg-accent-orange/90"
              >
                <SendIcon className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-gray-500">
          Click on chat to start a conversation
        </div>
      )}
    </section>
  );
}
