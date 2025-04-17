import { fetchLeaguesByUser } from "@/api/league";
import FullScreenLoader from "@/components/FullScreenLoader";
import { ResultsContent } from "@/components/results/ResultsContent";
import { useQuery } from "@tanstack/react-query";

export default function Results() {
  const { data, isLoading } = useQuery({
    queryKey: ["leagues"],
    queryFn: fetchLeaguesByUser,
  });

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!data) {
    <div className="flex h-screen items-center justify-center">
      <p className="text-gray-500">
        You have not created or joined any leagues
      </p>
    </div>;
  }

  const leagues = data.leagues;

  return (
    <main className="mx-auto w-[90%]">
      <ResultsContent leagues={leagues} />
    </main>
  );
}
