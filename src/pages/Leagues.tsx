
import { useAuth } from "@/contexts/AuthContext";
import { useLeagueData } from "@/hooks/use-league-data";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Leagues = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { userLeagues } = useLeagueData(user, null);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/sign-in');
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

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
            <h1 className="text-2xl font-bold mb-6">Your Leagues</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userLeagues?.map((league) => (
                <div 
                  key={league.id}
                  className="bg-white rounded-lg shadow-sm p-6 space-y-4"
                >
                  <div className="flex items-center gap-4">
                    {league.logo_url ? (
                      <img 
                        src={league.logo_url} 
                        alt={league.name} 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">
                          {league.name[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{league.name}</h3>
                      <p className="text-sm text-gray-600">{league.city}</p>
                    </div>
                  </div>
                  <p className="text-gray-600">{league.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      {league.sport}
                    </span>
                    <Button variant="outline" onClick={() => navigate(`/leagues/${league.id}`)}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Leagues;
