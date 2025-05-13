import { UserType } from "@/contexts/AuthContext";

export type ImageType = {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type MessageType = {
  id: string;
  fromUserId: string;
  fromUser: UserType;
  toUserId: string;
  toUser: UserType;
  text: string;
  images: ImageType[];
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  status: "sent" | "sending" | "failed";
};

export type ChatType = {
  user: UserType;
  lastMessage?: MessageType;
  messages: MessageType[];
  unreadMessages: MessageType[];
};
