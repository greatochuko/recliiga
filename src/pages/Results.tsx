import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ResultsContent } from "@/components/results/ResultsContent";

export default function Results() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <main className="flex-1 bg-background relative">
          <div className="absolute top-4 left-4 z-50 flex items-center">
            <SidebarTrigger className="bg-white shadow-md" />
            <h1 className="ml-4 text-2xl font-bold">Results</h1>
          </div>
          <div className="pt-16">
            <ResultsContent />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
