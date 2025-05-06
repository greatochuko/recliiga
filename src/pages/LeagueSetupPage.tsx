import { Link } from "react-router-dom";
import { LeagueSetup } from "@/components/league-setup/LeagueSetup";

export default function LeagueSetupPage() {
  return (
    <div className="min-h-dvh bg-white">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold text-accent-orange">
              REC LiiGA
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <LeagueSetup />
      </main>
    </div>
  );
}
