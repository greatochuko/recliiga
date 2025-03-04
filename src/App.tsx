import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { usePrivateRoute, usePublicRoute } from "@/hooks/useRouteGuard";
import { routes } from "@/utils/routes";

// Auth pages
import SignIn from "@/features/auth/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import PlayerRegistration from "@/pages/PlayerRegistration";

// League pages
import CreateLeague from "@/features/leagues/pages/CreateLeague";
import LeagueSetupPage from "@/features/leagues/pages/LeagueSetupPage";
import Leagues from "@/features/leagues/pages/Leagues";
import LeagueDetails from "@/pages/LeagueDetails";

// Event pages
import Events from "@/pages/Events";
import EventDetails from "@/pages/EventDetails";
import EventResults from "@/pages/EventResults";
import ManageEvents from "@/features/events/pages/ManageEvents";
import AddEvent from "@/pages/AddEvent";
import SelectCaptains from "@/pages/SelectCaptains";
import EditResults from "@/pages/EditResults";

// Results pages
import Results from "@/features/results/pages/Results";

// Player pages
import Profile from "@/features/players/pages/Profile";
import PlayerProfile from "@/pages/PlayerProfile";
import RateTeammates from "@/pages/RateTeammates";

// Other pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Chat from "@/pages/Chat";
import HelpAndSupport from "@/pages/HelpAndSupport";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const PrivateRoute = usePrivateRoute();
  const PublicRoute = usePublicRoute();

  return (
    <div className="min-h-screen w-full">
      <Routes>
        {/* Public routes */}
        <Route path={routes.auth.signIn} element={<PublicRoute><SignIn /></PublicRoute>} />
        <Route path={routes.auth.signUp} element={<PublicRoute><SignUp /></PublicRoute>} />
        <Route path={routes.auth.forgotPassword} element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        
        {/* Registration flows (protected but not requiring a complete profile) */}
        <Route path={routes.auth.completeRegistration} element={<PlayerRegistration />} />
        <Route path={routes.leagues.create} element={<CreateLeague />} />
        <Route path={routes.leagues.setup} element={<LeagueSetupPage />} />
        
        {/* Private routes requiring complete profiles */}
        <Route path={routes.home} element={<PrivateRoute><Index /></PrivateRoute>} />
        <Route path={routes.leagues.list} element={<PrivateRoute><Leagues /></PrivateRoute>} />
        <Route path={`${routes.leagues.list}/:id`} element={<PrivateRoute><LeagueDetails /></PrivateRoute>} />
        <Route path={routes.events.list} element={<PrivateRoute><Events /></PrivateRoute>} />
        <Route path={`${routes.events.list}/:id`} element={<PrivateRoute><EventDetails /></PrivateRoute>} />
        <Route path={`${routes.events.list}/:id/results`} element={<PrivateRoute><EventResults /></PrivateRoute>} />
        <Route path={routes.results} element={<PrivateRoute><Results /></PrivateRoute>} />
        <Route path={routes.chat} element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path={routes.players.rateTeammates} element={<PrivateRoute><RateTeammates /></PrivateRoute>} />
        <Route path={routes.players.profile} element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path={routes.players.playerProfile} element={<PrivateRoute><PlayerProfile /></PrivateRoute>} />
        <Route path={routes.events.manage} element={<PrivateRoute><ManageEvents /></PrivateRoute>} />
        <Route path={routes.events.add} element={<PrivateRoute><AddEvent /></PrivateRoute>} />
        <Route path={routes.help} element={<PrivateRoute><HelpAndSupport /></PrivateRoute>} />
        <Route path={`${routes.events.selectCaptains}/:eventId`} element={<PrivateRoute><SelectCaptains /></PrivateRoute>} />
        <Route path={`${routes.events.editResults}/:eventId`} element={<PrivateRoute><EditResults /></PrivateRoute>} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
