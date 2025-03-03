
import React from 'react';
import { AppSidebar } from "@/components/AppSidebar";

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Welcome to your dashboard!</p>
      </div>
    </div>
  );
};

export default Dashboard;
