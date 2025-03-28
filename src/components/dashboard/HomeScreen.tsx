import PlayerDashboard from "./PlayerDashboardContent";

export function HomeScreen() {
  return (
    <main className="flex-1 bg-background relative">
      <div className="absolute top-1 left-4 z-50 flex items-center"></div>
      <div className="pt-10 md:pt-0 px-4 md:px-6 max-w-6xl mx-auto">
        <PlayerDashboard />
      </div>
    </main>
  );
}
