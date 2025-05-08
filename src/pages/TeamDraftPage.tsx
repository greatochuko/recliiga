import { Link, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchEventById } from "@/api/events";
import { useEffect, useState } from "react";
import { DraftControls } from "@/components/draft/DraftControls";
import FullScreenLoader from "@/components/FullScreenLoader";
import { TeamsSection } from "@/components/draft/TeamsSection";
import { TeamType } from "@/types/events";
import { ArrowLeftIcon } from "lucide-react";
import { PlayersList } from "@/components/draft/PlayersList";
import { draftPlayer } from "@/api/team";
import Pusher from "pusher-js";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/PageHeader";

const PUSHER_API_KEY = import.meta.env.VITE_PUSHER_API_KEY;

type DraftType = "alternating" | "snake";

export default function TeamDraftPage() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const [draftType, setDraftType] = useState<DraftType>("alternating");
  const [teamEditing, setTeamEditing] = useState("");
  const [teams, setTeams] = useState<TeamType[]>();
  const [isDrafting, setIsDrafting] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`event-${id}`],
    queryFn: () => fetchEventById(id),
  });

  const event = data?.data;

  useEffect(() => {
    if (event) {
      setDraftType(event.draftType);
      setTeams(event.teams);
    }
  }, [event]);

  const eventId = data?.data?.id;

  useEffect(() => {
    const pusher = new Pusher(PUSHER_API_KEY, {
      cluster: "eu",
    });

    const channel = pusher.subscribe(`event`);

    channel.bind("draft", (data: { message: TeamType }) => {
      setTeams((prev) =>
        prev.map((team) =>
          team.id === data.message.id && data.message.captainId !== user.id
            ? data.message
            : team,
        ),
      );
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [eventId, user.id]);

  function handleChangeDraftType(newDraftType: DraftType) {
    setDraftType(newDraftType);
  }

  function toggleEditMode(teamId: string) {
    if (teamEditing !== teamId) {
      setTeamEditing(teamId);
    } else {
      setTeamEditing("");
    }
  }

  function handleTeamNameChange(teamId: string, newName: string) {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId ? { ...team, name: newName } : team,
      ),
    );
  }

  function handleTeamColorChange(teamId: string, newColor: string) {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId ? { ...team, color: newColor } : team,
      ),
    );
  }

  if (isLoading || !teams) {
    return <FullScreenLoader />;
  }

  function cancelTeamEditing() {
    setTeamEditing("");
    setTeams(event.teams);
  }

  async function handlePlayerDraft(teamId: string, playerId: string) {
    setIsDrafting(true);
    const { data } = await draftPlayer({
      teamId,
      playerId,
      eventId: event.id,
    });

    if (data) {
      setTeams((prev) =>
        prev.map((team) =>
          team.id === data.id && data.captainId === user.id ? data : team,
        ),
      );
    }

    setIsDrafting(false);
  }

  if (!event) {
    return (
      <div className="flex w-full flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Event Not Found</h1>
        <p className="mt-4 max-w-xl text-center text-gray-600">
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

  if (!event.teams.some((team) => team.captainId === user.id)) {
    return (
      <div className="flex w-full flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          You're Not a Team Captain
        </h1>
        <p className="mt-4 max-w-xl text-center text-gray-600">
          You must be a team captain to access this section. Please contact your
          league admin if you believe this is an error.
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

  let currentTeam: TeamType;

  // For alternating draft
  if (draftType === "alternating") {
    currentTeam =
      teams[0].players.length > teams[1].players.length ? teams[1] : teams[0];
  }

  // For snake draft
  else if (draftType === "snake") {
    const totalPicks = teams[0].players.length + teams[1].players.length;
    const round = Math.floor(totalPicks / 2);
    const isEvenRound = round % 2 === 0;

    const team0Picks = teams[0].players.length;
    const team1Picks = teams[1].players.length;

    if (isEvenRound) {
      // Normal order: team 0 picks first
      currentTeam = team0Picks <= team1Picks ? teams[0] : teams[1];
    } else {
      // Reversed order: team 1 picks first
      currentTeam = team1Picks <= team0Picks ? teams[1] : teams[0];
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      <PageHeader title="Team Draft" />

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-6 p-6">
          <DraftControls
            draftType={draftType}
            setDraftType={handleChangeDraftType}
            draftStarted={teams.some((team) => team.players.length > 0)}
            draftRound={
              Math.floor(
                teams.reduce((prev, curr) => prev + curr.players.length, 0) / 2,
              ) + 1
            }
            handleUndo={() => {}}
          />

          <div className="flex flex-col gap-6">
            <div className="flex gap-6">
              {/* Team sections */}
              <TeamsSection
                event={event}
                numEventPlayers={event.players.length}
                teams={teams}
                setTeams={setTeams}
                toggleEditMode={toggleEditMode}
                handleTeamNameChange={handleTeamNameChange}
                handleTeamColorChange={handleTeamColorChange}
                teamEditing={teamEditing}
                cancelTeamEditing={cancelTeamEditing}
                refetchEvent={refetch}
              />
            </div>

            {/* Available players */}
            <div className="flex h-full flex-col lg:col-span-1 lg:col-start-3">
              <PlayersList
                event={event}
                teams={teams}
                isDrafting={isDrafting}
                availablePlayers={event.players}
                currentTeam={currentTeam}
                handlePlayerDraft={handlePlayerDraft}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
