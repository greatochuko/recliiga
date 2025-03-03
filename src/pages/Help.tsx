
import React from 'react';
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Help: React.FC = () => {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">How do I join a league?</h3>
                <p className="text-gray-600">You can join a league by browsing available leagues and requesting to join.</p>
              </div>
              <div>
                <h3 className="font-semibold">How do I create a new league?</h3>
                <p className="text-gray-600">You can create a new league from the "Create League" section in the sidebar.</p>
              </div>
              <div>
                <h3 className="font-semibold">How do I update my profile?</h3>
                <p className="text-gray-600">You can update your profile by going to the Profile section in the app.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
