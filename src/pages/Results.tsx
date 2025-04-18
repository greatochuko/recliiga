import { fetchLeaguesByUser } from "@/api/league";
import FullScreenLoader from "@/components/FullScreenLoader";
import { ResultsContent } from "@/components/results/ResultsContent";
import { useQuery } from "@tanstack/react-query";

export default function Results() {
  const { data, isLoading } = useQuery({
    queryKey: ["leagues-result"],
    queryFn: fetchLeaguesByUser,
  });

  if (isLoading) {
    return <FullScreenLoader />;
  }

  const leagues = data?.leagues;

  if (!leagues.length) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-gray-500">
          You have not created or joined any leagues
        </p>
      </div>
    );
  }

  return <ResultsContent leagues={leagues} />;
}
