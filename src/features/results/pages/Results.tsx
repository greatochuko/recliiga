
import { PageLayout } from "@/components/layout/PageLayout";
import { ResultsContent } from "../components/ResultsContent";

export default function Results() {
  return (
    <PageLayout title="Results">
      <div className="pt-16">
        <ResultsContent />
      </div>
    </PageLayout>
  );
}
