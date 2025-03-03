
import React from 'react';
import { useParams } from 'react-router-dom';
import { AppSidebar } from "@/components/AppSidebar";

const EventResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Event Results</h1>
        <p>Results for event ID: {id}</p>
      </div>
    </div>
  );
};

export default EventResults;
