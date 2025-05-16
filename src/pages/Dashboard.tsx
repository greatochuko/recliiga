import PlayerDashboard from "../components/dashboard/PlayerDashboard";

export function Dashboard() {
  return (
    <main className="relative flex-1 bg-background">
      <div className="absolute left-4 top-1 z-50 flex items-center"></div>
      <PlayerDashboard />
    </main>
  );
}
