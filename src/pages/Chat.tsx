import { useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatArea from "@/components/chat/ChatArea";
import ProfileSidebar from "@/components/chat/ProfileSidebar";
import { ChatType } from "@/types/message";
import { useChatContext } from "@/contexts/ChatContext";

function ChatContent() {
  const { chats, messages, setMessages } = useChatContext();
  const [activeChat, setActiveChat] = useState<ChatType>();
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const handleChatSelect = (chat: ChatType) => {
    setActiveChat(chat);
    setIsProfileVisible(false);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden rounded-lg border">
      <ChatSidebar
        activeChat={activeChat}
        chats={chats}
        handleChatSelect={handleChatSelect}
      />

      <ChatArea
        setMessages={setMessages}
        key={activeChat?.user.id}
        activeChat={activeChat}
        closeChatArea={() => setActiveChat(undefined)}
        messages={messages}
        isProfileVisible={isProfileVisible}
        setIsProfileVisible={setIsProfileVisible}
      />

      {isProfileVisible && activeChat && (
        <ProfileSidebar
          activeConversation={activeChat}
          closeProfileView={() => setIsProfileVisible(false)}
        />
      )}
    </div>
  );
}

export default function Chat() {
  return (
    <main className="relative flex flex-1 flex-col gap-4 bg-background">
      <h1 className="ml-8 text-2xl font-bold">Chat</h1>

      {/* Chat content starting below the header */}
      <ChatContent />
    </main>
  );
}
