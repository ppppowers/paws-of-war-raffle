import Image from "next/image";
import Link from "next/link";
import Gallery from "@/components/Gallery";
import { getVisibleItems, getCategories } from "@/lib/items";

export default async function HomePage() {
  const [items, categories] = await Promise.all([
    getVisibleItems(),
    getCategories(),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      {/* Header / hero */}
      <header className="mb-12 flex flex-col items-start gap-5 sm:mb-16">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Paws of War"
            width={80}
            height={80}
            priority
            className="h-16 w-16 sm:h-20 sm:w-20"
          />
          <div className="flex flex-col">
            <span className="font-display text-xl font-semibold leading-none tracking-tight sm:text-2xl">
              Paws of War
            </span>
            <span className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Help A Vet <span aria-hidden="true">★</span> Save A Pet
            </span>
          </div>
        </div>

        <h1 className="max-w-3xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
          Raffle baskets that
          <br className="hidden sm:block" /> help a vet, save a pet.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Every basket below is up for raffle in support of Paws of War, a
          501(c)(3) nonprofit pairing rescue dogs with the veterans and first
          responders who need them. Browse the baskets and see exactly
          what&rsquo;s inside.
        </p>
      </header>

      {/* How to enter — EDIT THIS: replace the bracketed placeholders with your
          real raffle date, location, and ticket details. */}
      <section className="mb-12 rounded-[var(--radius-brand)] border border-line bg-surface p-6 sm:mb-16 sm:p-8">
        <h2 className="font-display text-2xl tracking-tight">How to enter</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          Raffle tickets are available at the event. The drawing will be held{" "}
          5/21/26 at Paws of War. Tickets are [PRICE] each, you need not be
          present to win. For questions, a Paws of War Volunteer or Staff.{" "}
          <a
            href="https://pawsofwar.org"
            className="font-medium text-accent hover:opacity-80"
          >
            
          </a>
          
        </p>
      </section>

      <Gallery items={items} categories={categories} />

      <footer className="mt-24 flex flex-col gap-4 border-t border-line pt-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p>© {new Date().getFullYear()} Paws of War.</p>
          <p>Paws of War is a registered 501(c)(3) nonprofit.</p>
          <p>Website designed by PowerHouseTech LLC.</p>
        </div>
        <nav className="flex items-center gap-5">
          <a
            href="https://pawsofwar.org"
            className="transition-colors hover:text-accent"
          >
            pawsofwar.org
          </a>
          <a
            href="https://pawsofwar.org/donate"
            className="transition-colors hover:text-accent"
          >
            Donate
          </a>
          <Link href="/admin" className="transition-colors hover:text-accent">
            Admin
          </Link>
        </nav>
      </footer>
    </main>
  );
}
