import { Button } from "../ui/button";
import { ImageIcon, SendIcon, TrashIcon } from "lucide-react";
import { handleImageResize, readFilesAsDataUrls } from "@/lib/utils";
import React, { useState } from "react";
import { ChatType, MessageType } from "@/types/message";
import { sendMessage } from "@/api/message";
import { toast } from "sonner";
import { uploadImage } from "@/lib/uploadImage";
import { UserType } from "@/contexts/AuthContext";

const imageFileExtensions = ["jpg", "jpeg", "png"];

export default function ChatInput({
  activeChat,
  user,
  setMessages,
}: {
  activeChat: ChatType;
  user: UserType;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}) {
  const [messageInput, setMessageInput] = useState("");
  const [attachments, setAttachments] = useState<
    { previewUrl: string; file: File; thumbnailFile: File; id: string }[]
  >([]);

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
      const thumbnailFiles = await Promise.all(
        validFiles.map(async (file) => {
          const { resizedFile } = await handleImageResize(file, 160);
          return resizedFile;
        }),
      );

      setAttachments((prev) => [
        ...prev,
        ...validFiles.map((f, i) => ({
          id: Date.toString() + i,
          file: f,
          thumbnailFile: thumbnailFiles[i],
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

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!messageInput.trim() && attachments.length < 1) return;
    const newMessage: MessageType = {
      text: messageInput,
      toUserId: activeChat.user.id,
      toUser: activeChat.user,
      fromUserId: user.id,
      fromUser: user,
      images: attachments.map((att, i) => ({
        url: att.previewUrl,
        thumbnailUrl: att.previewUrl,
        updatedAt: Date.now().toString(),
        createdAt: Date.now().toString(),
        filename: att.file.name,
        id: i + new Date().toString(),
      })),
      createdAt: new Date().toString(),
      isRead: false,
      id: new Date().getTime().toString(),
      updatedAt: new Date().toString(),
      status: "sending",
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessageInput("");
    setAttachments([]);

    // setLoading(true);

    const images: { filename: string; url: string; thumbnailUrl: string }[] =
      await Promise.all(
        attachments.map(async (att, i) => {
          const { url } = await uploadImage(att.file);
          const { url: thumbnailUrl } = await uploadImage(att.thumbnailFile);
          newMessage.images = newMessage.images.map((msg, idx) =>
            idx === i ? { ...msg, url, thumbnailUrl } : msg,
          );
          return { filename: att.file.name, url, thumbnailUrl };
        }),
      );

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === newMessage.id ? { ...msg, images: newMessage.images } : msg,
      ),
    );

    const { data } = await sendMessage(
      messageInput,
      activeChat.user.id,
      images.filter(Boolean),
    );

    if (data) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessage.id ? data : msg)),
      );
    } else {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "failed" } : msg,
        ),
      );
    }

    // setLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-2 border-t border-gray-200 p-2 sm:p-4">
      {attachments.length > 0 && (
        <ul className="flex w-full items-center gap-2 overflow-x-auto">
          {attachments.map((att) => (
            <li key={att.id} className="flex max-w-16 flex-col items-end gap-1">
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
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
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
  );
}
