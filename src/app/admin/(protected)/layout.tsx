import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not signed in → bounce to login (middleware also covers this).
  if (!user) {
    redirect("/admin/login");
  }

  // Signed in but not an approved admin → sign out and bounce.
  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!adminRow) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-line bg-surface/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/admin" className="font-display text-lg tracking-tight">
            Gallery Admin
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/"
              target="_blank"
              className="text-muted transition-colors hover:text-accent"
            >
              View site ↗
            </Link>
            <span className="hidden text-muted sm:inline">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-line px-3 py-1.5 font-medium transition-colors hover:border-accent hover:text-accent"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8">
        {children}
      </div>
    </div>
  );
}
