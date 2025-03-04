
import { PageLayout } from "@/components/shared/layout/PageLayout";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function LeaguesContent() {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Leagues</h1>
      {/* League content will go here */}
      <div className="text-center py-10 text-gray-500">
        League content is under development
      </div>
    </div>
  );
}

export default function Leagues() {
  return (
    <QueryClientProvider client={queryClient}>
      <PageLayout title="Leagues">
        <LeaguesContent />
      </PageLayout>
    </QueryClientProvider>
  );
}
