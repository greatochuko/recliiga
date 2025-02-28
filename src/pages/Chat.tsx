
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Mock data for conversations
const conversations = [
  {
    id: 1,
    name: "Team Chat",
    type: "group",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "Coach: Don't forget practice tomorrow at 6PM!",
    timestamp: "10:30 AM",
    unread: 2
  },
  {
    id: 2,
    name: "John Smith",
    type: "individual",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "Are you coming to the game on Saturday?",
    timestamp: "Yesterday",
    unread: 0
  },
  {
    id: 3,
    name: "Sarah Davis",
    type: "individual",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "Great game yesterday!",
    timestamp: "Tuesday",
    unread: 0
  },
  {
    id: 4,
    name: "Premier League",
    type: "group",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "New game scheduled for next week",
    timestamp: "Monday",
    unread: 0
  }
];

// Mock data for messages in the active conversation
const mockMessages = [
  {
    id: 1,
    sender: "Coach",
    content: "Don't forget practice tomorrow at 6PM!",
    timestamp: "10:30 AM",
    isCurrentUser: false
  },
  {
    id: 2,
    sender: "Mike",
    content: "I'll be there!",
    timestamp: "10:32 AM",
    isCurrentUser: false
  },
  {
    id: 3,
    sender: "Sarah",
    content: "Me too",
    timestamp: "10:35 AM",
    isCurrentUser: false
  },
  {
    id: 4,
    sender: "You",
    content: "I might be a few minutes late, traffic is bad in my area",
    timestamp: "10:40 AM",
    isCurrentUser: true
  },
  {
    id: 5,
    sender: "Coach",
    content: "No problem, just get here when you can. We'll be doing drills for the first 20 minutes.",
    timestamp: "10:42 AM",
    isCurrentUser: false
  }
];

function ChatContent() {
  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "You",
        content: messageInput,
        timestamp: "Just now",
        isCurrentUser: true
      };
      setMessages([...messages, newMessage]);
      setMessageInput("");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="pt-10 mb-6">
        <h2 className="text-2xl font-bold">Chat</h2>
      </div>
      
      <div className="flex h-[calc(100vh-180px)] border rounded-lg overflow-hidden">
        {/* Conversations sidebar */}
        <div className="hidden md:block w-1/3 max-w-xs border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg">Conversations</h3>
          </div>
          <div>
            {conversations.map((conversation) => (
              <div 
                key={conversation.id} 
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition-colors ${activeConversation.id === conversation.id ? 'bg-gray-100' : ''}`}
                onClick={() => setActiveConversation(conversation)}
              >
                <Avatar>
                  <AvatarImage src={conversation.avatar} alt={conversation.name} />
                  <AvatarFallback>{conversation.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium truncate">{conversation.name}</h4>
                    <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <div className="bg-[#FF7A00] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="p-4 border-b flex items-center gap-3">
            <Avatar>
              <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} />
              <AvatarFallback>{activeConversation.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{activeConversation.name}</h3>
              <p className="text-xs text-gray-500">
                {activeConversation.type === 'group' ? 'Group chat' : 'Individual chat'}
              </p>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.isCurrentUser ? 'bg-[#FF7A00] text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
                  {!message.isCurrentUser && (
                    <p className="text-xs font-semibold mb-1">{message.sender}</p>
                  )}
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isCurrentUser ? 'text-white text-opacity-70' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Message input */}
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button 
                type="submit" 
                className="bg-[#FF7A00] hover:bg-[#FF7A00]/90"
                disabled={!messageInput.trim()}
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background relative">
          <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger className="bg-white shadow-md" />
          </div>
          <ChatContent />
        </main>
      </div>
    </SidebarProvider>
  );
}
