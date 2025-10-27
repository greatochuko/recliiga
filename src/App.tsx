import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AuthWrapper from "./components/AuthWrapper";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ChatProvider from "./contexts/ChatContext";

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
import { Dashboard } from "./pages/Dashboard";
import EditEvent from "./pages/EditEvent";
import RateTeammatesByEvent from "./pages/RateTeammatesByEvent";
import ErrorPage from "./pages/ErrorPage";
import LeagueInvitationPage from "./pages/LeagueInvitationPage";
import HomePage from "./pages/HomePage";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    { path: "/", element: <HomePage /> },
    {
      element: <AuthWrapper />,
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
            { path: "/dashboard/", element: <Dashboard /> },
            { path: "/dashboard/create-league", element: <CreateLeague /> },
            { path: "/dashboard/leagues", element: <Leagues /> },
            { path: "/dashboard/leagues/:id", element: <LeagueDetails /> },
            { path: "/dashboard/events", element: <Events /> },
            { path: "/dashboard/events/:id", element: <EventDetails /> },
            { path: "/dashboard/events/:id/edit", element: <EditEvent /> },
            {
              path: "/dashboard/events/:id/results",
              element: <EventResults />,
            },
            {
              path: "/dashboard/events/:id/team-draft",
              element: <TeamDraftPage />,
            },
            { path: "/dashboard/results", element: <Results /> },
            { path: "/dashboard/chat", element: <Chat /> },
            { path: "/dashboard/rate-teammates", element: <RateTeammates /> },
            { path: "/dashboard/profile", element: <Profile /> },
            { path: "/dashboard/profile/:userId", element: <PlayerProfile /> },
            { path: "/dashboard/manage-events", element: <ManageEvents /> },
            { path: "/dashboard/add-event", element: <AddEvent /> },
            { path: "/dashboard/help", element: <HelpAndSupport /> },
            {
              path: "/dashboard/:eventId/select-captains",
              element: <SelectCaptains />,
            },
            {
              path: "/dashboard/edit-results/:eventId",
              element: <EditResults />,
            },
            {
              path: "/dashboard/invite/:leagueCode",
              element: <LeagueInvitationPage />,
            },
            {
              path: "/dashboard/rate-teammates/:eventId",
              element: <RateTeammatesByEvent />,
            },
            { path: "*", element: <NotFound /> },
          ],
        },
      ],
    },
    { path: "*", element: <NotFound /> },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
    },
  },
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ChatProvider>
          <RouterProvider
            router={router}
            future={{ v7_startTransition: true }}
          />
        </ChatProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
