import { useAuth } from "@/contexts/AuthContext";
import { NavigationMenu } from "./NavigationMenu";
import { LONavigationMenu } from "./LONavigationMenu";

export function ConditionalNavigationMenu({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const { user } = useAuth();
  const isLeagueOrganizer = user?.role === "organizer";

  return (
    <div className="flex h-full flex-col">
      <div className="flex-none">
        <NavigationMenu toggleSidebar={toggleSidebar} />
      </div>
      {isLeagueOrganizer && (
        <div className="flex-1">
          <LONavigationMenu toggleSidebar={toggleSidebar} />
        </div>
      )}
    </div>
  );
}
