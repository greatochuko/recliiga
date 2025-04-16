"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreInput } from "@/components/results/ScoreInput";
import { EventHeader } from "@/components/results/EventHeader";
import { TeamsAttendance } from "@/components/results/TeamsAttendance";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockTeamData } from "@/components/results/mockData";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchEventById } from "@/api/events";
import FullScreenLoader from "@/components/FullScreenLoader";
import { submitResult } from "@/api/events";
import { toast } from "sonner";

export default function EditResults() {
  const [team1Score, setTeam1Score] = useState("");
  const [team2Score, setTeam2Score] = useState("");
  const [attendingPlayers, setAttendingPlayers] = useState<string[]>([]);
  const [resultLoading, setResultLoading] = useState(false);

  const { eventId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: [`event-${eventId}`],
    queryFn: () => fetchEventById(eventId),
  });

  const event = data?.data;

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!event) {
    return (
      <div className="flex w-full flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Event Not Found</h1>
        <p className="mt-4 text-gray-600">
          The event you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/events"
          className="mt-6 flex items-center gap-1 rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white hover:bg-accent-orange/90"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Go Back to Events
        </Link>
      </div>
    );
  }

  let alertMessage = "";
  if (team1Score && team2Score) {
    if (team1Score > team2Score) {
      alertMessage = `${mockTeamData.team1.name} beat ${mockTeamData.team2.name} ${team1Score}-${team2Score}`;
    } else if (team2Score > team1Score) {
      alertMessage = `${mockTeamData.team2.name} beat ${mockTeamData.team1.name} ${team2Score}-${team1Score}`;
    } else {
      alertMessage = `${mockTeamData.team1.name} and ${mockTeamData.team2.name} tied ${team1Score}-${team2Score}`;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResultLoading(true);
    const { error } = await submitResult({
      eventId: event.id,
      team1Score: Number(team1Score),
      team2Score: Number(team2Score),
      attendingPlayers: attendingPlayers,
      leagueId: event.league.id,
    });
    if (error) {
      toast.error("An error occured submitting scores");
    } else {
      navigate("/manage-events");
    }
    setResultLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Input Match Result
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="mb-8 flex items-center gap-8">
              <ScoreInput
                team={mockTeamData.team1}
                score={team1Score}
                setScore={setTeam1Score}
              />
              <div className="flex flex-col items-center">
                <EventHeader event={event} type="large" />
                <span className="text-2xl font-bold">vs</span>
              </div>
              <ScoreInput
                team={mockTeamData.team2}
                score={team2Score}
                setScore={setTeam2Score}
              />
            </div>

            {alertMessage && (
              <div className="flex justify-center">
                <Alert
                  variant="destructive"
                  className="w-full max-w-sm text-center"
                >
                  <div className="flex w-full items-center justify-center">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <AlertDescription>{alertMessage}</AlertDescription>
                  </div>
                </Alert>
              </div>
            )}

            <EventHeader event={event} type="small" />

            <h2 className="mb-4 text-2xl font-bold">Attendance</h2>
            <TeamsAttendance
              teams={event.teams}
              attendingPlayers={attendingPlayers}
              setAttendingPlayers={setAttendingPlayers}
            />

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="bg-accent-orange text-white hover:bg-[#E66900] disabled:bg-accent-orange/50"
                disabled={resultLoading}
              >
                {resultLoading ? "Submitting..." : "Submit Result"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
