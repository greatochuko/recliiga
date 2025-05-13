import {
  CheckCheckIcon,
  CheckIcon,
  CircleAlertIcon,
  EllipsisIcon,
} from "lucide-react";
import { format } from "date-fns";
import { MessageType } from "@/types/message";
import { sendMessage } from "@/api/message";
import { UserType } from "@/contexts/AuthContext";

export default function ChatMessageList({
  setMessages,
  messageAreaRef,
  chatMessages,
  user,
}: {
  chatMessages: MessageType[];
  user: UserType;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  messageAreaRef: React.MutableRefObject<HTMLDivElement>;
}) {
  async function hadleResendMessage(message: MessageType) {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === message.id ? { ...msg, status: "sending" } : msg,
      ),
    );

    const { data } = await sendMessage(
      message.text,
      message.toUserId,
      message.images,
    );

    if (data) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === message.id ? data : msg)),
      );
    } else {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, status: "failed" } : msg,
        ),
      );
    }
  }

  return (
    <div ref={messageAreaRef} className="flex-1 space-y-4 overflow-y-auto p-4">
      {chatMessages.map((message) => {
        const isSender = message.fromUser.id === user.id;

        return (
          <div
            key={message.id}
            className={`flex items-start space-x-2 ${
              isSender ? "justify-end" : ""
            }`}
          >
            <div className="flex max-w-[70%] flex-col items-end">
              <div
                className={`flex flex-col gap-1 rounded-2xl p-2.5 ${
                  isSender
                    ? "rounded-br-none bg-accent-orange text-white"
                    : "rounded-bl-none bg-gray-100"
                }`}
              >
                {message.images.length > 0 && (
                  <div className="flex w-full flex-wrap gap-1 rounded-md">
                    {message.images.slice(0, 2).map((img) => (
                      <div
                        key={img.id}
                        className="group relative aspect-square min-w-20 cursor-pointer overflow-hidden rounded"
                      >
                        <img
                          src={img.thumbnailUrl}
                          alt="message image"
                          className="absolute left-0 top-0 h-full w-full bg-gray-100 object-cover duration-200 group-hover:scale-105"
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
                    (message.status === "sending" ? (
                      <EllipsisIcon className="h-3.5 w-3.5 text-white/60" />
                    ) : message.status === "failed" ? (
                      <CircleAlertIcon className="h-3.5 w-3.5 text-red-200" />
                    ) : message.isRead ? (
                      <CheckCheckIcon className={`h-3.5 w-3.5 text-white`} />
                    ) : (
                      <CheckIcon className={`h-3.5 w-3.5 text-white/60`} />
                    ))}
                </div>
              </div>
              {message.status === "failed" && (
                <button
                  onClick={() => hadleResendMessage(message)}
                  className="text-xs text-neutral-500 duration-200 hover:text-neutral-800 hover:underline"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
