import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import ErrorPage from "./pages/ErrorPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <AuthWrapper />
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: "/sign-in", element: <SignIn /> },
      { path: "/sign-up", element: <SignUp /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/complete-registration", element: <PlayerRegistration /> },
      { path: "/league-setup", element: <LeagueSetupPage /> },
      {
        element: <AppLayout />,
        errorElement: <ErrorPage />,
        children: [
          { path: "/", element: <HomeScreen /> },
          { path: "/create-league", element: <CreateLeague /> },
          { path: "/leagues", element: <Leagues /> },
          { path: "/leagues/:id", element: <LeagueDetails /> },
          { path: "/events", element: <Events /> },
          { path: "/events/:id", element: <EventDetails /> },
          { path: "/events/:id/edit", element: <EditEvent /> },
          { path: "/events/:id/results", element: <EventResults /> },
          { path: "/events/:id/team-draft", element: <TeamDraftPage /> },
          { path: "/results", element: <Results /> },
          { path: "/chat", element: <Chat /> },
          { path: "/rate-teammates", element: <RateTeammates /> },
          { path: "/profile", element: <Profile /> },
          { path: "/profile/:userId", element: <PlayerProfile /> },
          { path: "/manage-events", element: <ManageEvents /> },
          { path: "/add-event", element: <AddEvent /> },
          { path: "/help", element: <HelpAndSupport /> },
          { path: "/:eventId/select-captains", element: <SelectCaptains /> },
          { path: "/edit-results/:eventId", element: <EditResults /> },
          {
            path: "/rate-teammates/:eventId",
            element: <RateTeammatesByEvent />,
          },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
