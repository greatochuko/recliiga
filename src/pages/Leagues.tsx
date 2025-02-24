
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLeagueData } from "@/hooks/use-league-data";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, MapPin, Calendar, ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

const Leagues = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { userLeagues, allPublicLeagues, membershipStatus, joinLeague } = useLeagueData(user, null);

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
    return (
      !searchQuery || 
      league.name.toLowerCase().includes(searchLower) ||
      league.sport.toLowerCase().includes(searchLower) ||
      league.city.toLowerCase().includes(searchLower) ||
      (league.league_code && league.league_code.toLowerCase().includes(searchLower))
    );
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-gray-100">
          <div className="flex items-center justify-between p-4 bg-white shadow-sm">
            <SidebarTrigger />
          </div>
          <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Leagues</h1>
            
            <div className="relative flex items-center gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search by Name, Sport, League Code, City, or League Organizer"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button 
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-12"
              >
                Search
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {filteredLeagues?.map(league => {
                const isMember = membershipStatus[league.id] === 'member';
                
                return (
                  <div 
                    key={league.id} 
                    className="bg-white rounded-xl shadow-sm p-6"
                  >
                    <div className="flex items-start gap-6">
                      <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                        {league.logo_url ? (
                          <img 
                            src={league.logo_url} 
                            alt={league.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-semibold text-gray-400">
                            {league.name[0]}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                              {league.name}
                            </h2>
                            <div className="flex items-center gap-6 text-gray-500">
                              <div className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                <span>{league.member_count || 0} Players</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                <span>{league.city}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                <span>{format(new Date(league.created_at), 'd-MMM-yyyy')}</span>
                              </div>
                            </div>
                          </div>
                          
                          {league.league_code && (
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm font-medium">
                              {league.league_code}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium bg-orange-100 text-orange-800 px-3 py-1.5 rounded-md">
                            {league.sport}
                          </span>
                          
                          {isMember ? (
                            <Button 
                              variant="outline"
                              className="text-orange-500 border-orange-500 hover:bg-orange-50 min-w-[120px]"
                              onClick={() => navigate(`/leagues/${league.id}`)}
                            >
                              See More <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          ) : (
                            <Button 
                              className="bg-orange-500 hover:bg-orange-600 min-w-[120px]"
                              onClick={() => handleJoinLeague(league.id)}
                            >
                              Join <Plus className="h-4 w-4 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Leagues;
