import { fetchLeaguesByUser } from "@/api/league";
import { fetchMessagesByUser } from "@/api/message";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth, UserType } from "./AuthContext";
import { ChatType, MessageType } from "@/types/message";
import Pusher from "pusher-js";
import RootLoadingScreen from "@/components/RootLoadingScreen";

const PUSHER_API_KEY = import.meta.env.VITE_PUSHER_API_KEY;

const ChatContext = createContext<{
  chats: ChatType[];
  messages: MessageType[];
  unreadMessages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}>({ chats: [], messages: [], setMessages: () => {}, unreadMessages: [] });

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
        ),
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
  const { user, loading: loadingAuth } = useAuth();
  const [messages, setMessages] = useState<MessageType[]>([]);

  const { data, isLoading: isLoadingLeagues } = useQuery({
    queryKey: ["leagues-for-messages", user?.id],
    queryFn: fetchLeaguesByUser,
  });

  const { data: messageData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["messages", user?.id],
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

    channel.bind(
      `incomingMessage-${user?.id}`,
      (data: { message: MessageType }) => {
        setMessages((prev) => [...prev, data.message]);
      },
    );

    channel.bind(
      `updatingMessage`,
      (data: { updatedMessages: MessageType[] }) => {
        setMessages((prev) =>
          prev.map(
            (msg) =>
              data.updatedMessages.find(
                (updatedMsg) => updatedMsg.id === msg.id,
              ) || msg,
          ),
        );
      },
    );

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

  const unreadMessages = messages.filter(
    (msg) => msg.toUserId === user?.id && !msg.isRead,
  );

  useEffect(() => {
    if (unreadMessages.length > 0) {
      document.title = `${unreadMessages.length} New Message${unreadMessages.length === 1 ? "" : "s"} - Recliiga`;
    } else {
      document.title = "Recliiga";
    }
  }, [unreadMessages]);

  if (loadingAuth || isLoadingLeagues || isLoadingMessages) {
    return <RootLoadingScreen />;
  }

  const chats = createChatFromPlayers(uniquePlayers, messages, user?.id);

  return (
    <ChatContext.Provider
      value={{ chats, messages, setMessages, unreadMessages }}
    >
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
