
import React from 'react';
import { AppSidebar } from "@/components/AppSidebar";

const Profile: React.FC = () => {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>Your profile information will be displayed here.</p>
      </div>
    </div>
  );
};

export default Profile;
