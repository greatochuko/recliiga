import { fetchLeaguesByUser } from "@/api/league";
import FullScreenLoader from "@/components/FullScreenLoader";
import { ResultsContent } from "@/components/results/ResultsContent";
import { useQuery } from "@tanstack/react-query";

export default function Results() {
  const { data, isLoading } = useQuery({
    queryKey: ["leagues"],
    queryFn: fetchLeaguesByUser,
  });

  if (isLoading || !data) {
    return <FullScreenLoader />;
  }

  const leagues = data.leagues;

  

  return (
    <main className="mx-auto w-[90%]">
      <ResultsContent leagues={leagues} />
    </main>
  );
}
