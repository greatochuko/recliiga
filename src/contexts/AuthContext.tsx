import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { redirect, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { checkProfileCompletion } from "@/api/user";
import { getSession, login, logout, registerUser } from "@/api/auth";

export type UserType = {
  avatar_url: string | null;
  city: string | null;
  created_at: string;
  date_of_birth: string | null;
  full_name: string | null;
  id: string;
  nickname: string | null;
  phone: string | null;
  positions: string[] | null;
  role: string | null;
  sports: string[] | null;
  updated_at: string;
  email: string;
};

export type SignupDataType = {
  email: string;
  password: string;
  full_name: string;
  role: string;
  phone: string;
};

interface AuthContextType {
  user: UserType | null;
  signUp: (signupData: SignupDataType) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  loading: boolean;
  isProfileComplete: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const profile = await getSession();
        setUser(profile);

        if (profile) {
          const profileComplete = await checkProfileCompletion();
          setIsProfileComplete(profileComplete);
        } else {
          setIsProfileComplete(false);
        }
      } catch {
        setIsProfileComplete(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data: profile, error } = await login(email, password);

      if (error !== null) {
        throw new Error(error);
      }

      setUser(profile);
      toast.success("Successfully signed in!");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
      throw error;
    }
  };

  const signUp = async (signupData: SignupDataType) => {
    try {
      const { data: profile, error } = await registerUser(signupData);

      if (error !== null) {
        throw new Error(error);
      }

      setUser(profile);

      // Handle different registrations based on role
      if (signupData.role === "organizer") {
        toast.success(
          "Registration successful! Please sign in to complete your league setup."
        );
      } else {
        toast.success(
          "Registration successful! Please sign in to complete your player profile."
        );
      }

      redirect("/sign-in");
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
      const logoutSuccess = await logout();
      if (!logoutSuccess) {
        throw new Error("Something went wrong");
      }
      // Clear state
      setUser(null);

      toast.success("Successfully signed out");
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

      toast.success("Your account has been deleted successfully");

      // Use window.location for a full page refresh
      // window.location.href = "/sign-in";
      navigate("/sign-in");
    } catch (err) {
      const error = err as Error;
      console.error("Error in deletion process:", error.message);
      toast.error(error.message || "Failed to delete account");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        signIn,
        signOut,
        resetPassword,
        deleteAccount,
        loading,
        isProfileComplete,
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
