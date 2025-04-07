import { LeagueSetup } from "@/components/league-setup/LeagueSetup";

export default function CreateLeague() {
  return (
    <div className="mx-auto min-h-screen w-[90%] bg-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-accent-orange mb-8 text-center text-4xl font-bold">
          Create Your League
        </h1>

        <LeagueSetup />
      </div>
    </div>
  );
}
