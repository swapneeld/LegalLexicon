import { useCallback } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { signInWithGoogle, signInWithFacebook, signOut } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const { currentUser, firebaseUser, loading, error } = useAuthContext();
  const { toast } = useToast();

  const handleGoogleSignIn = useCallback(async () => {
    try {
      await signInWithGoogle();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
      toast({
        title: 'Authentication Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  const handleFacebookSignIn = useCallback(async () => {
    try {
      await signInWithFacebook();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Facebook';
      toast({
        title: 'Authentication Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.'
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
      toast({
        title: 'Sign Out Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  return {
    user: currentUser,
    firebaseUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.isAdmin || false,
    loading,
    error,
    signInWithGoogle: handleGoogleSignIn,
    signInWithFacebook: handleFacebookSignIn,
    signOut: handleSignOut
  };
}
