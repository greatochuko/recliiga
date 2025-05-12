import { UserType } from "@/contexts/AuthContext";

export type MessageType = {
  id: string;
  fromUserId: string;
  fromUser: UserType;
  toUserId: string;
  toUser: UserType;
  text: string;
  images: string[];
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  notSent: boolean;
};

export type ChatType = {
  user: UserType;
  lastMessage?: MessageType;
  messages: MessageType[];
  unreadMessages: MessageType[];
};
