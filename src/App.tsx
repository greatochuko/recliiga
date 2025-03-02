
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import PlayerRegistration from "./pages/PlayerRegistration";
import CreateLeague from "./pages/CreateLeague";
import LeagueSetupPage from "./pages/LeagueSetupPage";
import Profile from "./pages/Profile";
import Leagues from "./pages/Leagues";
import LeagueDetails from "./pages/LeagueDetails";
import EventDetails from "./pages/EventDetails";
import EventResults from "./pages/EventResults";
import Events from "./pages/Events";
import Results from "./pages/Results";
import Chat from "./pages/Chat";
import RateTeammates from "./pages/RateTeammates";
import PlayerProfile from "./pages/PlayerProfile";
import ManageEvents from "./pages/ManageEvents";
import HelpAndSupport from "./pages/HelpAndSupport";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);
  
  useEffect(() => {
    async function checkProfileCompletion() {
      if (!user) return;
      
      try {
        // Check if the user has completed registration based on their role
        if (user.user_metadata?.role === 'organizer') {
          // Check if league organizer has created a league
          const { data: leagues, error } = await supabase
            .from('leagues')
            .select('id')
            .eq('owner_id', user.id)
            .limit(1);
          
          setIsProfileComplete(leagues && leagues.length > 0);
        } else {
          // Check if player has completed profile setup
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, nickname')
            .eq('id', user.id)
            .limit(1);
          
          setIsProfileComplete(profile && profile.length > 0 && profile[0].nickname !== null);
        }
      } catch (error) {
        console.error('Error checking profile completion:', error);
        // Default to false if there's an error
        setIsProfileComplete(false);
      } finally {
        setCheckingProfile(false);
      }
    }
    
    if (user) {
      checkProfileCompletion();
    } else {
      setCheckingProfile(false);
    }
  }, [user]);
  
  if (loading || checkingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  // If the user hasn't completed their profile, redirect to the appropriate registration page
  if (isProfileComplete === false) {
    if (user.user_metadata?.role === 'organizer') {
      return <Navigate to="/create-league" />;
    } else {
      return <Navigate to="/complete-registration" />;
    }
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

const AppRoutes = () => (
  <div className="min-h-screen w-full">
    <Routes>
      {/* Public routes */}
      <Route path="/sign-in" element={<PublicRoute><SignIn /></PublicRoute>} />
      <Route path="/sign-up" element={<PublicRoute><SignUp /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      
      {/* Registration flows (protected but not requiring a complete profile) */}
      <Route path="/complete-registration" element={<PlayerRegistration />} />
      <Route path="/create-league" element={<CreateLeague />} />
      <Route path="/league-setup" element={<LeagueSetupPage />} />
      
      {/* Private routes requiring complete profiles */}
      <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
      <Route path="/leagues" element={<PrivateRoute><Leagues /></PrivateRoute>} />
      <Route path="/leagues/:id" element={<PrivateRoute><LeagueDetails /></PrivateRoute>} />
      <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
      <Route path="/events/:id" element={<PrivateRoute><EventDetails /></PrivateRoute>} />
      <Route path="/events/:id/results" element={<PrivateRoute><EventResults /></PrivateRoute>} />
      <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
      <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
      <Route path="/rate-teammates" element={<PrivateRoute><RateTeammates /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/player-profile" element={<PrivateRoute><PlayerProfile /></PrivateRoute>} />
      <Route path="/manage-events" element={<PrivateRoute><ManageEvents /></PrivateRoute>} />
      <Route path="/help" element={<PrivateRoute><HelpAndSupport /></PrivateRoute>} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <AppRoutes />
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
