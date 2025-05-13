import { useSidebar } from "../ui/sidebar";
import React, { useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChatType, MessageType } from "@/types/message";
import { markMessagesAsRead } from "@/api/message";
import ChatAreaHeader from "./ChatAreaHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";

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

  // const [loading, setLoading] = useState(false);

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

    const unreadMessages = chatMessages
      .filter((msg) => msg.toUserId === user?.id && !msg.isRead)
      .map((m) => m.id);

    if (unreadMessages.length) {
      markMessagesAsRead(unreadMessages);
    }
  }, [chatMessages, user?.id]);

  return (
    <section
      className={`flex w-full flex-1 flex-col ${activeChat ? (isProfileVisible ? (open ? "hidden xl:flex" : "hidden lg:flex") : "flex") : open ? "hidden lg:flex" : "hidden md:flex"}`}
    >
      {activeChat ? (
        <>
          <ChatAreaHeader
            activeChat={activeChat}
            closeChatArea={closeChatArea}
            isProfileVisible={isProfileVisible}
            setIsProfileVisible={setIsProfileVisible}
          />
          <ChatMessageList
            chatMessages={chatMessages}
            messageAreaRef={messageAreaRef}
            setMessages={setMessages}
          />
          <ChatInput
            activeChat={activeChat}
            setMessages={setMessages}
            user={user}
          />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-gray-500">
          Click on chat to start a conversation
        </div>
      )}
    </section>
  );
}
