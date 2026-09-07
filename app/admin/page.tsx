"use client";

import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-16">
        <section className="w-full max-w-md border border-border bg-card p-8 shadow-sm">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            A1T0
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Admin Access Ready</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Authentication and authorization are configured.
          </p>
          <Link
            href="/admin/projects"
            className="mt-6 inline-block border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-80"
          >
            Manage projects
          </Link>
        </section>
      </div>
    </AdminGuard>
  );
}