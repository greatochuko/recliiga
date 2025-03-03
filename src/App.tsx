
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster"
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ManageEvents from './pages/ManageEvents';
import CreateLeague from './pages/CreateLeague';
import Help from './pages/Help';
import AddEvent from './pages/AddEvent';
import NotFound from './pages/NotFound';
import EventResults from "./pages/EventResults";
import Results from './pages/Results';
import SelectCaptains from './pages/SelectCaptains';
import InputResult from './pages/InputResult';

const queryClient = new QueryClient();

function App() {
  const { user, session, authData } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!authData?.token);
  }, [authData]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster /> 
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />

          {/* Private routes */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/manage-events" element={<PrivateRoute><ManageEvents /></PrivateRoute>} />
          <Route path="/create-league" element={<PrivateRoute><CreateLeague /></PrivateRoute>} />
          <Route path="/help" element={<PrivateRoute><Help /></PrivateRoute>} />
          <Route path="/add-event" element={<PrivateRoute><AddEvent /></PrivateRoute>} />
          <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
          <Route path="/event-results/:id" element={<PrivateRoute><EventResults /></PrivateRoute>} />
          <Route path="/select-captains/:eventId" element={<PrivateRoute><SelectCaptains /></PrivateRoute>} />
          <Route path="/input-result/:eventId" element={<PrivateRoute><InputResult /></PrivateRoute>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

// HOC for private routes
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { authData } = useAuth();
  const isAuthenticated = !!authData?.token;

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}
