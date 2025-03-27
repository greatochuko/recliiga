import { LeagueSetup } from "@/components/league-setup/LeagueSetup";

export default function CreateLeague() {
  return (
    <div className="min-h-screen bg-white w-[90%] mx-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#FF7A00] text-center mb-8">
          Create Your League
        </h1>

        <LeagueSetup />
      </div>
    </div>
  );
}
