import { MessageType } from "@/types/message";
import { sendMessage } from "@/api/message";
import ChatMessage from "./ChatMessage";

export default function ChatMessageList({
  setMessages,
  messageAreaRef,
  chatMessages,
}: {
  chatMessages: MessageType[];
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
    <div
      ref={messageAreaRef}
      className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
    >
      {chatMessages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          hadleResendMessage={hadleResendMessage}
        />
      ))}
    </div>
  );
}
