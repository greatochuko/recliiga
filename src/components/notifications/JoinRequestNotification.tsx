import { acceptLeagueRequest, declineLeagueRequest } from "@/api/league";
import { NotificationType } from "@/types/notification";
import { useState } from "react";

export default function JoinRequestNotification({
  notification,
  refetchNotifications,
}: {
  notification: NotificationType;
  refetchNotifications: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleAcceptRequest(
    notificationId: string,
    playerId: string,
    leagueId: string,
  ) {
    setLoading(true);
    const { error } = await acceptLeagueRequest(
      notificationId,
      playerId,
      leagueId,
    );
    if (!error) {
      refetchNotifications();
    }
    setLoading(false);
  }

  async function handleDeclineRequest(
    notificationId: string,
    playerId: string,
    leagueId: string,
  ) {
    setLoading(true);
    const { error } = await declineLeagueRequest(
      notificationId,
      playerId,
      leagueId,
    );
    if (!error) {
      refetchNotifications();
    }
    setLoading(false);
  }
  return (
    <div
      key={notification.id}
      className="flex cursor-default items-center gap-2 border-b border-gray-100 px-4 py-3 duration-200 hover:bg-gray-50"
    >
      <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
        {notification.initiator.avatar_url ? (
          <img
            src={notification.initiator.avatar_url}
            alt={notification.initiator.full_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-gray-700">
            {notification.initiator.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        )}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium">
          {notification.initiator.full_name}
        </p>
        <p className="text-xs text-gray-500">
          Requests to join {notification.league.name}
        </p>
      </div>

      <div className="ml-auto flex gap-2">
        <button
          className="h-7 rounded bg-accent-orange px-2 text-xs text-white duration-200 hover:bg-accent-orange/90"
          onClick={() =>
            handleAcceptRequest(
              notification.id,
              notification.initiator.id,
              notification.league.id,
            )
          }
          disabled={loading}
        >
          Accept
        </button>
        <button
          className="h-7 rounded border border-accent-orange px-2 text-xs text-accent-orange hover:bg-[#FFF5E6]"
          onClick={() =>
            handleDeclineRequest(
              notification.id,
              notification.initiator.id,
              notification.league.id,
            )
          }
          disabled={loading}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
