
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import LeagueSetup from "@/components/LeagueSetup";
import { useNavigate } from 'react-router-dom';
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useLeagueData } from "@/hooks/use-league-data";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

const Index = () => {
  const { user, signOut } = useAuth();
  const { userRole } = useUserProfile(user);
  const [showLeagueSetup, setShowLeagueSetup] = useState(false);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { userLeagues, playerStats, upcomingEvents } = useLeagueData(user, selectedLeagueId);

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (userLeagues?.length && !selectedLeagueId) {
      setSelectedLeagueId(userLeagues[0].id);
    }
  }, [userLeagues]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/sign-in');
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  if (!userRole) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-gray-100">
          <div className="flex items-center justify-between p-4 bg-white shadow-sm">
            <SidebarTrigger />
            <Button onClick={handleLogout} variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-6">
            {showLeagueSetup ? (
              <LeagueSetup onCancel={() => setShowLeagueSetup(false)} />
            ) : (
              <DashboardContent
                userLeagues={userLeagues || []}
                selectedLeagueId={selectedLeagueId}
                setSelectedLeagueId={setSelectedLeagueId}
                playerStats={playerStats}
                upcomingEvents={upcomingEvents}
                userName={user?.email?.split('@')[0] || 'Player'}
                userRole={userRole}
                onCreateLeague={() => setShowLeagueSetup(true)}
              />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
