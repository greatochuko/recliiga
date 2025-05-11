import { UserType } from "@/contexts/AuthContext";

export type MessageType = {
  id: string;
  fromUserId: string;
  fromUser: UserType;
  toUserId: string;
  toUser: UserType;
  text: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ChatType = {
  user: UserType;
  lastMessage?: MessageType;
  messages: MessageType[];
  unreadMessages: number;
};
