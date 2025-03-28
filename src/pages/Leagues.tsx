import { LeaguesContent } from "@/components/leagues/LeaguesContent";

export default function Leagues() {
  return (
    <div className="min-h-screen flex w-full">
      <main className="flex-1 bg-background relative">
        <h1 className="ml-14 text-2xl font-bold">Leagues</h1>
        <LeaguesContent />
      </main>
    </div>
  );
}
