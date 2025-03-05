
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Undo2 } from 'lucide-react';
import { DraftHistoryItem } from './types';

interface DraftControlsProps {
  draftType: string;
  setDraftType: (type: string) => void;
  draftStarted: boolean;
  draftRound: number;
  handleUndo: () => void;
  draftHistory: DraftHistoryItem[];
}

export const DraftControls: React.FC<DraftControlsProps> = ({
  draftType,
  setDraftType,
  draftStarted,
  draftRound,
  handleUndo,
  draftHistory,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <Card className="border-2 border-[#FF7A00] w-fit">
          <CardContent className="py-3 px-4">
            <div className="flex items-center space-x-4">
              <div className="text-base font-semibold text-black">Draft Type</div>
              <RadioGroup
                value={draftType}
                onValueChange={(value) => setDraftType(value)}
                className="flex space-x-4"
                disabled={draftStarted}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Alternating" id="alternating" />
                  <Label htmlFor="alternating" className="text-sm">Alternating</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Snake" id="snake" />
                  <Label htmlFor="snake" className="text-sm">Snake</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>
      {draftStarted && (
        <div className="flex items-center space-x-4">
          <div className="text-lg font-semibold">
            Round: {draftRound}
          </div>
          <Button
            onClick={handleUndo}
            disabled={draftHistory.length === 0}
            variant="outline"
            size="sm"
          >
            <Undo2 className="mr-2 h-4 w-4" />
            Undo Pick
          </Button>
        </div>
      )}
    </div>
  );
};
