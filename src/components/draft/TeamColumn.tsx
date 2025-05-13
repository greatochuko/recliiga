import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CameraIcon, Edit2 } from "lucide-react";
import { JerseyIcon, PlayerRating } from "./DraftUIComponents";
import { EventType, TeamType } from "@/types/events";
import { confirmRoster, updateTeam } from "@/api/team";
import { useAuth } from "@/contexts/AuthContext";
import ConfirmRosterModal from "./ConfirmRosterModal";
import { getInitials, getUserRating, handleImageResize } from "@/lib/utils";
import { uploadImage } from "@/lib/uploadImage";
import { toast } from "sonner";

interface TeamColumnProps {
  team: TeamType;
  otherTeam: TeamType;
  toggleEditMode: (teamId: string) => void;
  handleTeamNameChange: (teamId: string, name: string) => void;
  handleTeamColorChange: (teamId: string, color: string) => void;
  cancelTeamEditing: () => void;
  refetchEvent: () => void;
  isEditingTeam: boolean;
  canConfirmDraft: boolean;
  setTeams: React.Dispatch<React.SetStateAction<TeamType[]>>;
  event: EventType;
}

const colorOptions = [
  "red",
  "yellow",
  "orange",
  "green",
  "blue",
  "purple",
  "white",
  "black",
  "teal",
];

export const TeamColumn: React.FC<TeamColumnProps> = ({
  event,
  team,
  otherTeam,
  setTeams,
  toggleEditMode,
  handleTeamNameChange,
  handleTeamColorChange,
  isEditingTeam,
  cancelTeamEditing,
  refetchEvent,
  canConfirmDraft,
}) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [logo, setLogo] = useState<File>();
  const [confirmingRoster, setConfirmingRoster] = useState(false);

  const logoUrl = logoPreview || team.logo;

  async function handleChangeTeamLogo(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const { dataUrl, resizedFile } = await handleImageResize(
        e.target.files[0],
      );
      setLogoPreview(dataUrl);
      setLogo(resizedFile);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handleUpdateTeam() {
    setLoading(true);
    let url: string;
    if (logoUrl !== team.logo) {
      const uploadData = await uploadImage(logo);
      url = uploadData.url;
    }

    const { error } = await updateTeam(
      team.id,
      { ...team, logo: url },
      otherTeam.id,
      event.id,
    );
    if (error) {
      toast.error(error, { style: { color: "#ef4444" } });
    } else {
      toggleEditMode(team.id);
      refetchEvent();
    }
    setLoading(false);
  }

  async function handleConfirmRoster() {
    setConfirmingRoster(true);
    const { error } = await confirmRoster(team.id);
    if (!error) {
      setModalIsOpen(false);
      setTeams((prev) =>
        prev.map((t) =>
          t.id === team.id ? { ...t, draftCompleted: true } : t,
        ),
      );
    }
    setConfirmingRoster(false);
  }

  return (
    <>
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                {isEditingTeam ? (
                  <Label
                    htmlFor={`team-logo-${team.id}`}
                    className="group relative cursor-pointer"
                  >
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={team.name}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-base font-medium">
                        {getInitials(team.name)}
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`team-logo-${team.id}`}
                      onChange={handleChangeTeamLogo}
                    />

                    {/* <CameraIcon className="absolute left-1/2 top-full h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-orange p-1 text-white duration-200 group-hover:scale-125" /> */}
                    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-full bg-black/50">
                      <CameraIcon className="h-4 w-4 text-white" />
                    </div>
                  </Label>
                ) : logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={team.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-base font-medium">
                    {getInitials(team.name)}
                  </div>
                )}
                <span>Team: {team.name}</span>
                <JerseyIcon color={team.color} size={24} />
              </div>
              {team.captain && (
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={team.captain.avatar_url}
                      alt={team.captain.full_name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-sm">
                      {getInitials(team.captain.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-base font-medium">
                    Captain: {team.captain.full_name}
                  </span>
                </div>
              )}
            </div>
            {!team.draftCompleted &&
              !isEditingTeam &&
              team.captainId === user.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleEditMode(team.id)}
                  className="mt-4"
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">Edit team</span>
                </Button>
              )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col overflow-hidden">
          {isEditingTeam ? (
            <>
              <div>
                <Label htmlFor={`team-name-${team.id}`}>Team Name</Label>
                <Input
                  id={`team-name-${team.id}`}
                  value={team.name}
                  onChange={(e) =>
                    handleTeamNameChange(team.id, e.target.value)
                  }
                  placeholder="Enter team name"
                />
              </div>
              <div className="mt-4">
                <Label>Team Color</Label>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <JerseyIcon color={team.color} size={64} />
                  </div>
                  <div className="grid grid-cols-3 grid-rows-2 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        className={`h-8 w-8 rounded-full border-2 border-black focus:outline-none ${team.color === color ? "ring-2 ring-accent-orange ring-offset-2" : ""}`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleTeamColorChange(team.id, color)}
                        aria-label={`Select ${color} color`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <Button
                  onClick={cancelTeamEditing}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateTeam}
                  disabled={loading}
                  className="flex-1 bg-accent-orange text-white hover:bg-accent-orange/90 disabled:bg-accent-orange/50"
                >
                  Confirm Team Setup
                </Button>
              </div>
            </>
          ) : (
            <div>
              <div className="mb-2 flex items-center space-x-2">
                <span>
                  <strong>Team Name: {team.name}</strong>
                </span>
                <JerseyIcon color={team.color} size={24} />
              </div>
              <p>
                <strong>Team Color:</strong>{" "}
                {colorOptions.find((c) => c === team.color)}
              </p>
            </div>
          )}
          <div className="mt-4 flex flex-1 flex-col gap-2">
            <Label>Drafted Players ({team.players.length})</Label>
            {team.players.length > 0 && (
              <ScrollArea className="rounded-md border p-2">
                {team.players.map((player) => (
                  <div
                    key={player.id}
                    className="mb-2 flex items-center justify-between rounded-md border border-gray-200 bg-[#fafafa] p-2 last:mb-0"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage
                          src={player.avatar_url}
                          alt={player.full_name}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {getInitials(player.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{player.full_name}</p>
                        <p className="text-sm text-gray-500">
                          {player.positions[0]}
                        </p>
                      </div>
                    </div>
                    <PlayerRating
                      rating={getUserRating(event.leagueId, player.ratings)}
                    />
                  </div>
                ))}
              </ScrollArea>
            )}
          </div>
          {team.draftCompleted ? (
            <p className="mt-4 flex justify-end text-sm font-medium text-green-600">
              Draft Completed
            </p>
          ) : team.captainId === user.id ? (
            <div className="mt-4 flex justify-end">
              <button
                disabled={!canConfirmDraft}
                onClick={() => setModalIsOpen(true)}
                className="rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white duration-200 hover:bg-accent-orange/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm Roster
              </button>
            </div>
          ) : null}
        </CardContent>
      </Card>
      <ConfirmRosterModal
        handleConfirmRoster={handleConfirmRoster}
        open={modalIsOpen}
        closeModal={() => setModalIsOpen(false)}
        loading={confirmingRoster}
      />
    </>
  );
};
