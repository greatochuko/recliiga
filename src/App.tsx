
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

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  console.log('PrivateRoute - Auth State:', { user, loading });
  console.log('User metadata:', user?.user_metadata);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // If not logged in, redirect to sign-in
  if (!user) {
    console.log('No user found, redirecting to sign-in');
    return <Navigate to="/sign-in" />;
  }

  // Get user metadata with default values for safety
  const userMetadata = user.user_metadata || {};
  const isPlayer = userMetadata?.role === 'player';
  const hasProfile = userMetadata?.profile_completed === true;

  console.log('User Role Check:', { isPlayer, hasProfile });

  // Show the children if profile is completed
  if (hasProfile) {
    return <>{children}</>;
  }

  // Redirect to appropriate registration flow if profile is not complete
  if (isPlayer) {
    console.log('Redirecting to player registration');
    return <Navigate to="/complete-registration" />;
  } else {
    console.log('Redirecting to league creation');
    return <Navigate to="/create-league" />;
  }
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  console.log('PublicRoute - Auth State:', { user, loading });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  if (user) {
    console.log('User found in public route, redirecting to home');
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
