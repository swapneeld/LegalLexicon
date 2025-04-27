import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // Add these fields for more complete configuration
  messagingSenderId: "000000000000", // Placeholder, not needed for auth
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Sign in with Email/Password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email/password:", error);
    throw error;
  }
};

// Register with Email/Password
export const registerWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error registering with email/password:", error);
    throw error;
  }
};

// Sign in with Facebook
export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Facebook:", error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Create a user in our backend after Firebase authentication
export const createOrGetUser = async (firebaseUser: FirebaseUser) => {
  try {
    // First, check if the user already exists in our database
    const response = await fetch(`/api/users/auth/${firebaseUser.providerData[0].providerId}/${firebaseUser.uid}`);
    
    if (response.ok) {
      // User exists, return it
      return await response.json();
    } else if (response.status === 404) {
      // User doesn't exist, create a new one
      const newUser = {
        username: firebaseUser.email?.split('@')[0] || `user_${Date.now()}`,
        email: firebaseUser.email || `user_${Date.now()}@example.com`,
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || `User ${Date.now()}`,
        profilePicture: firebaseUser.photoURL || '',
        authProvider: firebaseUser.providerData[0].providerId,
        authId: firebaseUser.uid,
        isAdmin: false,
      };
      
      const createResponse = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      if (!createResponse.ok) {
        throw new Error('Failed to create user in the database');
      }
      
      return await createResponse.json();
    } else {
      throw new Error('Error checking user existence');
    }
  } catch (error) {
    console.error("Error creating or getting user:", error);
    throw error;
  }
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export default app;
