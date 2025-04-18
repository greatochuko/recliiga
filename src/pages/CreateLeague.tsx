import { LeagueSetup } from "@/components/league-setup/LeagueSetup";

export default function CreateLeague() {
  return (
    <div className="flex-1 bg-white">
      <h1 className="mb-8 text-center text-4xl font-bold text-accent-orange">
        Create Your League
      </h1>

      <LeagueSetup />
    </div>
  );
}
