
import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { routes } from '@/utils/routes';

interface PrivateRouteProps {
  children: ReactNode;
}

export function usePrivateRoute() {
  const PrivateRoute = ({ children }: PrivateRouteProps) => {
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
      return <Navigate to={routes.auth.signIn} />;
    }

    // If the user hasn't completed their profile, redirect to the appropriate registration page
    if (isProfileComplete === false) {
      if (user.user_metadata?.role === 'organizer') {
        return <Navigate to={routes.leagues.create} />;
      } else {
        return <Navigate to={routes.auth.completeRegistration} />;
      }
    }

    return <>{children}</>;
  };

  return PrivateRoute;
}

export function usePublicRoute() {
  const PublicRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      );
    }
    
    if (user) {
      return <Navigate to={routes.home} />;
    }

    return <>{children}</>;
  };

  return PublicRoute;
}
