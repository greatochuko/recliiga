import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LeagueSetup } from "@/components/league-setup/LeagueSetup";
import { toast } from "sonner";

export default function LeagueSetupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleComplete = () => {
    // For Phase 1, just simulate success and redirect to home
    toast.success("League created successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-block">
            <span className="text-accent-orange text-3xl font-bold">
              REC LiiGA
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <LeagueSetup onComplete={handleComplete} />
      </main>
    </div>
  );
}
