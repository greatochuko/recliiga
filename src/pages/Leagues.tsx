import { fetchLeaguesByUser } from "@/api/league";
import JoinLeagueModal from "@/components/JoinLeagueModal";
import { LeaguesContent } from "@/components/leagues/LeaguesContent";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Leagues() {
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["leagues"],
    queryFn: fetchLeaguesByUser,
  });

  const leagues = data?.leagues || [];

  return (
    <>
      <main className="relative flex flex-1 flex-col gap-6 bg-background">
        <div className="flex items-center justify-between">
          <h1 className="ml-8 text-2xl font-bold">Leagues</h1>
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
