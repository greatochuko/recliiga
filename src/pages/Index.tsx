import { useEffect, useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import LeagueSetup from "@/components/LeagueSetup";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star, User, LogOut, Calendar, MapPin, Edit } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface League {
  id: string;
  name: string;
  sport: string;
  city: string;
  description: string | null;
  logo_url: string | null;
}

interface Event {
  id: string;
  date: string;
  time: string;
  location: string;
  team1: { name: string; avatar: string; color: string };
  team2: { name: string; avatar: string; color: string };
  rsvp_deadline: Date;
  status: string | null;
  league: string;
  hasResults: boolean;
  spotsLeft?: number;
}

interface PlayerStats {
  wins: number;
  losses: number;
  ties: number;
  points: number;
  leagues?: {
    name: string;
  };
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 ${star <= rating ? "text-[#FF7A00] fill-current" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};

function PlayerRankCard({ league }: { league: { name: string, playerName: string, rank: number, totalPlayers: number, rating: number } }) {
  return (
    <Card className="bg-[#FF7A00] text-white w-full h-full flex flex-col justify-between">
      <CardContent className="p-4 flex flex-col items-center h-full justify-between">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-base font-bold mb-2">{league.name}</h2>
          <Avatar className="w-16 h-16 mb-2">
            <AvatarImage src="/placeholder.svg" alt="Player avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <h3 className="text-sm font-semibold mb-1">{league.playerName}</h3>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-start">
            <div className="flex items-start">
              <span className="text-lg font-bold">{league.rank}</span>
              <span className="text-xs font-bold mt-0.5">th</span>
            </div>
            <span className="text-lg font-bold ml-0.5">/{league.totalPlayers}</span>
          </div>
          <span className="text-xs mt-1">{league.name}</span>
          <div className="flex items-center mt-2">
            <span className="text-base font-bold">{Math.max(0.50, Math.min(3.00, league.rating)).toFixed(2)}</span>
            <Star className="w-4 h-4 ml-1 fill-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const LeagueCard = ({ league }: { league: League }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="flex items-center gap-4">
        {league.logo_url && (
          <img src={league.logo_url} alt={league.name} className="w-12 h-12 rounded-full object-cover" />
        )}
        <div>
          <h3 className="text-xl font-bold">{league.name}</h3>
          <p className="text-sm text-gray-500">{league.sport} • {league.city}</p>
        </div>
      </CardTitle>
    </CardHeader>
    {league.description && (
      <CardContent>
        <p className="text-gray-600">{league.description}</p>
      </CardContent>
    )}
  </Card>
);

const Header = ({ onLogout }: { onLogout: () => void }) => (
  <header className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="text-2xl font-bold" style={{ color: '#9b87f5' }}>
          REC LiiGA
        </div>
        <Button 
          variant="ghost" 
          onClick={onLogout}
          className="text-gray-600 hover:text-gray-900"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  </header>
);

const CountdownClock = ({ deadline }: { deadline: Date }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = deadline.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60)
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <div className="text-xs text-gray-500 flex space-x-2">
      <span>{timeLeft.days}d</span>
      <span>{timeLeft.hours}h</span>
      <span>{timeLeft.minutes}m</span>
    </div>
  );
};

const EventCard = ({ event, showLeagueName = false }: { event: Event; showLeagueName?: boolean }) => {
  const [attendanceStatus, setAttendanceStatus] = useState(event.status || null);
  const isRsvpOpen = event.rsvp_deadline && new Date() < event.rsvp_deadline;
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  const handleAttend = async () => {
    try {
      await supabase
        .from('event_rsvps')
        .upsert({ 
          event_id: event.id,
          player_id: user?.id,
          status: 'attending'
        });
      setAttendanceStatus('attending');
      setIsEditing(false);
      toast.success('Successfully RSVP\'d to event');
    } catch (error) {
      toast.error('Failed to update RSVP status');
    }
  };

  const handleDecline = async () => {
    try {
      await supabase
        .from('event_rsvps')
        .upsert({ 
          event_id: event.id,
          player_id: user?.id,
          status: 'declined'
        });
      setAttendanceStatus('declined');
      setIsEditing(false);
      toast.success('Successfully declined event');
    } catch (error) {
      toast.error('Failed to update RSVP status');
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-xs text-gray-500 mr-4">{event.date}</span>
            <span className="text-xs text-gray-500 mr-4">{event.time}</span>
            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-xs text-gray-500">{event.location}</span>
          </div>
          {attendanceStatus === 'attending' && !isEditing && (
            <Badge variant="secondary" className="bg-[#FF7A00] bg-opacity-20 text-[#FF7A00] text-xs">
              Attending
            </Badge>
          )}
          {attendanceStatus === 'declined' && !isEditing && (
            <Badge variant="secondary" className="bg-red-100 text-red-600 text-xs">
              Declined
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-3 items-center justify-items-center mb-4">
          <div className="flex flex-col items-center">
            <Avatar className="w-16 h-16" style={{ backgroundColor: event.team1.color }}>
              <AvatarImage src={event.team1.avatar} alt={event.team1.name} />
              <AvatarFallback>{event.team1.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold mt-2">{event.team1.name}</span>
          </div>
          <span className="text-lg font-semibold">vs</span>
          <div className="flex flex-col items-center">
            <Avatar className="w-16 h-16" style={{ backgroundColor: event.team2.color }}>
              <AvatarImage src={event.team2.avatar} alt={event.team2.name} />
              <AvatarFallback>{event.team2.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold mt-2">{event.team2.name}</span>
          </div>
        </div>

        {showLeagueName && (
          <div className="absolute bottom-4 left-4 text-xs">
            <span className="font-bold text-[#FF7A00]">{event.league}</span>
          </div>
        )}

        <div className="flex justify-center mt-2 space-x-2">
          <Button 
            variant="outline" 
            className="text-[#FF7A00] border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white transition-colors"
          >
            {event.hasResults ? "View Results" : "View Details"}
          </Button>
        </div>

        {isRsvpOpen && (
          <>
            <div className="flex justify-center mt-2 space-x-2">
              {(isEditing || !attendanceStatus) && (
                <>
                  <Button 
                    className="bg-[#FF7A00] text-white hover:bg-[#FF7A00]/90"
                    onClick={handleAttend}
                  >
                    Attend
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={handleDecline}
                  >
                    Decline
                  </Button>
                </>
              )}
              {attendanceStatus && !isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit RSVP
                </Button>
              )}
            </div>
            <div className="flex justify-end items-center mt-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">RSVP in:</span>
                <CountdownClock deadline={event.rsvp_deadline} />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const Index = () => {
  const { user, signOut } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showLeagueSetup, setShowLeagueSetup] = useState(false);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/sign-in');
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, nickname, date_of_birth, sports')
          .eq('id', user?.id)
          .single();
        
        if (profile) {
          setUserRole(profile.role);
          
          // If user is a player and hasn't completed their profile, redirect to registration
          if (profile.role === 'player' && (!profile.nickname || !profile.date_of_birth || !profile.sports)) {
            navigate('/complete-registration');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user, navigate]);

  const { data: userLeagues } = useQuery({
    queryKey: ['userLeagues', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('league_members')
        .select(`
          league:league_id (
            id,
            name
          )
        `)
        .eq('player_id', user?.id);

      if (error) throw error;
      return data.map(item => item.league);
    },
    enabled: !!user && userRole === 'player',
  });

  useEffect(() => {
    if (userLeagues?.length && !selectedLeagueId) {
      setSelectedLeagueId(userLeagues[0].id);
    }
  }, [userLeagues]);

  const { data: playerStats, isLoading: statsLoading } = useQuery({
    queryKey: ['playerStats', selectedLeagueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_stats')
        .select(`
          wins,
          losses,
          ties,
          points,
          league:league_id (
            name
          )
        `)
        .eq('player_id', user?.id)
        .eq('league_id', selectedLeagueId)
        .single();

      if (error) throw error;
      return data || { wins: 0, losses: 0, ties: 0, points: 0 };
    },
    enabled: !!selectedLeagueId && !!user,
  });

  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['upcomingEvents', selectedLeagueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_dates (
            date,
            start_time,
            end_time
          ),
          event_rsvps (
            status
          )
        `)
        .eq('league_id', selectedLeagueId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data.map(event => ({
        id: event.id,
        date: new Date(event.event_dates[0].date).toLocaleDateString(),
        time: event.event_dates[0].start_time,
        location: event.location,
        team1: { 
          name: event.team1_name || 'Team 1',
          avatar: '/placeholder.svg',
          color: event.team1_color || '#272D31'
        },
        team2: { 
          name: event.team2_name || 'Team 2',
          avatar: '/placeholder.svg',
          color: event.team2_color || '#FFC700'
        },
        rsvp_deadline: new Date(event.event_dates[0].date),
        status: event.event_rsvps[0]?.status || null,
        league: event.league_id,
        hasResults: false,
        spotsLeft: event.roster_spots
      }));
    },
    enabled: !!selectedLeagueId,
  });

  if (!userRole) {
    return (
      <>
        <Header onLogout={handleLogout} />
        <div className="min-h-screen flex items-center justify-center">Loading...</div>
      </>
    );
  }

  if (userRole === 'player') {
    if (statsLoading || eventsLoading) {
      return (
        <>
          <Header onLogout={handleLogout} />
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF7A00]" />
          </div>
        </>
      );
    }

    const totalGames = (playerStats?.wins || 0) + (playerStats?.losses || 0) + (playerStats?.ties || 0);
    const winFraction = totalGames ? (playerStats?.wins || 0) / totalGames : 0;
    const lossFraction = totalGames ? (playerStats?.losses || 0) / totalGames : 0;
    const tieFraction = totalGames ? (playerStats?.ties || 0) / totalGames : 0;

    return (
      <>
        <Header onLogout={handleLogout} />
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Your Stats</h2>
                  {userLeagues && userLeagues.length > 0 && (
                    <Select value={selectedLeagueId || ''} onValueChange={setSelectedLeagueId}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select League" />
                      </SelectTrigger>
                      <SelectContent>
                        {userLeagues.map((league) => (
                          <SelectItem key={league.id} value={league.id}>
                            {league.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PlayerRankCard 
                    league={{
                      name: playerStats?.leagues?.name || 'Premier League',
                      playerName: user?.email?.split('@')[0] || 'Player',
                      rank: 8,
                      totalPlayers: 15,
                      rating: 2.5
                    }} 
                  />
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4">Record</h3>
                    <div className="space-y-4">
                      <div className="flex justify-center mb-4">
                        <div className="text-center">
                          <span className="text-3xl font-bold">{playerStats?.points || 0}</span>
                          <span className="text-gray-500 block">PTS</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-emerald-100 rounded p-2">
                          <div className="text-emerald-700 font-bold text-lg">{playerStats?.wins || 0}</div>
                          <div className="text-emerald-600 text-xs">Won</div>
                        </div>
                        <div className="bg-red-100 rounded p-2">
                          <div className="text-red-700 font-bold text-lg">{playerStats?.losses || 0}</div>
                          <div className="text-red-600 text-xs">Loss</div>
                        </div>
                        <div className="bg-orange-100 rounded p-2">
                          <div className="text-orange-700 font-bold text-lg">{playerStats?.ties || 0}</div>
                          <div className="text-orange-600 text-xs">Tied</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Rate Your Teammates</h2>
                  <Button variant="link" className="text-[#FF7A00] hover:text-[#FF7A00]/90">
                    View all
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 flex-grow">
                  {[1, 2, 3, 4].map((teammate) => (
                    <div
                      key={teammate}
                      className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">Player {teammate}</h3>
                          <p className="text-gray-500 text-xs">Midfielder</p>
                        </div>
                      </div>
                      <StarRating rating={3} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <section className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <Button variant="link" className="text-[#FF7A00] hover:text-[#FF7A00]/90">
                  View all
                </Button>
              </div>
              <div className="space-y-4">
                {upcomingEvents?.map(event => (
                  <EventCard key={event.id} event={event} showLeagueName={true} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header onLogout={handleLogout} />
      <div className="min-h-screen bg-gray-100">
        {!showLeagueSetup ? (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-[#FF7A00]">My Leagues</h1>
                <Button 
                  onClick={() => setShowLeagueSetup(true)}
                  className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
                >
                  Create New League
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#FF7A00]" />
                </div>
              ) : leagues?.length ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {leagues.map((league: League) => (
                    <LeagueCard key={league.id} league={league} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">You haven't created any leagues yet.</p>
                  <p className="text-gray-500 mt-2">Click the button above to create your first league!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <LeagueSetup onCancel={() => setShowLeagueSetup(false)} />
        )}
      </div>
    </>
  );
};

export default Index;
