
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  user_metadata?: {
    full_name?: string;
    role?: string;
    phone?: string;
  };
}

interface AuthData {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  authData: AuthData | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  // Add the missing methods to match usage in other components
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  authData: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loading: true,
  // Add missing method implementations
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  deleteAccount: async () => {},
  resetPassword: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      // In a real app, you would call your authentication API
      const mockUser = {
        id: '12345',
        email,
        name: 'Mock User',
        user_metadata: {
          full_name: 'Mock User',
          role: 'player',
        },
      };
      
      const mockToken = 'mock-jwt-token';
      
      setUser(mockUser);
      setAuthData({
        token: mockToken,
        user: mockUser,
      });
      
      // Store in localStorage for persistence
      localStorage.setItem('authData', JSON.stringify({
        token: mockToken,
        user: mockUser,
      }));
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Mock register function
  const register = async (email: string, password: string, name: string) => {
    try {
      // In a real app, you would call your registration API
      const mockUser = {
        id: '12345',
        email,
        name,
        user_metadata: {
          full_name: name,
          role: 'player',
        },
      };
      
      const mockToken = 'mock-jwt-token';
      
      setUser(mockUser);
      setAuthData({
        token: mockToken,
        user: mockUser,
      });
      
      // Store in localStorage for persistence
      localStorage.setItem('authData', JSON.stringify({
        token: mockToken,
        user: mockUser,
      }));
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Mock logout function
  const logout = async () => {
    try {
      // Clear state
      setUser(null);
      setSession(null);
      setAuthData(null);
      
      // Remove from localStorage
      localStorage.removeItem('authData');
      
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Implement the missing methods
  const signIn = async (email: string, password: string) => {
    // Reuse the login function
    return login(email, password);
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const name = metadata?.full_name || 'New User';
      return register(email, password, name);
    } catch (error) {
      console.error('SignUp error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    // Reuse the logout function
    return logout();
  };

  const deleteAccount = async () => {
    try {
      // Clear state
      setUser(null);
      setSession(null);
      setAuthData(null);
      
      // Remove from localStorage
      localStorage.removeItem('authData');
      
      console.log('Account deleted');
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Password reset email sent to:', email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  // Load auth data from localStorage on initial render
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const storedAuthData = localStorage.getItem('authData');
        
        if (storedAuthData) {
          const parsedAuthData = JSON.parse(storedAuthData);
          setUser(parsedAuthData.user);
          setAuthData(parsedAuthData);
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAuthData();
  }, []);

  const value = {
    user,
    session,
    authData,
    login,
    register,
    logout,
    loading,
    // Add the missing methods to the context value
    signIn,
    signUp,
    signOut,
    deleteAccount,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
