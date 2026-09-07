// AuthContext.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getAuthErrorMessage,
  signInWithGoogle,
  signOutUser,
} from "@/lib/auth";

interface AuthContextValue {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  signIn: typeof signInWithGoogle;
  signOut: typeof signOutUser;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setLoading(false);
      },
      (authError) => {
        console.error("Firebase auth state failed:", authError.message);
        setError(getAuthErrorMessage(authError));
        setLoading(false);
      },
    );
  }, []);

  const signIn = useCallback(async () => {
    setError(null);

    try {
      return await signInWithGoogle();
    } catch (signInError) {
      setError(getAuthErrorMessage(signInError));
      throw signInError;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);

    try {
      await signOutUser();
    } catch (signOutError) {
      setError(getAuthErrorMessage(signOutError));
      throw signOutError;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        signIn,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
