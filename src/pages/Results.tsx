import { ResultsContent } from "@/components/results/ResultsContent";

export default function Results() {
  return (
    <main className="flex-1 bg-background relative">
      <h1 className="ml-14 text-2xl font-bold">Results</h1>
      <div className="">
        <ResultsContent />
      </div>
    </main>
  );
}
