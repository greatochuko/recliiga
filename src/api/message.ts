import { fetchApi } from "@/lib/utils";
import { MessageType } from "@/types/message";

export async function fetchMessagesByUser(): Promise<{
  data: MessageType[];
  error: string | null;
}> {
  const data = await fetchApi<MessageType[]>("/message");
  return { data: data.data || [], error: data.error };
}

export async function sendMessage(text: string, toUserId: string) {
  const data = await fetchApi<MessageType>("/message", {
    method: "POST",
    body: { text, toUserId },
  });
  return { data: data.data, error: data.error };
}
