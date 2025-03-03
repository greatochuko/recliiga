
import React from 'react';
import { AppSidebar } from "@/components/AppSidebar";

const Results: React.FC = () => {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Results</h1>
        <p>View past match results here.</p>
      </div>
    </div>
  );
};

export default Results;
