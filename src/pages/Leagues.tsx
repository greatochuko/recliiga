import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLeagueData } from "@/hooks/use-league-data";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Search, Users, MapPin, Calendar, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
const Leagues = () => {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    userLeagues,
    allPublicLeagues,
    membershipStatus,
    joinLeague
  } = useLeagueData(user, null);
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/sign-in');
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Error logging out');
    }
  };
  const handleJoinLeague = async (leagueId: string) => {
    try {
      await joinLeague(leagueId);
      toast.success('Successfully joined league');
    } catch (error) {
      toast.error('Error joining league');
    }
  };
  const filteredLeagues = allPublicLeagues?.filter(league => {
    const searchLower = searchQuery.toLowerCase();
    return !searchQuery || league.name.toLowerCase().includes(searchLower) || league.sport.toLowerCase().includes(searchLower) || league.city.toLowerCase().includes(searchLower) || league.league_code && league.league_code.toLowerCase().includes(searchLower);
  });
  return <SidebarProvider>
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
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-6">Leagues</h1>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input type="text" placeholder="Search by Name, Sport, League Code, City, or League Organizer" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Search
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeagues?.map(league => {
              const isMember = membershipStatus[league.id] === 'member';
              return <div key={league.id} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{league.name}</h3>
                      {league.league_code && <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                          {league.league_code}
                        </span>}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm">{league.member_count || 0} Players</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{league.city}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {format(new Date(league.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-sm font-medium bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        {league.sport}
                      </span>
                      
                      {isMember ? <Button variant="outline" className="text-orange-500 border-orange-500 hover:bg-orange-50" onClick={() => navigate(`/leagues/${league.id}`)}>
                          See More <ChevronRight className="h-4 w-4 ml-1" />
                        </Button> : <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => handleJoinLeague(league.id)}>
                          Join <Plus className="h-4 w-4 ml-1" />
                        </Button>}
                    </div>
                  </div>;
            })}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>;
};
export default Leagues;