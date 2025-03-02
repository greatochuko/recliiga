
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CheckCircle, Upload } from 'lucide-react';
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';

// Export the PlayerProfile type for use in other components
export interface PlayerProfile {
  nickname: string;
  dateOfBirth?: Date;
  date_of_birth?: string;
  city: string;
  sports: string[];
  positions: Record<string, string[]>;
  leagueCode?: string;
  avatar_url?: string;
}

const steps = [
  { id: 1, name: 'Personal Information' },
  { id: 2, name: 'Sports & Positions' },
  { id: 3, name: 'Confirmation & League Code' },
];

const sports = [
  "American Football", "Aussie Rules Football", "Ball Hockey", "Baseball", "Basketball", 
  "Cricket", "Field Hockey", "Futsal", "Gaelic Football", "Handball", "Hurling", 
  "Ice Hockey", "Inline Hockey", "Lacrosse", "Netball", "Polo", "Rugby", "Soccer", 
  "Softball", "Ultimate Frisbee", "Volleyball", "Water Polo", "Other"
];

const positions = {
  "American Football": ["Quarterback", "Running Back", "Wide Receiver", "Tight End", "Offensive Lineman", "Defensive Lineman", "Linebacker", "Cornerback", "Safety"],
  "Aussie Rules Football": ["Full Forward", "Centre Half-Forward", "Half-Forward Flank", "Forward Pocket", "Wing", "Centre", "Ruck", "Ruck-Rover", "Rover", "Half-Back Flank", "Centre Half-Back", "Full Back"],
  "Ball Hockey": ["Forward", "Defense", "Goalie"],
  "Baseball": ["Pitcher", "Catcher", "First Baseman", "Second Baseman", "Third Baseman", "Shortstop", "Left Fielder", "Center Fielder", "Right Fielder"],
  "Basketball": ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"],
  "Cricket": ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"],
  "Field Hockey": ["Forward", "Midfielder", "Defender", "Goalkeeper"],
  "Futsal": ["Goalkeeper", "Defender", "Winger", "Pivot"],
  "Gaelic Football": ["Goalkeeper", "Full Back", "Half Back", "Midfielder", "Half Forward", "Full Forward"],
  "Handball": ["Goalkeeper", "Left Wing", "Left Back", "Center Back", "Right Back", "Right Wing", "Pivot"],
  "Hurling": ["Goalkeeper", "Full Back", "Half Back", "Midfielder", "Half Forward", "Full Forward"],
  "Ice Hockey": ["Center", "Left Wing", "Right Wing", "Defenseman", "Goaltender"],
  "Inline Hockey": ["Forward", "Defenseman", "Goalie"],
  "Lacrosse": ["Attack", "Midfield", "Defense", "Goalkeeper"],
  "Netball": ["Goal Shooter", "Goal Attack", "Wing Attack", "Center", "Wing Defense", "Goal Defense", "Goal Keeper"],
  "Polo": ["Number 1 (Attack)", "Number 2 (Midfield)", "Number 3 (Defense)", "Number 4 (Back)"],
  "Rugby": ["Prop", "Hooker", "Lock", "Flanker", "Number 8", "Scrum-half", "Fly-half", "Center", "Wing", "Full-back"],
  "Soccer": ["Goalkeeper", "Defender", "Midfielder", "Forward"],
  "Softball": ["Pitcher", "Catcher", "First Base", "Second Base", "Third Base", "Shortstop", "Left Field", "Center Field", "Right Field"],
  "Ultimate Frisbee": ["Handler", "Cutter"],
  "Volleyball": ["Outside Hitter", "Opposite Hitter", "Setter", "Middle Blocker", "Libero"],
  "Water Polo": ["Goalkeeper", "Center Forward", "Center Back", "Wing", "Driver"],
  "Other": ["Not Specified"]
};

const PlayerRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [playerData, setPlayerData] = useState<PlayerProfile>({
    nickname: '',
    dateOfBirth: undefined,
    city: '',
    sports: [] as string[],
    positions: {} as Record<string, string[]>,
    leagueCode: '',
    avatar_url: ''
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user, navigate]);

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Format the data according to our backend requirements
        const formattedData = {
          nickname: playerData.nickname,
          date_of_birth: playerData.dateOfBirth?.toISOString() || '',
          city: playerData.city,
          sports: playerData.sports,
          positions: Object.entries(playerData.positions)
            .flatMap(([_, positionArray]) => positionArray as string[]),
          avatar_url: playerData.avatar_url,
          profile_completed: true // Mark profile as completed
        };

        // Update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update(formattedData)
          .eq('id', user?.id);

        if (profileError) throw profileError;
        
        // If league code provided, join league (this is just a placeholder for now)
        if (playerData.leagueCode) {
          const { data: league, error: leagueError } = await supabase
            .from('leagues')
            .select('id')
            .eq('league_code', playerData.leagueCode)
            .maybeSingle();

          if (leagueError) throw leagueError;
          
          if (league) {
            const { error: joinError } = await supabase
              .from('league_members')
              .insert({
                league_id: league.id,
                player_id: user?.id,
              });

            if (joinError) throw joinError;
          } else {
            toast.error('Invalid league code');
            return;
          }
        }
        
        // Update user metadata to indicate profile is complete
        const { error: updateError } = await supabase.auth.updateUser({
          data: { profile_completed: true }
        });
        
        if (updateError) throw updateError;
        
        toast.success('Profile updated successfully!');
        // Redirect to home page after successful registration
        navigate('/');
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePlayerData = (newData: Partial<PlayerProfile>) => {
    setPlayerData(prevData => ({ ...prevData, ...newData }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <RouterLink to="/" className="inline-block">
            <span className="text-4xl font-bold text-[#FF7A00]">REC LiiGA</span>
          </RouterLink>
          <nav>
            {/* Add navigation items here if needed */}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <div className="sticky top-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Registration Progress</h2>
              <ol className="relative border-l border-gray-200">
                {steps.map((step) => (
                  <li key={step.id} className="mb-10 ml-6">
                    <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white ${
                      step.id === currentStep ? 'bg-[#FF7A00] text-white' : 
                      step.id < currentStep ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {step.id < currentStep ? <CheckCircle className="w-5 h-5" /> : step.id}
                    </span>
                    <h3 className={`font-medium leading-tight ${
                      step.id === currentStep ? 'text-[#FF7A00]' : 'text-[#707B81]'
                    }`}>{step.name}</h3>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="w-full md:w-3/4">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Player Registration</h1>
            
            {currentStep === 1 && (
              <PersonalInformation 
                playerData={playerData} 
                updatePlayerData={updatePlayerData}
              />
            )}
            {currentStep === 2 && (
              <SportsAndPositions 
                playerData={playerData} 
                updatePlayerData={updatePlayerData}
                sports={sports}
                positions={positions}
              />
            )}
            {currentStep === 3 && (
              <ConfirmationAndLeagueCode 
                playerData={playerData} 
                updatePlayerData={updatePlayerData}
              />
            )}

            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button 
                className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white"
                onClick={handleNext}
              >
                {currentStep === steps.length ? 'Complete Registration' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface PersonalInfoProps {
  playerData: PlayerProfile;
  updatePlayerData: (data: Partial<PlayerProfile>) => void;
}

function PersonalInformation({ playerData, updatePlayerData }: PersonalInfoProps) {
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobYear, setDobYear] = useState('');

  const updateDateOfBirth = () => {
    if (dobMonth && dobDay && dobYear) {
      const date = new Date(parseInt(dobYear), parseInt(dobMonth) - 1, parseInt(dobDay));
      updatePlayerData({ dateOfBirth: date });
    }
  };

  useEffect(() => {
    updateDateOfBirth();
  }, [dobMonth, dobDay, dobYear]);

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 100; year--) {
      years.push(year.toString());
    }
    return years;
  };

  const generateDayOptions = () => {
    const days = [];
    const maxDay = dobMonth === '2' ? (parseInt(dobYear) % 4 === 0 ? 29 : 28) :
                   ['4', '6', '9', '11'].includes(dobMonth) ? 30 : 31;
    
    if (!dobMonth) return [];
    
    for (let day = 1; day <= maxDay; day++) {
      days.push(day.toString().padStart(2, '0'));
    }
    return days;
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 mb-4 relative rounded-full border-2 border-black p-1">
            <Avatar className="w-full h-full">
              <AvatarImage src="/placeholder.svg" alt="Player avatar" />
              <AvatarFallback>PA</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 shadow-lg">
              <Upload size={16} />
            </div>
          </div>
          <Button variant="link" className="text-sm text-[#FF7A00] hover:underline">Upload photo</Button>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="nickname" className="text-sm text-gray-700">Nickname</Label>
            <Input
              id="nickname"
              value={playerData.nickname}
              onChange={(e) => updatePlayerData({ nickname: e.target.value })}
              placeholder="Enter your nickname"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm text-gray-700 mb-2 block">Date of Birth</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dobMonth" className="sr-only">Month</Label>
                <Select value={dobMonth} onValueChange={setDobMonth}>
                  <SelectTrigger id="dobMonth">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                        {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dobDay" className="sr-only">Day</Label>
                <Select value={dobDay} onValueChange={setDobDay}>
                  <SelectTrigger id="dobDay">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateDayOptions().map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dobYear" className="sr-only">Year</Label>
                <Select value={dobYear} onValueChange={setDobYear}>
                  <SelectTrigger id="dobYear">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateYearOptions().map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="city" className="text-sm text-gray-700">City</Label>
            <Input
              id="city"
              value={playerData.city}
              onChange={(e) => updatePlayerData({ city: e.target.value })}
              placeholder="Enter your city"
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SportsAndPositionsProps {
  playerData: PlayerProfile;
  updatePlayerData: (data: Partial<PlayerProfile>) => void;
  sports: string[];
  positions: Record<string, string[]>;
}

function SportsAndPositions({ playerData, updatePlayerData, sports, positions }: SportsAndPositionsProps) {
  const handleSportChange = (sport: string) => {
    const updatedSports = playerData.sports.includes(sport)
      ? playerData.sports.filter(s => s !== sport)
      : [...playerData.sports, sport];
    
    updatePlayerData({ 
      sports: updatedSports,
      positions: updatedSports.reduce((acc, s) => {
        if (!playerData.positions[s]) {
          acc[s] = [];
        } else {
          acc[s] = playerData.positions[s];
        }
        return acc;
      }, {} as Record<string, string[]>)
    });
  };

  const handlePositionChange = (sport: string, position: string) => {
    const updatedPositions = playerData.positions[sport]?.includes(position)
      ? playerData.positions[sport].filter(p => p !== position)
      : [...(playerData.positions[sport] || []), position];
    
    updatePlayerData({
      positions: {
        ...playerData.positions,
        [sport]: updatedPositions
      }
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">Sports & Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="text-sm text-gray-700 mb-2 block font-semibold">Select Sports</Label>
            <div className="grid grid-cols-2 gap-4">
              {sports.map((sport) => (
                <div key={sport} className="flex items-center space-x-2">
                  <Checkbox
                    id={sport}
                    checked={playerData.sports.includes(sport)}
                    onCheckedChange={() => handleSportChange(sport)}
                  />
                  <Label htmlFor={sport} className="text-sm text-gray-600">{sport}</Label>
                </div>
              ))}
            </div>
          </div>

          {playerData.sports.length > 0 && (
            <>
              <div className="border-t border-gray-200 my-6"></div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label className="text-sm text-gray-700 mb-4 block font-semibold">Select Positions for Your Sports</Label>
                {playerData.sports.map((sport) => (
                  <div key={sport} className="mb-6 last:mb-0">
                    <Label className="text-sm text-gray-700 mb-2 block font-medium">{sport}</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {positions[sport].map((position) => (
                        <div key={position} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${sport}-${position}`}
                            checked={playerData.positions[sport]?.includes(position)}
                            onCheckedChange={() => handlePositionChange(sport, position)}
                          />
                          <Label htmlFor={`${sport}-${position}`} className="text-sm text-gray-600">{position}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ConfirmationAndLeagueCodeProps {
  playerData: PlayerProfile;
  updatePlayerData: (data: Partial<PlayerProfile>) => void;
}

function ConfirmationAndLeagueCode({ playerData, updatePlayerData }: ConfirmationAndLeagueCodeProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">Confirmation & League Code</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your Profile is Ready!</h3>
            <p className="text-[#707B81] mb-6">You've successfully set up your Player Profile. Get ready for an exciting season!</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Confirm Your Information</h3>
            <div className="space-y-4">
              <div>
                <span className="font-medium">Nickname:</span> {playerData?.nickname || 'Not provided'}
              </div>
              <div>
                <span className="font-medium">Date of Birth:</span> {playerData?.dateOfBirth ? playerData.dateOfBirth.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not provided'}
              </div>
              <div>
                <span className="font-medium">City:</span> {playerData?.city || 'Not provided'}
              </div>
              <div>
                <span className="font-medium">Sports:</span> {playerData?.sports?.length > 0 ? playerData.sports.join(', ') : 'None selected'}
              </div>
              <div>
                <span className="font-medium">Positions:</span>
                {playerData?.positions && Object.keys(playerData.positions).length > 0 ? (
                  <ul className="list-disc list-inside pl-4">
                    {Object.entries(playerData.positions).map(([sport, sportPositions]) => (
                      <li key={sport}>
                        {sport}: {sportPositions.length > 0 ? sportPositions.join(', ') : 'None selected'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>None selected</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 my-6"></div>
          
          <div>
            <Label htmlFor="leagueCode" className="text-sm text-gray-700">League Code</Label>
            <Input
              id="leagueCode"
              value={playerData?.leagueCode || ''}
              onChange={(e) => updatePlayerData({ leagueCode: e.target.value })}
              placeholder="Enter league code"
              className="mt-1"
            />
          </div>
          
          <div className="border-t border-gray-200 my-6"></div>
          
          <div className="text-center">
            {/* Confirmation text removed as per previous instruction */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PlayerRegistration;
