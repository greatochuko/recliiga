import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  ArrowLeftIcon,
  CheckCheckIcon,
  CheckIcon,
  EllipsisIcon,
  ImageIcon,
  SendIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { getInitials } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ChatType, MessageType } from "@/types/message";
import { markMessagesAsRead, sendMessage } from "@/api/message";
import { toast } from "sonner";
import { uploadImage } from "@/lib/uploadImage";

const imageFileExtensions = ["jpg", "jpeg", "png"];

const readFilesAsDataUrls = async (files: File[]): Promise<string[]> => {
  const previews = await Promise.all(
    files.map((f) => {
      const ext = f.name.split(".").at(-1)?.toLowerCase();
      if (!imageFileExtensions.includes(ext)) return Promise.resolve("");

      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === "string") resolve(e.target.result);
          else resolve("");
        };
        reader.readAsDataURL(f);
      });
    }),
  );
  return previews;
};

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
  const [messageInput, setMessageInput] = useState("");
  const [attachments, setAttachments] = useState<
    { previewUrl: string; file: File; id: string }[]
  >([]);

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

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!messageInput.trim() && attachments.length < 1) return;
    const newMessage: MessageType = {
      text: messageInput,
      toUserId: activeChat.user.id,
      toUser: activeChat.user,
      fromUserId: user.id,
      fromUser: user,
      images: attachments.map((att) => att.previewUrl),
      createdAt: new Date().toString(),
      isRead: false,
      id: new Date().getTime().toString(),
      updatedAt: new Date().toString(),
      notSent: true,
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessageInput("");
    setAttachments([]);

    // setLoading(true);

    const images = await Promise.all(
      attachments.map(async (att) => {
        const { url } = await uploadImage(att.file);
        return url;
      }),
    );

    const { data, error } = await sendMessage(
      messageInput,
      activeChat.user.id,
      images.filter(Boolean),
    );

    if (data) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...data, notSent: false } : msg,
        ),
      );
    } else {
      toast.error(error, { style: { color: "#ef4444" } });
    }

    // setLoading(false);
  }

  async function handleSelectAttachment(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = e.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const ext = files[i].name.split(".").at(-1)?.toLowerCase();
      if (
        imageFileExtensions.includes(ext) &&
        files[i].size <= 5 * 1024 * 1024
      ) {
        validFiles.push(files[i]);
      } else {
        toast.error(`${files[i].name} exceeds the 5MB size limit`, {
          style: { color: "#ef4444" },
        });
      }
    }

    if (validFiles.length) {
      const newPreviewUrls = await readFilesAsDataUrls(validFiles);

      setAttachments((prev) => [
        ...prev,
        ...validFiles.map((f, i) => ({
          id: Date.toString() + i,
          file: f,
          previewUrl: newPreviewUrls[i],
        })),
      ]);
    }

    e.target.value = "";
    e.target.files = null;
  }

  function handleDeleteAttachment(id: string) {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  }

  // console.log(messages);

  return (
    <section
      className={`flex w-full flex-1 flex-col ${activeChat ? (isProfileVisible ? (open ? "hidden xl:flex" : "hidden lg:flex") : "flex") : open ? "hidden lg:flex" : "hidden md:flex"}`}
    >
      {activeChat ? (
        <>
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 p-2 sm:gap-4 sm:p-4">
            <button
              onClick={closeChatArea}
              className="p-2 duration-200 hover:text-accent-orange lg:hidden"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div className="mr-auto flex items-center">
              <Avatar className="mr-3 h-10 w-10">
                <AvatarImage
                  src={activeChat.user.avatar_url}
                  alt={activeChat.user.full_name}
                  className="object-cover"
                />
                <AvatarFallback>
                  {/* {activeConversation.user.type === "group" ? (
                    <UsersIcon className="h-6 w-6 text-accent-orange" />
                  ) : (
                  )} */}
                  {getInitials(activeChat.user.full_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-inherit sm:text-lg">
                  {activeChat.user.full_name}
                </h3>
                <p className="text-xs text-[#707B81] sm:text-sm">
                  {/* {activeConversation.user.type === "group"
                    ? "Group Chat" :*/}
                  {activeChat.user.role === "organizer"
                    ? "League Organizer"
                    : "Player"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsProfileVisible(!isProfileVisible)}
                    >
                      <UserIcon className="h-5 w-5 text-[#707B81]" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isProfileVisible ? "Hide Details" : "Show Details"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div
            ref={messageAreaRef}
            className="flex-1 space-y-4 overflow-y-auto p-4"
          >
            {chatMessages.map((message) => {
              const isSender = message.fromUser.id === user.id;

              return (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    isSender ? "justify-end" : ""
                  }`}
                >
                  <div
                    className={`flex max-w-[70%] flex-col gap-1 rounded-2xl p-2.5 ${
                      isSender
                        ? "rounded-br-none bg-accent-orange text-white"
                        : "rounded-bl-none bg-gray-100"
                    }`}
                  >
                    {message.images.length > 0 && (
                      <div className="flex w-full flex-wrap gap-1 rounded-md">
                        {message.images.slice(0, 2).map((img, i) => (
                          <div
                            key={i}
                            className="group relative aspect-square min-w-20 overflow-hidden rounded"
                          >
                            <img
                              src={img}
                              alt="message image"
                              className="absolute left-0 top-0 h-full w-full bg-gray-100 object-cover"
                            />
                            {message.images.length > 2 && (
                              <div className="absolute left-0 top-0 hidden h-full w-full items-center justify-center bg-black/50 font-bold group-last:flex">
                                +{message.images.length - 2}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-end justify-end gap-2">
                      <p className="text-sm">{message.text}</p>
                      <span
                        className={`whitespace-nowrap text-[10px] font-medium ${isSender ? "text-white/70" : "text-gray-800/70"}`}
                      >
                        {format(message.createdAt, "p")}
                      </span>
                      {isSender &&
                        (message.notSent ? (
                          <EllipsisIcon className="h-3.5 w-3.5 text-white/60" />
                        ) : message.isRead ? (
                          <CheckCheckIcon
                            className={`h-3.5 w-3.5 text-white`}
                          />
                        ) : (
                          <CheckIcon className={`h-3.5 w-3.5 text-white/60`} />
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex w-full flex-col gap-2 border-t border-gray-200 p-2 sm:p-4">
            {attachments.length > 0 && (
              <ul className="flex w-full items-center gap-2 overflow-x-auto">
                {attachments.map((att) => (
                  <li
                    key={att.id}
                    className="flex max-w-16 flex-col items-end gap-1"
                  >
                    <div className="flex w-full items-center">
                      <p className="flex-1 truncate text-xs">{att.file.name}</p>
                      <button
                        onClick={() => handleDeleteAttachment(att.id)}
                        className="p-0.5 text-neutral-500 duration-200 hover:text-red-500"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </button>
                    </div>
                    <img
                      src={att.previewUrl}
                      alt={att.file.name}
                      className="aspect-square w-full rounded border object-cover"
                    />
                  </li>
                ))}
              </ul>
            )}
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type your message..."
                // disabled={loading}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 p-2 text-sm ring-accent-orange/50 ring-offset-2 duration-100 focus-visible:ring-2 disabled:bg-gray-100"
              />
              <label
                htmlFor="attachment"
                role="button"
                className="cursor-pointer rounded-md px-2.5 py-2.5 duration-200 hover:bg-gray-100"
                title="Attach files (Max size: 5MB)"
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  name="attachment"
                  id="attachment"
                  onChange={handleSelectAttachment}
                  hidden
                />
                <ImageIcon className="h-5 w-5 text-[#707B81]" />
              </label>
              <Button
                type="submit"
                disabled={!messageInput.trim() && attachments.length < 1}
                className="h-fit bg-accent-orange px-2.5 py-2.5 hover:bg-accent-orange/90"
              >
                {/* {loading ? (
                  <LoaderIcon className="h-5 w-5 animate-spin" />
                ) : ( */}
                <SendIcon className="h-5 w-5" />
                {/* )} */}
              </Button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-gray-500">
          Click on chat to start a conversation
        </div>
      )}
    </section>
  );
}
