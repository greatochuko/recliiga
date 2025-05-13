import { useAuth } from "@/contexts/AuthContext";
import { MessageType } from "@/types/message";
import {
  CheckCheckIcon,
  CheckIcon,
  CircleAlertIcon,
  EllipsisIcon,
} from "lucide-react";
import { format } from "date-fns";
import ChatImagesModal from "./ChatImagesModal";
import { useState } from "react";

export default function ChatMessage({
  message,
  hadleResendMessage,
}: {
  message: MessageType;
  hadleResendMessage(message: MessageType): Promise<void>;
}) {
  const { user } = useAuth();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const isSender = message.fromUser.id === user.id;

  return (
    <>
      <div
        className={`flex items-start gap-2 ${isSender ? "justify-end" : ""}`}
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
                    onClick={() => setModalIsOpen(true)}
                    className="group relative aspect-square min-w-20 cursor-pointer overflow-hidden rounded"
                  >
                    <img
                      src={img.thumbnailUrl}
                      alt={img.filename}
                      className="absolute left-0 top-0 h-full w-full bg-gray-100 object-cover duration-200 group-hover:scale-110"
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
      <ChatImagesModal
        closeModal={() => setModalIsOpen(false)}
        open={modalIsOpen}
        images={message.images}
      />
    </>
  );
}
