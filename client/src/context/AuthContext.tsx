import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  MockUser,
  signInWithEmail,
  registerWithEmail,
  signOut as mockSignOut,
  onAuthStateChanged,
  auth
} from '@/lib/mockAuth';

// Define the shape of our auth context
type AuthContextType = {
  user: MockUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email?: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
};

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set up auth state listener on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  // Sign in with email/password
  const signIn = async (email?: string, password?: string) => {
    try {
      setLoading(true);
      
      if (email && password) {
        // If email and password are provided, use email/password sign in
        await signInWithEmail(email, password);
      } else {
        // Default behavior - we'll implement a test user
        await signInWithEmail('test@example.com', 'password123');
      }
      
      setError(null);
    } catch (error) {
      console.error('Sign in error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  // Register with email/password
  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      await registerWithEmail(email, password);
      setError(null);
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to register');
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut();
      setError(null);
    } catch (error) {
      console.error('Sign out error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to sign out');
      }
    } finally {
      setLoading(false);
    }
  };

  // Create the context value
  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
