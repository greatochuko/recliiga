import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { deleteUser, getSession, login, registerUser } from "@/api/auth";
import { UserRatingType } from "@/types/events";

export type UserType = {
  avatar_url: string | null;
  city: string | null;
  created_at: string;
  date_of_birth: string | null;
  full_name: string | null;
  rating: number;
  id: string;
  ratings: UserRatingType[];
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
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const profile = await getSession();
      setUser(profile);
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data: profile, error, token } = await login(email, password);

      if (error !== null) {
        throw new Error(error);
      }

      localStorage.setItem("token", token);

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
      const { data: profile, error, token } = await registerUser(signupData);

      if (error !== null) {
        throw new Error(error);
      }

      localStorage.setItem("token", token);

      toast.success(
        "Registration successful! Please complete your player profile.",
      );

      setUser(profile);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("token");
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
        "Password reset instructions have been sent to your email.",
      );
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      // Show a loading toast
      toast.loading("Deleting your account...");

      const { error } = await deleteUser();

      if (error) {
        throw new Error(error || "Failed to delete account data");
      }

      localStorage.removeItem("token");
      setUser(null);

      // Clear state
      setUser(null);

      toast.success("Your account has been deleted successfully");
      toast.dismiss();

      // redirect("/sign-in");
    } catch (err) {
      const error = err as Error;
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
        setUser,
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
