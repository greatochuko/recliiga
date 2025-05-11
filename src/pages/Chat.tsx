import { useMemo, useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatArea from "@/components/chat/ChatArea";
import ProfileSidebar from "@/components/chat/ProfileSidebar";

import { fetchLeaguesByUser } from "@/api/league";
import { useQuery } from "@tanstack/react-query";
import { useAuth, UserType } from "@/contexts/AuthContext";
import FullScreenLoader from "@/components/FullScreenLoader";

export type MessageType = {
  id: string;
  fromUser: UserType;
  toUser: UserType;
  text: string;
  time: Date;
};

const initialMessages: MessageType[] = [
  {
    id: "1",
    fromUser: {
      id: "cma6j5fq30000uomswzxhb60j",
      full_name: "John Doe",
    } as UserType,
    toUser: {
      id: "cma6mbp6e000muoeomnp6itwi",
      full_name: "David Smith",
    } as UserType,
    text: "Hey coach, I wanted to discuss our strategy for the upcoming game. Do you have any specific plays in mind?",
    time: new Date(),
  },
  {
    id: "2",
    fromUser: {
      id: "cma6j5fq30000uomswzxhb60j",
      full_name: "John Doe",
    } as UserType,
    toUser: {
      id: "cma6mbp6e000muoeomnp6itwi",
      full_name: "David Smith",
    } as UserType,
    text: "Hey coach, I wanted to discuss our strategy for the upcoming game. Do you have any specific plays in mind?",
    time: new Date(),
  },
  {
    id: "3",
    fromUser: {
      id: "cma6j5fq30000uomswzxhb60j",
      full_name: "John Doe",
    } as UserType,
    toUser: {
      id: "cma6mbp6e000muoeomnp6itwi",
      full_name: "David Smith",
    } as UserType,
    text: "Hey coach, I wanted to discuss our strategy for the upcoming game. Do you have any specific plays in mind?",
    time: new Date(),
  },
  {
    id: "4",
    toUser: {
      id: "cma6j5fq30000uomswzxhb60j",
      full_name: "John Doe",
    } as UserType,
    fromUser: {
      id: "cma6mbp6e000muoeomnp6itwi",
      full_name: "David Smith",
    } as UserType,
    text: "Hey coach, I wanted to discuss our strategy for the upcoming game. Do you have any specific plays in mind?",
    time: new Date(),
  },
  {
    id: "5",
    toUser: {
      id: "cma6j5fq30000uomswzxhb60j",
      full_name: "John Doe",
    } as UserType,
    fromUser: {
      id: "cma6mbp6e000muoeomnp6itwi",
      full_name: "David Smith",
    } as UserType,
    text: "Hey coach, I wanted to discuss our strategy for the upcoming game. Do you have any specific plays in mind?",
    time: new Date(),
  },
  {
    id: "6",
    toUser: {
      id: "cma6j5fq30000uomswzxhb60j",
      full_name: "John Doe",
    } as UserType,
    fromUser: {
      id: "cma6mbp6e000muoeomnp6itwi",
      full_name: "David Smith",
    } as UserType,
    text: "Hey coach, I wanted to discuss our strategy for the upcoming game. Do you have any specific plays in mind?",
    time: new Date(),
  },
];

export type ChatType = {
  user: UserType;
  lastMessage?: MessageType;
  messages: MessageType[];
  timestamp: string;
  unreadMessages: number;
};

function createChatFromPlayers(
  players: UserType[],
  messages: MessageType[],
  userId: string,
): ChatType[] {
  return players
    .filter((pl) => pl.id !== userId)
    .map((pl, i) => {
      const playerMessages = messages
        .filter(
          (msg) =>
            (msg.fromUser.id === userId && msg.toUser.id === pl.id) ||
            (msg.toUser.id === userId && msg.fromUser.id === pl.id),
        )
        .sort(
          (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
        );

      return {
        user: pl,
        lastMessage: playerMessages[0],
        messages: playerMessages,
        timestamp: "2:40 pm",
        unreadMessages: i,
      };
    });
}

function ChatContent() {
  const { user } = useAuth();

  const [activeChat, setActiveChat] = useState<ChatType>();
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);

  const { data, isLoading } = useQuery({
    queryKey: ["leagues"],
    queryFn: fetchLeaguesByUser,
  });

  const leagues = useMemo(() => data?.leagues || [], [data?.leagues]);

  const uniquePlayers = useMemo(
    () =>
      Array.from(
        new Map(
          leagues
            .flatMap((league) => league.players)
            .map((player) => [player.id, player]),
        ).values(),
      ),
    [leagues],
  );

  // useEffect(() => {
  //   if (uniquePlayers.length) {
  //   }
  // }, [messages, uniquePlayers, user.id]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  const handleChatSelect = (chat: ChatType) => {
    setActiveChat(chat);
    setIsProfileVisible(false);
  };

  const chats = createChatFromPlayers(uniquePlayers, messages, user.id);

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
