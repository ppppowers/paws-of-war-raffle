import Link from "next/link";

// Custom 404 — shown for unknown routes and for missing/hidden item slugs.
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-5 py-24 text-center">
      <span className="font-display text-7xl text-accent">404</span>
      <h1 className="font-display text-3xl tracking-tight">
        We couldn&rsquo;t find that page
      </h1>
      <p className="max-w-md text-muted">
        That basket may have been removed, renamed, or never existed. Head back
        to browse the rest.
      </p>
      <Link
        href="/"
        className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
      >
        Back to all baskets
      </Link>
    </main>
  );
}
