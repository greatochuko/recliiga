import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, metadata: { full_name: string; role: string; phone: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        // Check if user is authenticated but profile is incomplete
        if (session?.user) {
          redirectBasedOnProfile(session.user);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // If user just signed in, check their profile
      if (session?.user) {
        redirectBasedOnProfile(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Helper function to check profile completion and redirect accordingly
  const redirectBasedOnProfile = async (user: User) => {
    try {
      if (user.user_metadata?.role === 'organizer') {
        // Check if league organizer has created a league
        const { data: leagues, error } = await supabase
          .from('leagues')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1);
        
        if (!leagues || leagues.length === 0) {
          // Organizer hasn't created a league yet, redirect to league creation
          navigate('/create-league');
        }
      } else if (user.user_metadata?.role === 'player') {
        // Check if player has completed profile setup
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, nickname')
          .eq('id', user.id)
          .limit(1);
        
        if (!profile || profile.length === 0 || !profile[0].nickname) {
          // Player hasn't completed their profile, redirect to registration
          navigate('/complete-registration');
        }
      }
    } catch (error) {
      console.error('Error checking profile completion:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Auth state change will handle redirection based on profile completion
      toast.success('Successfully signed in!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata: { full_name: string; role: string; phone: string }) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      if (error) throw error;
      
      // After successful signup, automatically sign them in
      if (data.user) {
        await signIn(email, password);
        
        // redirectBasedOnProfile is called by the auth state change listener
        // which will direct them to the appropriate registration flow
      } else {
        // If email confirmation is required
        toast.success('Registration successful! Please check your email to verify your account.');
        navigate('/sign-in');
      }
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear local storage and session storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear state
      setUser(null);
      setSession(null);
      
      toast.success('Successfully signed out');
      
      // Navigate with window.location to force a full page refresh
      window.location.href = '/sign-in';
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success('Password reset instructions have been sent to your email.');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!user?.id) {
      toast.error('No user found to delete');
      return;
    }

    try {
      // Show a loading toast
      toast.loading('Deleting your account...');

      // Call the Supabase Edge Function to delete user data
      const { error: deleteFunctionError } = await supabase.functions.invoke('delete-user', {
        body: { user_id: user.id }
      });

      if (deleteFunctionError) {
        throw new Error(deleteFunctionError.message || 'Failed to delete account data');
      }

      // Clear local storage and session storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear state
      setUser(null);
      setSession(null);

      toast.success('Your account has been deleted successfully');
      
      // Use window.location for a full page refresh
      window.location.href = '/sign-in';
    } catch (error: any) {
      console.error('Error in deletion process:', error);
      toast.error(error.message || 'Failed to delete account');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      signUp, 
      signIn, 
      signOut, 
      resetPassword,
      deleteAccount, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
