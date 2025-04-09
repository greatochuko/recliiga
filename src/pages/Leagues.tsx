import { fetchLeaguesByUser } from "@/api/league";
import { LeaguesContent } from "@/components/leagues/LeaguesContent";
import ModalContainer from "@/components/ModalContainer";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

export default function Leagues() {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: { leagues },
    isFetching: isLoading,
    error,
  } = useQuery({
    queryKey: ["leagues"],
    queryFn: fetchLeaguesByUser,
    initialData: { leagues: [], error: null },
  });

  function handleJoinLeague(e: React.FormEvent) {
    e.preventDefault();
  }

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
      <ModalContainer open={modalOpen} closeModal={() => setModalOpen(false)}>
        <div className="rounded-md bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-800">Join a League</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the league code provided by the league administrator to join.
          </p>
          <form onSubmit={handleJoinLeague} className="mt-4">
            <label
              htmlFor="leagueCode"
              className="block text-sm font-medium text-gray-700"
            >
              League Code
            </label>
            <input
              type="text"
              id="leagueCode"
              name="leagueCode"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-accent-orange focus:ring-accent-orange"
              placeholder="Enter league code"
              required
            />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="mr-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white hover:bg-accent-orange/90"
              >
                Join
              </button>
            </div>
          </form>
        </div>
      </ModalContainer>
    </>
  );
}
