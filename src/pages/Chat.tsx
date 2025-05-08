import { useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatArea from "@/components/chat/ChatArea";
import ProfileSidebar from "@/components/chat/ProfileSidebar";
import { conversations, groupMessages, individualMessages } from "@/lib/data";
import { getInitials } from "@/lib/utils";

// Mock data for conversations
export type ChatType = {
  id: number;
  name: string;
  type: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  members?: {
    name: string;
    initials: string;
    image: string;
  }[];
  role?: "player" | "organizer";
};

function ChatContent() {
  const [activeConversation, setActiveConversation] = useState<ChatType>();
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
  const handleChatSelect = (chat: ChatType) => {
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
      role: "player" as ChatType["role"],
    };
    setChats([newChat, ...chats]);
    setNewChatName("");
    setNewChatType("individual");
    setIsNewChatDialogOpen(false);
    setActiveConversation(newChat);
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
    <div className="flex h-[calc(100vh-80px)] overflow-hidden rounded-lg border">
      <ChatSidebar
        handleCreateNewChat={handleCreateNewChat}
        isNewChatDialogOpen={isNewChatDialogOpen}
        setIsNewChatDialogOpen={setIsNewChatDialogOpen}
        newChatName={newChatName}
        setNewChatName={setNewChatName}
        newChatType={newChatType}
        setNewChatType={setNewChatType}
        activeConversation={activeConversation}
        chats={chats}
        handleChatSelect={handleChatSelect}
        handleDeleteChat={handleDeleteChat}
      />

      <ChatArea
        activeConversation={activeConversation}
        getMessageData={getMessageData}
        handleSendMessage={handleSendMessage}
        isProfileVisible={isProfileVisible}
        messageInput={messageInput}
        setIsProfileVisible={setIsProfileVisible}
        setMessageInput={setMessageInput}
        closeChatArea={() => setActiveConversation(undefined)}
      />

      {isProfileVisible && activeConversation && (
        <ProfileSidebar
          activeConversation={activeConversation}
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
      <div className="">
        <ChatContent />
      </div>
    </main>
  );
}
