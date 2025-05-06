import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { Team } from "./types";
import { TeamType } from "@/types/events";

interface DraftCompletionDialogProps {
  open: boolean;
  teams: TeamType[];
  onOpenChange: (open: boolean) => void;
  onConfirmTeam: (teamId: number) => void;
  onFinalizeDraft: () => void;
  isSubmitting?: boolean;
}

export function DraftCompletionDialog({
  open,
  teams,
  onOpenChange,
  onConfirmTeam,
  onFinalizeDraft,
  isSubmitting = false,
}: DraftCompletionDialogProps) {
  const [confirmedTeams, setConfirmedTeams] = useState<Set<number>>(new Set());

  // Reset confirmed teams when dialog opens/closes
  useEffect(() => {
    if (open) {
      setConfirmedTeams(
        new Set(teams.filter((team) => team.confirmed).map((team) => team.id)),
      );
    } else {
      setConfirmedTeams(new Set());
    }
  }, [open, teams]);

  const handleConfirmTeam = (teamId: number) => {
    onConfirmTeam(teamId);
    setConfirmedTeams((prev) => new Set([...prev, teamId]));
  };

  const allTeamsConfirmed = teams.every((team) => confirmedTeams.has(team.id));

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl">
            Draft Complete
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            All players have been drafted. Review and confirm each team's roster
            before finalizing.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {teams.map((team) => (
            <div key={team.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{team.name}</h3>
                <div>
                  {confirmedTeams.has(team.id) ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="mr-1 h-5 w-5" />
                      Confirmed
                    </span>
                  ) : (
                    <Button
                      // onClick={() => handleConfirmTeam(team.id)}
                      variant="outline"
                      size="sm"
                    >
                      Confirm Roster
                    </Button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {team.players.length} players drafted
              </p>
            </div>
          ))}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onFinalizeDraft}
            disabled={!allTeamsConfirmed || isSubmitting}
            className="bg-accent-orange text-white hover:bg-accent-orange/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finalizing...
              </>
            ) : (
              "Finalize Draft"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
