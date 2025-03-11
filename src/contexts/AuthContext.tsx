import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (
    email: string,
    password: string,
    metadata: { full_name: string; role: string; phone: string }
  ) => Promise<void>;
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
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error checking auth session:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate("/");
      toast.success("Successfully signed in!");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    metadata: { full_name: string; role: string; phone: string }
  ) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });
      if (error) throw error;

      // Handle different registrations based on role
      if (metadata.role === "organizer") {
        toast.success(
          "Registration successful! Please sign in to complete your league setup."
        );
      } else {
        toast.success(
          "Registration successful! Please sign in to complete your player profile."
        );
      }

      // Redirect to sign-in so they can authenticate first
      navigate("/sign-in");
    } catch (err) {
      const error = err as Error;
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

      toast.success("Successfully signed out");

      // Navigate with window.location to force a full page refresh
      // window.location.href = "/sign-in";
      navigate("/sign-in");
    } catch (err) {
      const error = err as Error;
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
      toast.success(
        "Password reset instructions have been sent to your email."
      );
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
      throw error;
    }
  };

  const deleteAccount = async () => {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      toast.error("No user found to delete");
      return;
    }
    const userId = user.user.id;

    try {
      // Show a loading toast
      toast.loading("Deleting your account...");

      // Call the Supabase Edge Function to delete user data
      const { error: deleteUserError } = await supabase.functions.invoke(
        "delete-user",
        {
          body: { user_id: userId },
        }
      );

      if (deleteUserError) {
        throw new Error(
          deleteUserError.message || "Failed to delete account data"
        );
      }

      // Clear local storage and session storage
      localStorage.clear();
      sessionStorage.clear();

      // Sign out from Supabase
      await supabase.auth.signOut();

      // Clear state
      setUser(null);
      setSession(null);

      toast.success("Your account has been deleted successfully");

      // Use window.location for a full page refresh
      // window.location.href = "/sign-in";
      navigate("/sign-in");
    } catch (err) {
      const error = err as Error;
      console.error("Error in deletion process:", error);
      toast.error(error.message || "Failed to delete account");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signUp,
        signIn,
        signOut,
        resetPassword,
        deleteAccount,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
