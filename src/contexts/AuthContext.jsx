import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { initializeUser, initializeGeneralChannel } from '../lib/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      await initializeUser(userCredential.user);
      await initializeGeneralChannel(); // Ensure general channel exists
      return userCredential;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await initializeUser(userCredential.user); // Ensure user document exists
      await initializeGeneralChannel(); // Ensure general channel exists
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await initializeUser(user);
        await initializeGeneralChannel();
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Usage example:
/*
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, signup, login, logout } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, username);
      // Redirect or show success message
    } catch (error) {
      // Handle error
    }
  };
}
*/ 