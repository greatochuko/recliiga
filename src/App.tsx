
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Index from './pages/Index';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import PlayerProfile from './pages/PlayerProfile';
import PlayerRegistration from './pages/PlayerRegistration';
import CreateLeague from './pages/CreateLeague';
import LeagueSetupPage from './pages/LeagueSetupPage';
import SelectCaptains from './pages/SelectCaptains';
import ManageEvents from './pages/ManageEvents';
import AddEvent from './pages/AddEvent';
import EventResults from './pages/EventResults';
import EditResults from './pages/EditResults';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/player-profile/:id" element={<PlayerProfile />} />
          <Route path="/player-registration" element={<PlayerRegistration />} />
          <Route path="/create-league" element={<CreateLeague />} />
          <Route path="/league-setup" element={<LeagueSetupPage />} />
          <Route path="/select-captains/:eventId" element={<SelectCaptains />} />
          <Route path="/manage-events" element={<ManageEvents />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/events/:id/results" element={<EventResults />} />
          <Route path="/events/:id/edit-results" element={<EditResults />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
