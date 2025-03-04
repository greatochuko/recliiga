
import React, { useState } from 'react'
import { Users, Search, MapPin, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageLayout } from '@/components/layout/PageLayout'
import { League } from '../types'
import { routes } from '@/utils/routes'

const demoLeagues: League[] = [
  {
    id: "1",
    name: "Premier League",
    sport: "Football",
    leagueCode: "PL2024",
    playerCount: 17,
    date: "12-Feb-2024",
    status: "member",
    image: "/placeholder.svg?height=64&width=64",
    city: "London"
  },
  {
    id: "2",
    name: "Champions League",
    sport: "Football",
    leagueCode: "CL2024",
    playerCount: 24,
    date: "12-Feb-2024",
    status: "joinable",
    image: "/placeholder.svg?height=64&width=64",
    city: "Various European Cities"
  },
  {
    id: "3",
    name: "NBA Summer League",
    sport: "Basketball",
    leagueCode: "NBA2024",
    playerCount: 30,
    date: "15-Jul-2024",
    status: "joinable",
    image: "/placeholder.svg?height=64&width=64",
    city: "Las Vegas"
  }
]

function LeaguesContent() {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState<League[]>(demoLeagues)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    // Simulating API call for search
    setTimeout(() => {
      const filteredLeagues = demoLeagues.filter(league => 
        league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        league.sport?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        league.leagueCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        league.city?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setLeagues(filteredLeagues)
      setIsLoading(false)
    }, 500)
  }

  const handleJoinLeague = (leagueId: string) => {
    console.log("Joining league:", leagueId)
    // Here you would typically make an API call to join the league
  }

  const handleViewLeague = (leagueId: string) => {
    // Navigate to the league details page
    navigate(routes.leagues.details(leagueId));
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl pt-16">
      <form onSubmit={handleSearch} className="mb-6">
        <Label htmlFor="search" className="sr-only">Search leagues</Label>
        <div className="relative">
          <Input
            id="search"
            type="text"
            placeholder="Search by Name, Sport, League Code or City"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Button type="submit" className="absolute inset-y-0 right-0 flex items-center px-4 bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white">
            Search
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="text-center p-4 text-gray-600">Searching leagues...</div>
      ) : error ? (
        <div className="text-center p-4 text-red-600">{error}</div>
      ) : (
        <div className="space-y-4">
          {leagues.length === 0 ? (
            <div className="text-center p-4 text-gray-600">No leagues found matching your search.</div>
          ) : (
            leagues.map((league) => (
              <Card key={league.id} className="overflow-hidden border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={league.image} alt={league.name} />
                      <AvatarFallback>{league.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{league.name}</h3>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{league.leagueCode}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-[#707B81]">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{league.playerCount} Players</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{league.city}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{league.date}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">{league.sport}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button 
                    className={`w-full py-2 text-base ${league.status === "joinable" ? "bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white" : "bg-white text-[#FF7A00] border border-[#FF7A00] hover:bg-[#FF7A00]/10"}`}
                    onClick={() => league.status === "joinable" ? handleJoinLeague(league.id) : handleViewLeague(league.id)}
                  >
                    {league.status === "joinable" ? "Join" : "See More"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function Leagues() {
  return (
    <PageLayout title="Leagues">
      <LeaguesContent />
    </PageLayout>
  );
}
