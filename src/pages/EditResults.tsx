import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScoreInput } from "@/components/results/ScoreInput";
import { EventHeader } from "@/components/results/EventHeader";
import { TeamsAttendance } from "@/components/results/TeamsAttendance";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchEventById } from "@/api/events";
import FullScreenLoader from "@/components/FullScreenLoader";
import { submitResult, updateResult } from "@/api/events";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function EditResults() {
  const { user } = useAuth();

  const [team1Score, setTeam1Score] = useState<number>(0);
  const [team2Score, setTeam2Score] = useState<number>(0);
  const [attendingPlayers, setAttendingPlayers] = useState<string[]>([]);
  const [resultLoading, setResultLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const { eventId } = useParams();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: [`event-${eventId}`],
    queryFn: () => fetchEventById(eventId),
  });

  const event = data?.data;

  useEffect(() => {
    if (event && event.result) {
      setTeam1Score(event.result.team1Score);
      setTeam2Score(event.result.team2Score);
      setAttendingPlayers(
        event.result.attendingPlayers.map((player) => player.id),
      );
    }
    setLoading(false);
  }, [event]);

  if (loading) {
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

  if (event.creatorId !== user.id) {
    return (
      <div className="flex w-full flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Access Denied</h1>
        <p className="mt-4 max-w-xl text-center text-gray-600">
          Only the event creator can view or manage this page. If you believe
          this is a mistake, please contact support.
        </p>
        <Link
          to="/events"
          className="mt-6 flex items-center gap-1 rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white hover:bg-accent-orange/90"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Events
        </Link>
      </div>
    );
  }

  let alertMessage = "";

  if (team1Score && team2Score) {
    if (team1Score > team2Score) {
      alertMessage = `${event.teams[0].name} beat ${event.teams[1].name} ${team1Score}-${team2Score}`;
    } else if (team2Score > team1Score) {
      alertMessage = `${event.teams[1].name} beat ${event.teams[0].name} ${team2Score}-${team1Score}`;
    } else {
      alertMessage = `${event.teams[0].name} and ${event.teams[1].name} tied ${team1Score}-${team2Score}`;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResultLoading(true);

    let hasError = false;

    if (event.resultsEntered) {
      const { error } = await updateResult({
        eventId: event.id,
        team1Score: team1Score,
        team2Score: team2Score,
        attendingPlayers: attendingPlayers,
        resultId: event.result.id,
      });
      hasError = !!error;
    } else {
      const { error } = await submitResult({
        eventId: event.id,
        team1Score: team1Score,
        team2Score: team2Score,
        attendingPlayers: attendingPlayers,
        leagueId: event.league.id,
      });
      hasError = !!error;
    }

    if (hasError) {
      toast.error("An error occured submitting scores");
    } else {
      navigate("/manage-events");
    }
    setResultLoading(false);
  };

  const captainSelected = event.teams.some((team) => team.captain);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="relative ml-8 flex items-center justify-between">
        <h1 className="text-lg font-bold sm:text-2xl">
          {event.result ? "Edit" : "Enter"} Match Result
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 rounded-md p-1.5 px-3 text-sm font-medium text-accent-orange duration-200 hover:bg-accent-orange/10"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Previous
        </button>
      </div>
      <Card className="flex-1">
        <CardHeader></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="mb-8 flex items-center gap-4 sm:gap-8">
              <ScoreInput
                team={event.teams[0]}
                score={team1Score}
                setScore={setTeam1Score}
              />
              <div className="flex flex-col items-center">
                <EventHeader event={event} type="large" />
                <span className="text-2xl font-bold">vs</span>
              </div>
              <ScoreInput
                team={event.teams[1]}
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
              captainSelected={captainSelected}
              teams={event.teams}
              attendingPlayers={attendingPlayers}
              setAttendingPlayers={setAttendingPlayers}
            />

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="bg-accent-orange text-white hover:bg-[#E66900] disabled:bg-accent-orange/50"
                disabled={resultLoading || !captainSelected}
              >
                {event.resultsEntered
                  ? resultLoading
                    ? "Updating..."
                    : "Update Result"
                  : resultLoading
                    ? "Submitting..."
                    : "Submit Result"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
