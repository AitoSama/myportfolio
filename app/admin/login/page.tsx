"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUser } from "@/lib/authorization";

function LoginContent() {
  const router = useRouter();
  const { currentUser, loading, error, signIn, signOut, clearError } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const isResolvingUnauthorizedUser = useRef(false);

  useEffect(() => {
    if (loading || !currentUser || isResolvingUnauthorizedUser.current) {
      return;
    }

    if (isAdminUser(currentUser)) {
      router.replace("/admin");
      return;
    }

    isResolvingUnauthorizedUser.current = true;
    void signOut().catch(() => undefined).finally(() => {
      isResolvingUnauthorizedUser.current = false;
    });
  }, [currentUser, loading, router, signOut]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    clearError();

    try {
      await signIn();
    } catch {
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOut();
    } catch {
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-16">
      <section className="w-full max-w-md border border-border bg-card p-8 shadow-sm">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          A1T0
        </p>
        <h1 className="text-3xl font-semibold">Admin Sign In</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Authentication testing entry point.
        </p>

        {loading ? (
          <p role="status" aria-live="polite" className="mt-8 text-sm text-muted-foreground">
            Restoring authentication state...
          </p>
        ) : currentUser ? (
          <div className="mt-8 space-y-4">
            <div className="border border-border p-4 text-sm">
              <p className="font-medium">
                {currentUser.displayName || "Signed-in user"}
              </p>
              <p className="mt-1 text-muted-foreground">
                {currentUser.email || "No email available"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Email verified: {currentUser.emailVerified ? "Yes" : "No"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              aria-busy={isSigningOut}
              className="w-full border border-foreground px-4 py-3 text-sm font-medium transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSignIn}
            disabled={isSigningIn}
            aria-busy={isSigningIn}
            className="mt-8 flex w-full items-center justify-center gap-3 border border-foreground px-4 py-3 text-sm font-medium transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSigningIn ? "Connecting to Google..." : "Continue with Google"}
          </button>
        )}

        {error ? (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </section>
    </div>
  );
}

export default function AdminLoginPage() {
  return <LoginContent />;
}
