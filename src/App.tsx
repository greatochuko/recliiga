
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import ForgotPassword from '@/pages/ForgotPassword';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import Profile from '@/pages/Profile';
import CreateLeague from '@/pages/CreateLeague';
import PlayerRegistration from '@/pages/PlayerRegistration';
import Leagues from '@/pages/Leagues';
import LeagueDetails from '@/pages/LeagueDetails';
import Events from '@/pages/Events';
import EventDetails from '@/pages/EventDetails';
import Results from '@/pages/Results';
import Chat from '@/pages/Chat';
import EventResults from '@/pages/EventResults';
import RateTeammates from '@/pages/RateTeammates';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-league" element={<CreateLeague />} />
        <Route path="/player-registration" element={<PlayerRegistration />} />
        <Route path="/leagues" element={<Leagues />} />
        <Route path="/leagues/:id" element={<LeagueDetails />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/:id/results" element={<EventResults />} />
        <Route path="/results" element={<Results />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/rate-teammates" element={<RateTeammates />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}
