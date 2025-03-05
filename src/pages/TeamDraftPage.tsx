
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { useTeamDraft } from '@/hooks/use-team-draft';
import { TeamDraftHeader } from '@/components/draft/TeamDraftHeader';
import { TeamsSection } from '@/components/draft/TeamsSection';
import { DraftControls } from '@/components/draft/DraftControls';
import { PlayersList } from '@/components/draft/PlayersList';
import { DraftCompletionDialog } from '@/components/draft/DraftCompletionDialog';
import { toast } from "sonner";
import { useEffect } from 'react';

export default function TeamDraftPage() {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const location = useLocation();
  const eventData = location.state?.eventData;
  
  // Effect to validate we have an event ID
  useEffect(() => {
    if (!eventId) {
      toast.error("No event ID provided");
      navigate('/events');
    }
  }, [eventId, navigate]);
  
  const {
    isLoading,
    teams,
    availablePlayers,
    currentTeam,
    draftType,
    setDraftType,
    draftStarted,
    draftRound,
    draftHistory,
    showCompletionDialog,
    isSubmitting,
    isTeamSetupComplete,
    handleTeamNameChange,
    handleTeamColorChange,
    handlePlayerDraft,
    handleUndo,
    toggleEditMode,
    handleConfirmTeam,
    handleFinalizeDraft,
    setShowCompletionDialog
  } = useTeamDraft(eventId, eventData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-[#FF7A00] animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TeamDraftHeader />
      
      <Card className="mb-6">
        <CardContent>
          <DraftControls
            draftType={draftType}
            setDraftType={setDraftType}
            draftStarted={draftStarted}
            draftRound={draftRound}
            handleUndo={handleUndo}
            draftHistory={draftHistory}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.5fr] gap-6 h-[calc(100vh-300px)]">
            {/* Team sections */}
            <TeamsSection
              teams={teams}
              toggleEditMode={toggleEditMode}
              handleTeamNameChange={handleTeamNameChange}
              handleTeamColorChange={handleTeamColorChange}
            />

            {/* Available players */}
            <div className="lg:col-span-1 lg:col-start-3 flex flex-col h-full">
              <PlayersList 
                availablePlayers={availablePlayers}
                teams={teams}
                currentTeam={currentTeam}
                isTeamSetupComplete={isTeamSetupComplete}
                handlePlayerDraft={handlePlayerDraft}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Draft Completion Dialog */}
      <DraftCompletionDialog
        open={showCompletionDialog}
        teams={teams}
        onOpenChange={setShowCompletionDialog}
        onConfirmTeam={handleConfirmTeam}
        onFinalizeDraft={handleFinalizeDraft}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
