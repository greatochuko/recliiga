
import React from 'react';
import { AppSidebar } from "@/components/AppSidebar";

const ManageEvents: React.FC = () => {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Manage Events</h1>
        <p>Manage your events here.</p>
      </div>
    </div>
  );
};

export default ManageEvents;
