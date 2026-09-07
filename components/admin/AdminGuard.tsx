"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAdminUser } from "@/lib/authorization";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentUser, loading, signOut } = useAuth();
  const isSigningOutUnauthorizedUser = useRef(false);

  useEffect(() => {
    if (loading || isSigningOutUnauthorizedUser.current) {
      return;
    }

    if (!currentUser) {
      router.replace("/admin/login");
      return;
    }

    if (isAdminUser(currentUser)) {
      return;
    }

    isSigningOutUnauthorizedUser.current = true;
    void signOut()
      .catch(() => undefined)
      .finally(() => {
        router.replace("/admin/login");
      });
  }, [currentUser, loading, router, signOut]);

  if (loading || !currentUser || !isAdminUser(currentUser)) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-16">
        <p className="text-sm text-muted-foreground">
          Checking administrator access...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
