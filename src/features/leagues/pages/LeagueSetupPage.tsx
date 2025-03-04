
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LeagueSetup } from '@/components/league-setup/LeagueSetup';
import { toast } from 'sonner';
import { routes } from '@/utils/routes';

export default function LeagueSetupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleComplete = () => {
    // For Phase 1, just simulate success and redirect to home
    toast.success('League created successfully!');
    navigate(routes.home);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to={routes.home} className="inline-block">
            <span className="text-3xl font-bold text-[#FF7A00]">REC LiiGA</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LeagueSetup onComplete={handleComplete} />
      </main>
    </div>
  );
}
