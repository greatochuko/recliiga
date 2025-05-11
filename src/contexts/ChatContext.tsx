import { fetchLeaguesByUser } from "@/api/league";
import { fetchMessagesByUser } from "@/api/message";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth, UserType } from "./AuthContext";
import { ChatType, MessageType } from "@/types/message";
import FullScreenLoader from "@/components/FullScreenLoader";
import Pusher from "pusher-js";

const PUSHER_API_KEY = import.meta.env.VITE_PUSHER_API_KEY;

const ChatContext = createContext<{
  chats: ChatType[];
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}>({ chats: [], messages: [], setMessages: () => {} });

function createChatFromPlayers(
  players: UserType[],
  messages: MessageType[],
  userId: string,
): ChatType[] {
  return players
    .filter((pl) => pl.id !== userId)
    .map((pl) => {
      const playerMessages = messages
        .filter(
          (msg) =>
            (msg.fromUser.id === userId && msg.toUser.id === pl.id) ||
            (msg.toUser.id === userId && msg.fromUser.id === pl.id),
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      return {
        user: pl,
        lastMessage: playerMessages[0],
        messages: playerMessages,
        unreadMessages: playerMessages.filter(
          (msg) => msg.fromUser.id !== userId && !msg.isRead,
        ).length,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.lastMessage?.createdAt || 0).getTime() -
        new Date(a.lastMessage?.createdAt || 0).getTime(),
    );
}

export default function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageType[]>([]);

  const { data, isLoading: isLoadingLeagues } = useQuery({
    queryKey: ["leagues"],
    queryFn: fetchLeaguesByUser,
  });

  const { data: messageData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["messages"],
    queryFn: fetchMessagesByUser,
  });

  const fetchedMessages = messageData?.data;

  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  useEffect(() => {
    const pusher = new Pusher(PUSHER_API_KEY, {
      cluster: "eu",
    });

    const channel = pusher.subscribe(`chat`);

    channel.bind("incomingMessage", (data: { message: MessageType }) => {
      const newMessage = data.message;
      if (newMessage.toUserId === user.id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [user?.id]);

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

  if (isLoadingLeagues || isLoadingMessages) {
    return <FullScreenLoader />;
  }

  const chats = createChatFromPlayers(uniquePlayers, messages, user?.id);

  return (
    <ChatContext.Provider value={{ chats, messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }

  return context;
}
