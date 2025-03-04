
import { PageLayout } from '@/components/layout/PageLayout';
import { EventsContent } from '../components/EventsContent';

export default function ManageEvents() {
  return (
    <PageLayout title="Manage Events">
      <div className="pt-16 px-6">
        <EventsContent />
      </div>
    </PageLayout>
  );
}
