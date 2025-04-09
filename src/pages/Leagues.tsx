import { fetchLeaguesByUser } from "@/api/league";
import JoinLeagueModal from "@/components/JoinLeagueModal";
import { LeaguesContent } from "@/components/leagues/LeaguesContent";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Leagues() {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: { leagues },
    isFetching: isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["leagues"],
    queryFn: fetchLeaguesByUser,
    initialData: { leagues: [], error: null },
  });

  return (
    <>
      <main className="relative flex-1 bg-background">
        <div className="mr-6 flex items-center justify-between">
          <h1 className="ml-14 text-2xl font-bold">Leagues</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white duration-200 hover:bg-accent-orange/90"
          >
            Join League
          </button>
        </div>
        <LeaguesContent leagues={leagues} isLoading={isLoading} error={error} />
      </main>
      <JoinLeagueModal
        open={modalOpen}
        closeModal={() => setModalOpen(false)}
        refetchLeagues={refetch}
      />
    </>
  );
}
