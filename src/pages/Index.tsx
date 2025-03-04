
import { PageLayout } from "@/components/shared/layout/PageLayout";
import { HomeScreen } from "@/components/dashboard/HomeScreen";

export default function Index() {
  return (
    <PageLayout title="Your Stats">
      <HomeScreen />
    </PageLayout>
  );
}
