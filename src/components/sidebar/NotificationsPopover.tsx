import { useState, useRef, useEffect } from "react";
import {
  Bell,
  SparklesIcon,
  StarIcon,
  TrophyIcon,
  UserPlusIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotifications, readAllNotifications } from "@/api/notification";
import JoinRequestNotification from "../notifications/JoinRequestNotification";
import { getInitials } from "@/lib/utils";

export function NotificationsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, refetch } = useQuery({
    queryFn: fetchNotifications,
    queryKey: ["notifications"],
  });

  const notifications = data?.data || [];
  const joinRequests = notifications.filter((n) => n.type === "LEAGUE_REQUEST");
  const joinLeagutNotifications = notifications.filter(
    (n) => n.type === "JOIN_LEAGUE",
  );
  const otherNotifications = notifications.filter(
    (n) => n.type !== "LEAGUE_REQUEST",
  );
  const draftNotifications = notifications.filter(
    (n) => n.type === "PLAYER_DRAFTED",
  );
  const resultNotifications = notifications.filter(
    (n) => n.type === "RESULT_READY",
  );
  const ratingNotifications = notifications.filter(
    (n) => n.type === "RATE_TEAMMATES",
  );
  const captainSelectedNotifications = notifications.filter(
    (n) => n.type === "CAPTAIN_SELECTED",
  );
  const selectCaptainNotifications = notifications.filter(
    (n) => n.type === "SELECT_CAPTAIN",
  );
  const inputResultNotifications = notifications.filter(
    (n) => n.type === "INPUT_RESULTS",
  );

  const unreadNotifications = notifications.filter((notif) => !notif.isRead);

  const unreadNotificationCount = notifications.filter(
    (notif) => !notif.isRead || notif.type === "LEAGUE_REQUEST",
  ).length;

  async function toggleDropdown() {
    setIsOpen((prev) => !prev);
  }

  async function markAllAsRead() {
    setLoading(true);
    await readAllNotifications(unreadNotifications.map((notif) => notif.id));
    refetch();
    setLoading(false);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <button className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-gray-500" />
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button className="flex items-center gap-2 p-2" onClick={toggleDropdown}>
        <Bell className="h-5 w-5 text-gray-500" />
        {unreadNotificationCount > 0 && (
          <span className="ml-1 rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
            {unreadNotificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 z-10 mt-2 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {notifications.length > 0 ? (
            <div className="max-h-[340px] w-[340px]">
              {joinRequests.length > 0 && (
                <>
                  <div className="border-b border-gray-100 p-4 font-medium">
                    Join Requests
                  </div>
                  {joinRequests.map((notif) => (
                    <JoinRequestNotification
                      key={notif.id}
                      notification={notif}
                      refetchNotifications={refetch}
                    />
                  ))}
                </>
              )}
              {otherNotifications.length > 0 && (
                <>
                  <div className="sticky top-0 border-b border-gray-100 bg-white p-4 font-medium">
                    Updates
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {joinLeagutNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex cursor-default items-center border-b border-gray-100 px-4 py-3 duration-200 hover:bg-gray-50"
                      >
                        <div className="mr-2 h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                          {notif.initiator.avatar_url ? (
                            <img
                              src={notif.initiator.avatar_url}
                              alt={notif.initiator.full_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-medium text-gray-700">
                              {getInitials(notif.initiator.full_name)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {notif.initiator.full_name}{" "}
                            <span className="font-normal">
                              {" "}
                              Joined {notif.league.name}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                    {draftNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex cursor-default items-center border-b border-gray-100 px-4 py-3 duration-200 hover:bg-gray-50"
                      >
                        <UserPlusIcon className="mr-2 mt-1 h-4 w-4 self-start text-accent-orange" />
                        <div className="flex-1">
                          <p className="text-sm">
                            You have been drafted to{" "}
                            <span className="font-medium">
                              {notif.team.name}
                            </span>{" "}
                            for{" "}
                            <span className="font-medium">
                              {notif.event.title}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                    {resultNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex cursor-default items-center border-b border-gray-100 px-4 py-3 duration-200 hover:bg-gray-50"
                      >
                        <TrophyIcon className="mr-2 mt-1 h-4 w-4 self-start text-accent-orange" />
                        <div className="flex-1">
                          <p className="text-sm">
                            Results are out for{" "}
                            <span className="font-medium">
                              {notif.event.title}.
                            </span>{" "}
                            Check out the latest scores and rankings
                          </p>
                        </div>
                      </div>
                    ))}
                    {ratingNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex cursor-default items-center border-b border-gray-100 px-4 py-3 duration-200 hover:bg-gray-50"
                      >
                        <StarIcon className="mr-2 mt-1 h-4 w-4 self-start text-accent-orange" />
                        <div className="flex-1">
                          <p className="text-sm">
                            It's time to rate your teammates from{" "}
                            <span className="font-medium">
                              {notif.event.title}.
                            </span>{" "}
                            - share your feedback now!
                          </p>
                        </div>
                      </div>
                    ))}
                    {selectCaptainNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex cursor-default items-center border-b border-gray-100 px-4 py-3 duration-200 hover:bg-gray-50"
                      >
                        <SparklesIcon className="mr-2 mt-1 h-4 w-4 self-start text-accent-orange" />
                        <div className="flex-1">
                          <p className="text-sm">
                            Game on! Select the Captain for{" "}
                            <span className="font-medium">
                              {notif.event.title}.
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                    {captainSelectedNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex cursor-default items-center border-b border-gray-100 px-4 py-3 duration-200 hover:bg-gray-50"
                      >
                        <SparklesIcon className="mr-2 mt-1 h-4 w-4 self-start text-accent-orange" />
                        <div className="flex-1">
                          <p className="text-sm">
                            You have been selected as the captain for{" "}
                            <span className="font-medium">
                              {notif.team.name}
                            </span>
                            {" in "}
                            <span className="font-medium">
                              {notif.event.title}.
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                    {inputResultNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex cursor-default items-center border-b border-gray-100 px-4 py-3 duration-200 hover:bg-gray-50"
                      >
                        <SparklesIcon className="mr-2 mt-1 h-4 w-4 self-start text-accent-orange" />
                        <div className="flex-1">
                          <p className="text-sm">
                            It ain&apos;t over till the fat lady sings. Did she?
                            Input your results for{" "}
                            <span className="font-medium">
                              {notif.event.title}.
                            </span>{" "}
                            if it has ended.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="sticky bottom-0 border-t border-gray-100 bg-white p-2">
                <button
                  onClick={markAllAsRead}
                  disabled={!unreadNotifications.length || loading}
                  className="w-full rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white duration-200 hover:bg-accent-orange/90 disabled:pointer-events-none disabled:bg-accent-orange/50"
                >
                  Mark All as Read
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-[280px] w-[280px] flex-col items-center justify-center gap-2 p-4 text-center">
              <Bell className="h-10 w-10 text-accent-orange" />
              <p className="mt-2 font-medium text-gray-500">
                You're all caught up!
              </p>
              <p className="text-sm text-gray-400">
                No new notifications at the moment.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
