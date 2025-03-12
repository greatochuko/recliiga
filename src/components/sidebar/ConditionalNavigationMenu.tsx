import { useAuth } from "@/contexts/AuthContext";
import { NavigationMenu } from "./NavigationMenu";
import { LONavigationMenu } from "./LONavigationMenu";

export function ConditionalNavigationMenu() {
  const { user } = useAuth();
  const isLeagueOrganizer = user?.role === "organizer";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <NavigationMenu />
      </div>
      {isLeagueOrganizer && (
        <div className="flex-1">
          <LONavigationMenu />
        </div>
      )}
    </div>
  );
}
