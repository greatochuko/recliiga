import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LockIcon } from "lucide-react";

interface League {
  id: string;
  name: string;
  sport: string;
  city: string;
  description: string | null;
  logo_url: string | null;
}

export const LeagueCard = ({ league }: { league: League }) => (
  <Card className="transition-shadow hover:shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center gap-4">
        {league.logo_url && (
          <img
            src={league.logo_url}
            alt={league.name}
            className="h-12 w-12 rounded-full object-cover"
          />
        )}
        <div>
          <h3 className="text-xl font-bold">{league.name}</h3>
          <p className="text-sm text-gray-500">
            {league.sport} • {league.city}
          </p>
        </div>
      </CardTitle>
    </CardHeader>
    {league.description && (
      <CardContent>
        <p className="text-gray-600">{league.description}</p>
      </CardContent>
    )}
  </Card>
);
