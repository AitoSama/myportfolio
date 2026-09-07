// auth.ts
import {
  browserSessionPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export class AuthError extends Error {
  readonly code: string;

  constructor(message: string, code = "auth/unknown") {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

function getFirebaseErrorCode(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return "auth/unknown";
}

export function getAuthErrorMessage(error: unknown): string {
  switch (getFirebaseErrorCode(error)) {
    case "auth/popup-closed-by-user":
      return "The Google sign-in window was closed before sign-in finished.";
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in window. Allow pop-ups and try again.";
    case "auth/network-request-failed":
      return "The sign-in request failed because of a network problem.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized for Firebase Authentication.";
    case "auth/operation-not-allowed":
      return "Google sign-in is not enabled in Firebase Authentication yet.";
    case "auth/invalid-api-key":
      return "Firebase Authentication is not configured correctly for this app.";
    default:
      return "Google sign-in could not be completed. Please try again.";
  }
}

export async function signInWithGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();

  try {
    await setPersistence(auth, browserSessionPersistence);
    return await signInWithPopup(auth, provider);
  } catch (error) {
    const code = getFirebaseErrorCode(error);
    console.error("Firebase Google sign-in failed:", code);
    throw new AuthError(getAuthErrorMessage(error), code);
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    const code = getFirebaseErrorCode(error);
    console.error("Firebase sign-out failed:", code);
    throw new AuthError("Sign-out could not be completed. Please try again.", code);
  }
}
