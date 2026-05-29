"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 px-5 py-24">
      <div className="flex flex-col gap-2 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          The Gallery
        </span>
        <h1 className="font-display text-3xl tracking-tight">Admin sign in</h1>
        <p className="text-sm text-muted">Sign in to manage your items.</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-[var(--radius-brand)] border border-line bg-surface px-3 py-2.5 text-base font-normal focus:border-accent focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-[var(--radius-brand)] border border-line bg-surface px-3 py-2.5 text-base font-normal focus:border-accent focus:outline-none"
          />
        </label>

        {error && (
          <p className="rounded-[var(--radius-brand)] border border-accent/30 bg-accent/5 px-3 py-2 text-sm text-accent">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <Link href="/" className="text-center text-sm text-muted transition-colors hover:text-accent">
        ← Back to the gallery
      </Link>
    </main>
  );
}
