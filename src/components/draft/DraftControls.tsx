import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Undo2 } from "lucide-react";

interface DraftControlsProps {
  draftType: string;
  setDraftType: (type: string) => void;
  draftStarted: boolean;
  draftRound: number;
  handleUndo: () => void;
}

export const DraftControls: React.FC<DraftControlsProps> = ({
  draftType,
  draftStarted,
  draftRound,
  handleUndo,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-[200px] flex-1">
        <Card className="w-fit border-2 border-accent-orange">
          <CardContent className="px-4 py-3">
            <div className="flex items-center space-x-4">
              <div className="text-base font-semibold text-black">
                Draft Type
              </div>
              <RadioGroup value={draftType} className="flex space-x-4" disabled>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alternating" id="alternating" />
                  <Label htmlFor="alternating" className="text-sm">
                    Alternating
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="snake" id="snake" />
                  <Label htmlFor="snake" className="text-sm">
                    Snake
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>
      {draftStarted && (
        <div className="flex items-center space-x-4">
          <div className="text-lg font-semibold">Round: {draftRound}</div>
          {/* <Button onClick={handleUndo} disabled variant="outline" size="sm">
            <Undo2 className="mr-2 h-4 w-4" />
            Undo Pick
          </Button> */}
        </div>
      )}
    </div>
  );
};
