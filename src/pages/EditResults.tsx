"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreInput } from "@/components/results/ScoreInput";
import { EventHeader } from "@/components/results/EventHeader";
import { TeamsAttendance } from "@/components/results/TeamsAttendance";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockTeamData, mockEvent } from "@/components/results/mockData";

export default function EditResults() {
  const [team1Score, setTeam1Score] = useState("");
  const [team2Score, setTeam2Score] = useState("");
  const [attendance, setAttendance] = useState({});
  const [alertMessage, setAlertMessage] = useState("");

  const handleAttendanceChange = (newAttendance) => {
    setAttendance((prev) => ({
      ...prev,
      ...newAttendance,
    }));
  };

  const updateScores = (team1Score: string, team2Score: string) => {
    const team1ScoreNum = parseInt(team1Score);
    const team2ScoreNum = parseInt(team2Score);

    if (team1ScoreNum && team2ScoreNum) {
      if (team1ScoreNum > team2ScoreNum) {
        setAlertMessage(
          `${mockTeamData.team1.name} beat ${mockTeamData.team2.name} ${team1Score}-${team2Score}`,
        );
      } else if (team2ScoreNum > team1ScoreNum) {
        setAlertMessage(
          `${mockTeamData.team2.name} beat ${mockTeamData.team1.name} ${team2Score}-${team1Score}`,
        );
      } else {
        setAlertMessage(
          `${mockTeamData.team1.name} and ${mockTeamData.team2.name} tied ${team1Score}-${team2Score}`,
        );
      }
    } else {
      setAlertMessage("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting scores:", { team1Score, team2Score });
    console.log("Attendance:", attendance);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Input Match Result
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="mb-8 flex items-center justify-center gap-8">
              <ScoreInput
                team={mockTeamData.team1}
                score={team1Score}
                setScore={setTeam1Score}
                updateScores={updateScores}
                otherTeamScore={team2Score}
                teamType="team1"
              />
              <EventHeader event={mockEvent} />
              <ScoreInput
                team={mockTeamData.team2}
                score={team2Score}
                setScore={setTeam2Score}
                updateScores={updateScores}
                otherTeamScore={team1Score}
                teamType="team2"
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

            <h2 className="mb-4 text-2xl font-bold">Attendance</h2>
            <TeamsAttendance
              teamData={mockTeamData}
              attendance={attendance}
              onAttendanceChange={handleAttendanceChange}
            />

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="bg-accent-orange text-white hover:bg-[#E66900]"
              >
                Submit Result
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
