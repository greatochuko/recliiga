
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
import Profile from "./pages/Profile";
import Leagues from "./pages/Leagues";
import LeagueDetails from "./pages/LeagueDetails";
import EventDetails from "./pages/EventDetails";
import EventResults from "./pages/EventResults";
import Events from "./pages/Events";
import Results from "./pages/Results";
import Chat from "./pages/Chat";
import RateTeammates from "./pages/RateTeammates";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  const userMetadata = user.user_metadata || {};
  const isPlayer = userMetadata?.role === 'player';
  const hasProfile = userMetadata?.profile_completed === true;

  if (hasProfile) {
    return <>{children}</>;
  }

  if (isPlayer) {
    return <Navigate to="/complete-registration" />;
  } else {
    return <Navigate to="/create-league" />;
  }
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
      
      {/* Private routes */}
      <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
      <Route path="/leagues" element={<PrivateRoute><Leagues /></PrivateRoute>} />
      <Route path="/leagues/:id" element={<PrivateRoute><LeagueDetails /></PrivateRoute>} />
      <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
      <Route path="/events/:id" element={<PrivateRoute><EventDetails /></PrivateRoute>} />
      <Route path="/events/:id/results" element={<PrivateRoute><EventResults /></PrivateRoute>} />
      <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
      <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
      <Route path="/rate-teammates" element={<PrivateRoute><RateTeammates /></PrivateRoute>} />
      <Route path="/complete-registration" element={<PlayerRegistration />} />
      <Route path="/create-league" element={<CreateLeague />} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      
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
