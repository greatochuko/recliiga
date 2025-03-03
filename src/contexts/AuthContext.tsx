
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
