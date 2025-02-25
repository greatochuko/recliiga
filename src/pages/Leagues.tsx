
import { useState, useCallback } from "react";
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

const Leagues = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { userLeagues, allPublicLeagues, membershipStatus, joinLeague } = useLeagueData(user, null);

  const handleJoinLeague = useCallback(async (leagueId: string) => {
    try {
      await joinLeague(leagueId);
      toast.success("Successfully joined league");
    } catch (error: any) {
      toast.error(`Error joining league: ${error.message || "Please try again"}`);
    }
  }, [joinLeague]);

  const searchLower = searchQuery.toLowerCase();
  const filteredLeagues = allPublicLeagues?.filter(league => {
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
        <main className="flex-1 bg-background">
          <div className="flex items-center justify-between p-4 bg-white border-b">
            <SidebarTrigger />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Leagues</h1>
              <p className="mt-2 text-gray-600">Browse and join sports leagues in your area</p>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search by Name, Sport, League Code, City, or League Organizer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base border-gray-200"
                  aria-label="Search Leagues"
                />
              </div>
              <Button 
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8"
                aria-label="Search leagues"
              >
                Search
              </Button>
            </div>

            <div className="grid gap-6">
              {filteredLeagues?.map((league) => (
                <div 
                  key={league.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex gap-6">
                    {/* League Logo */}
                    <div className="shrink-0">
                      <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center border-2 border-orange-100">
                        {league.logo_url ? (
                          <img 
                            src={league.logo_url}
                            alt={`${league.name} Logo`}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-semibold text-orange-500">
                            {league.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* League Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {league.name}
                          </h2>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span>{league.member_count || 0} Players</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{league.city}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{format(new Date(league.created_at), "MMM d, yyyy")}</span>
                            </div>
                          </div>
                        </div>
                        {league.league_code && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                            {league.league_code}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-50 text-orange-800">
                          {league.sport}
                        </span>
                        
                        {membershipStatus[league.id] === "member" ? (
                          <Button
                            variant="outline"
                            className="border-orange-500 text-orange-500 hover:bg-orange-50"
                            onClick={() => navigate(`/leagues/${league.id}`)}
                            aria-label={`View details for ${league.name}`}
                          >
                            See More <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                            onClick={() => handleJoinLeague(league.id)}
                            aria-label={`Join ${league.name}`}
                          >
                            Join <Plus className="ml-1 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
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
