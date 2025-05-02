import { fetchApi } from "@/lib/utils";
import { NotificationType } from "@/types/notification";

export async function fetchNotifications() {
  const data = await fetchApi<NotificationType[]>("/notification");
  return { data: data.data, error: data.error };
}

export async function readAllNotifications(notificationIds: string[]) {
  const data = await fetchApi<NotificationType[]>("/notification/read-all", {
    method: "POST",
    body: { notificationIds },
  });
  return { data: data.data, error: data.error };
}
