import { Link, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { TeamDraftHeader } from "@/components/draft/TeamDraftHeader";
import { useQuery } from "@tanstack/react-query";
import { fetchEventById } from "@/api/events";
import { useEffect, useState } from "react";
import { DraftControls } from "@/components/draft/DraftControls";
import FullScreenLoader from "@/components/FullScreenLoader";
import { TeamsSection } from "@/components/draft/TeamsSection";
import { TeamType } from "@/types/events";
import { ArrowLeftIcon } from "lucide-react";
import { PlayersList } from "@/components/draft/PlayersList";

type DraftType = "alternating" | "snake";

export default function TeamDraftPage() {
  const { id } = useParams<{ id: string }>();

  const [draftType, setDraftType] = useState<DraftType>("alternating");
  const [teamEditing, setTeamEditing] = useState("");
  const [teams, setTeams] = useState<TeamType[]>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`event-${id}`],
    queryFn: () => fetchEventById(id),
  });

  const teamList = data?.data.teams;

  useEffect(() => {
    if (teamList) {
      setTeams(teamList);
    }
  }, [teamList]);

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
    setTeams(teamList);
  }

  function handlePlayerDraft(playerId: string) {}

  const event = data?.data;

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

  return (
    <div className="container mx-auto px-4 py-8">
      <TeamDraftHeader />

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-6 p-6">
          <DraftControls
            draftType={draftType}
            setDraftType={handleChangeDraftType}
            draftStarted={true}
            draftRound={1}
            handleUndo={() => {}}
            draftHistory={[]}
          />

          <div className="flex flex-col gap-6">
            <div className="flex gap-6">
              {/* Team sections */}
              <TeamsSection
                teams={teams}
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
                availablePlayers={event.players}
                teams={teams}
                currentTeam={0}
                isTeamSetupComplete={false}
                handlePlayerDraft={handlePlayerDraft}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Draft Completion Dialog */}
      {/* <DraftCompletionDialog
        open={showCompletionDialog}
        teams={teams}
        onOpenChange={setShowCompletionDialog}
        onConfirmTeam={handleConfirmTeam}
        onFinalizeDraft={handleFinalizeDraft}
        isSubmitting={isSubmitting}
      /> */}
    </div>
  );
}
