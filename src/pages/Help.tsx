
import React from 'react';
import { AppSidebar } from "@/components/AppSidebar";

const Help: React.FC = () => {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
        <div className="max-w-3xl space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-700">Find answers to common questions about using League Nexus.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Contact Support</h2>
            <p className="text-gray-700">
              Need additional help? Contact our support team at <a href="mailto:support@leaguenexus.com" className="text-blue-600 hover:underline">support@leaguenexus.com</a>
            </p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">User Guides</h2>
            <p className="text-gray-700">Check out our user guides to learn how to get the most out of League Nexus.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
