import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppLayout from "./pages/AppLayout";
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
import AddEvent from "./pages/AddEvent";
import SelectCaptains from "./pages/SelectCaptains";
import EditResults from "./pages/EditResults";
import TeamDraftPage from "./pages/TeamDraftPage";
import AuthWrapper from "./components/AuthWrapper";
import { HomeScreen } from "./components/dashboard/HomeScreen";
import EditEvent from "./pages/EditEvent";
import RateTeammatesByEvent from "./pages/RateTeammatesByEvent";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <div className="min-h-dvh w-full">
    <Routes>
      {/* Public routes */}
      <Route element={<AuthWrapper />}>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Registration flows (protected but not requiring a complete profile) */}
        <Route path="/complete-registration" element={<PlayerRegistration />} />
        <Route path="/league-setup" element={<LeagueSetupPage />} />

        {/* Private routes requiring complete profiles */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/create-league" element={<CreateLeague />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/leagues/:id" element={<LeagueDetails />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/events/:id/edit" element={<EditEvent />} />
          <Route path="/events/:id/results" element={<EventResults />} />
          <Route path="/events/:id/team-draft" element={<TeamDraftPage />} />
          <Route path="/results" element={<Results />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/rate-teammates" element={<RateTeammates />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<PlayerProfile />} />
          <Route path="/manage-events" element={<ManageEvents />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/help" element={<HelpAndSupport />} />
          <Route
            path="/:eventId/select-captains"
            element={<SelectCaptains />}
          />
          <Route path="/edit-results/:eventId" element={<EditResults />} />
          <Route
            path="/rate-teammates/:eventId"
            element={<RateTeammatesByEvent />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

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
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
