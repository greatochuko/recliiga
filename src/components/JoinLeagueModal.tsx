import { joinLeague } from "@/api/league";
import ModalContainer from "./ModalContainer";
import { useState } from "react";
import { toast } from "sonner";

export default function JoinLeagueModal({
  open,
  closeModal,
  refetchLeagues,
}: {
  open: boolean;
  closeModal: () => void;
  refetchLeagues: () => void;
}) {
  const [leagueCode, setLeagueCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleJoinLeague(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await joinLeague(leagueCode);
    if (error) {
      toast.error(error, { style: { color: "#ef4444" } });
    } else {
      refetchLeagues();
      closeModal();
    }
    setLoading(false);
  }
  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div className="w-[90%] max-w-lg rounded-md bg-white p-6">
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
            value={leagueCode}
            onChange={(e) => setLeagueCode(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-accent-orange focus:ring-accent-orange"
            placeholder="Enter league code"
            required
          />
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="mr-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white hover:bg-accent-orange/90 disabled:bg-accent-orange/50"
            >
              {loading ? "Joining..." : "Join"}
            </button>
          </div>
        </form>
      </div>
    </ModalContainer>
  );
}
