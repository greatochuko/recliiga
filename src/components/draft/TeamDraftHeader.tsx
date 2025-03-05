
import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const TeamDraftHeader: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Team Draft</CardTitle>
      </CardHeader>
    </Card>
  );
};
