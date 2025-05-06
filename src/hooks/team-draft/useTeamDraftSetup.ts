import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DraftHistoryItem, Player, Team } from "@/components/draft/types";
import { getOrCreateDraftSession, getDraftPicks } from "@/api/draft";
import { fetchEventById, getAttendingPlayers } from "@/api/events2";
import { createInitialTeams, filterAvailablePlayers } from "./utils";

export const useTeamDraftSetup = (
  eventId: string | undefined,
  initialEventData?: any
) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>(createInitialTeams());
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [event, setEvent] = useState<any>(initialEventData);
  const [draftSession, setDraftSession] = useState<any>(null);
  const [draftHistory, setDraftHistory] = useState<DraftHistoryItem[]>([]);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [draftType, setDraftType] = useState("Alternating");
  const [draftRound, setDraftRound] = useState(0);
  const [draftStarted, setDraftStarted] = useState(false);
  const [totalPicks, setTotalPicks] = useState(0);

  // Load draft data
  useEffect(() => {
    const loadDraftData = async () => {
      if (!eventId) return;

      setIsLoading(true);
      try {
        // Use passed event data if available, otherwise fetch it
        let eventData = event;
        if (!eventData) {
          eventData = await fetchEventById(eventId);
          if (!eventData) {
            toast.error("Event not found");
            navigate("/events");
            return;
          }
          setEvent(eventData);
        }

        // Set up teams based on event data
        const updatedTeams = [
          {
            id: 1,
            name: eventData.team1.name,
            color: eventData.team1.color,
            players: [],
            isEditing: true,
            captain: eventData.captains?.team1?.name || null,
          },
          {
            id: 2,
            name: eventData.team2.name,
            color: eventData.team2.color,
            players: [],
            isEditing: true,
            captain: eventData.captains?.team2?.name || null,
          },
        ];
        setTeams(updatedTeams);

        // Get or create draft session
        const session = await getOrCreateDraftSession(eventId);
        if (!session) {
          toast.error("Failed to initialize draft session");
          return;
        }
        setDraftSession(session);

        // If draft is already in progress, load existing picks
        if (
          session.status === "in_progress" ||
          session.status === "completed"
        ) {
          setDraftStarted(true);
          const picks = await getDraftPicks(session.id);

          // Process picks to update teams and draft history
          if (picks.length > 0) {
            const newDraftHistory: DraftHistoryItem[] = [];
            const teamPlayers: { [key: string]: Player[] } = {
              team1: [],
              team2: [],
            };

            picks.forEach((pick) => {
              if (pick.player) {
                const teamIndex = pick.team_id === "team1" ? 0 : 1;
                teamPlayers[pick.team_id] = [
                  ...(teamPlayers[pick.team_id] || []),
                  pick.player,
                ];

                newDraftHistory.push({
                  player: pick.player,
                  teamIndex,
                });
              }
            });

            // Update teams with drafted players
            setTeams((teams) =>
              teams.map((team, index) => ({
                ...team,
                players: [
                  ...(team.players || []),
                  ...(index === 0
                    ? teamPlayers.team1 || []
                    : teamPlayers.team2 || []),
                ],
              }))
            );

            setDraftHistory(newDraftHistory);
            setTotalPicks(picks.length);

            // Set current team for the next pick
            if (draftType === "Alternating") {
              setCurrentTeam(picks.length % 2);
            } else if (draftType === "Snake") {
              const round = Math.floor(picks.length / 2) + 1;
              setDraftRound(round);
              setCurrentTeam(
                round % 2 === 0 ? picks.length % 2 : (picks.length + 1) % 2
              );
            }
          }
        }

        // Fetch available players (attending but not drafted)
        const attendingPlayers = await getAttendingPlayers(eventId);

        // Filter out players who have already been drafted
        const draftedPlayerIds = new Set(
          draftHistory.map((item) => item.player.id.toString())
        );
        const captainIds = [
          eventData.captains?.team1?.id,
          eventData.captains?.team2?.id,
        ].filter(Boolean);

        // Filter available players to exclude captains and already drafted players
        const availablePlayersList = filterAvailablePlayers(
          attendingPlayers,
          draftedPlayerIds,
          captainIds
        );

        setAvailablePlayers(availablePlayersList);
      } catch (error) {
        console.error("Error loading draft data:", error);
        toast.error("Failed to load draft data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDraftData();
  }, [eventId, navigate, draftHistory, draftType, event]);

  return {
    isLoading,
    teams,
    setTeams,
    availablePlayers,
    setAvailablePlayers,
    currentTeam,
    setCurrentTeam,
    draftType,
    setDraftType,
    draftRound,
    setDraftRound,
    draftStarted,
    setDraftStarted,
    totalPicks,
    setTotalPicks,
    draftHistory,
    setDraftHistory,
    event,
    setEvent,
    draftSession,
  };
};
