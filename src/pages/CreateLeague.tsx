
import React from 'react';
import { AppSidebar } from "@/components/AppSidebar";

const CreateLeague: React.FC = () => {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Create League</h1>
        <p>Create a new league here.</p>
      </div>
    </div>
  );
};

export default CreateLeague;
