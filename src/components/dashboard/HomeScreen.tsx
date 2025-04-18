import PlayerDashboard from "./PlayerDashboard";

export function HomeScreen() {
  return (
    <main className="relative flex-1 bg-background">
      <div className="absolute left-4 top-1 z-50 flex items-center"></div>
      <PlayerDashboard />
    </main>
  );
}
