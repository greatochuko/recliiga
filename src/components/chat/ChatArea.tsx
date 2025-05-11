import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ArrowLeftIcon, PaperclipIcon, SendIcon, UserIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { getInitials } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ChatType, MessageType } from "@/types/message";
import { sendMessage } from "@/api/message";
import { toast } from "sonner";
// import { individualMessages } from "@/lib/data";

export default function ChatArea({
  activeChat,
  isProfileVisible,
  setIsProfileVisible,
  closeChatArea,
  messages,
  setMessages,
}: {
  activeChat: ChatType;
  isProfileVisible: boolean;
  setIsProfileVisible: React.Dispatch<React.SetStateAction<boolean>>;
  closeChatArea: () => void;
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}) {
  const { user } = useAuth();

  const { open } = useSidebar();

  const [loading, setLoading] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  const messageAreaRef = useRef<HTMLDivElement>();

  const chatMessages = useMemo(
    () =>
      messages
        .filter(
          (msg) =>
            (msg.fromUser.id === user.id &&
              msg.toUser.id === activeChat?.user.id) ||
            (msg.toUser.id === user.id &&
              msg.fromUser.id === activeChat?.user.id),
        )
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
    [activeChat?.user.id, messages, user.id],
  );

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    messageAreaRef.current?.scroll({
      top: messageAreaRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatMessages]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setLoading(true);
    const { data, error } = await sendMessage(messageInput, activeChat.user.id);
    if (data) {
      setMessages((prev) => [...prev, data]);
      setMessageInput("");
    } else {
      toast.error(error, { style: { color: "#ef4444" } });
    }
    setLoading(false);
  }

  return (
    <section
      className={`flex flex-1 flex-col ${activeChat ? (isProfileVisible ? (open ? "hidden xl:flex" : "hidden lg:flex") : "flex") : open ? "hidden lg:flex" : "hidden md:flex"}`}
    >
      {activeChat ? (
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
                <h3 className="text-lg font-bold text-inherit">
                  {activeChat.user.full_name}
                </h3>
                <p className="text-sm text-[#707B81]">
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
          <div
            ref={messageAreaRef}
            className="flex-1 space-y-4 overflow-y-auto p-4"
          >
            {chatMessages.map((message) => {
              const isSender = message.fromUser.id === user.id;

              return (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    isSender ? "justify-end" : ""
                  }`}
                >
                  <div
                    className={`flex max-w-[70%] items-end gap-2 rounded-2xl p-3 ${
                      isSender
                        ? "rounded-br-none bg-accent-orange text-white"
                        : "rounded-bl-none bg-gray-100"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span
                      className={`whitespace-nowrap text-[10px] font-medium ${isSender ? "text-white/70" : "text-gray-800/70"}`}
                    >
                      {format(message.createdAt, "p")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-gray-200 p-4">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type your message..."
                disabled={loading}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 p-2 text-sm outline-none outline outline-offset-2 duration-100 focus-visible:outline-accent-orange/50"
              />
              <Button variant="ghost" size="icon" type="button">
                <PaperclipIcon className="h-5 w-5 text-[#707B81]" />
              </Button>
              <Button
                type="submit"
                disabled={loading}
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
