
import { useAuth } from "@/contexts/AuthContext";
import { NavigationMenu } from "./NavigationMenu";
import { LONavigationMenu } from "./LONavigationMenu";

export function ConditionalNavigationMenu() {
  const { user } = useAuth();
  const isLeagueOrganizer = user?.user_metadata?.role === 'organizer';

  return (
    <>
      {isLeagueOrganizer && <LONavigationMenu />}
      <NavigationMenu />
    </>
  );
}
