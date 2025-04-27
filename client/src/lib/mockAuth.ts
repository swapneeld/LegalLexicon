// Mock authentication system for development without Firebase
// This file simulates Firebase Auth functionality in the Replit environment

// Define a type for our mock user
export interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  emailVerified: boolean;
}

// Mock user data store (in-memory)
const users: Record<string, { email: string; password: string; displayName: string }> = {
  'test@example.com': { 
    email: 'test@example.com', 
    password: 'password123', 
    displayName: 'Test User' 
  }
};

// Mock current user state
let currentUser: MockUser | null = null;

// Listeners for auth state changes
const listeners: ((user: MockUser | null) => void)[] = [];

// Sign in with email/password
export const signInWithEmail = async (email: string, password: string): Promise<MockUser> => {
  return new Promise((resolve, reject) => {
    // Small delay to simulate network request
    setTimeout(() => {
      const userRecord = users[email];
      
      if (!userRecord) {
        reject(new Error('User not found'));
        return;
      }
      
      if (userRecord.password !== password) {
        reject(new Error('Invalid password'));
        return;
      }
      
      // Create user object
      const user: MockUser = {
        uid: btoa(email), // Simple base64 encoding of email as uid
        email: email,
        displayName: userRecord.displayName,
        photoURL: null,
        isAnonymous: false,
        emailVerified: true
      };
      
      // Update current user
      currentUser = user;
      
      // Notify listeners
      listeners.forEach(listener => listener(currentUser));
      
      resolve(user);
    }, 500);
  });
};

// Register with email/password
export const registerWithEmail = async (email: string, password: string, displayName: string = ''): Promise<MockUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (users[email]) {
        reject(new Error('Email already in use'));
        return;
      }
      
      // Create new user record
      users[email] = {
        email,
        password,
        displayName: displayName || email.split('@')[0]
      };
      
      // Create user object
      const user: MockUser = {
        uid: btoa(email),
        email: email,
        displayName: users[email].displayName,
        photoURL: null,
        isAnonymous: false,
        emailVerified: true
      };
      
      // Update current user
      currentUser = user;
      
      // Notify listeners
      listeners.forEach(listener => listener(currentUser));
      
      resolve(user);
    }, 500);
  });
};

// Sign out
export const signOut = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentUser = null;
      
      // Notify listeners
      listeners.forEach(listener => listener(null));
      
      resolve();
    }, 300);
  });
};

// Subscribe to auth state changes
export const onAuthStateChanged = (callback: (user: MockUser | null) => void): (() => void) => {
  listeners.push(callback);
  
  // Call with current state immediately
  callback(currentUser);
  
  // Return unsubscribe function
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

// Mock auth object
export const auth = {
  currentUser,
  onAuthStateChanged
};

export default {
  signInWithEmail,
  registerWithEmail,
  signOut,
  onAuthStateChanged,
  auth
};