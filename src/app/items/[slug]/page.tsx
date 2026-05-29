import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImageGallery";
import { getItemBySlug } from "@/lib/items";

// Per-item SEO titles and descriptions.
export async function generateMetadata(
  props: PageProps<"/items/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const item = await getItemBySlug(slug);

  if (!item) {
    return { title: "Item not found" };
  }

  return {
    title: item.title,
    description: item.description,
    openGraph: {
      title: item.title,
      description: item.description,
      images: [item.coverImage],
    },
  };
}

export default async function ItemDetailPage(
  props: PageProps<"/items/[slug]">,
) {
  const { slug } = await props.params;
  const item = await getItemBySlug(slug);

  // Renders the custom not-found.tsx (404) for missing or hidden items.
  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-8 sm:px-8 sm:pt-12">
      {/* Back to all baskets */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M13 8H3m4-4l-4 4 4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to all baskets
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        {/* Left: gallery */}
        <div>
          <ImageGallery images={item.images} title={item.title} />
        </div>

        {/* Right: details */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-accent">
              {item.category}
            </span>
            <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              {item.title}
            </h1>
            <p className="text-base leading-relaxed text-muted">
              {item.description}
            </p>
          </div>

          {/* What's included */}
          <section>
            <h2 className="mb-3 font-display text-lg">What&rsquo;s included</h2>
            <ul className="flex flex-col gap-2.5">
              {item.includedItems.map((entry) => (
                <li key={entry} className="flex items-start gap-3 text-sm leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent/10 text-accent"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8.5l3.5 3.5L13 4.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{entry}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Optional notes */}
          {item.notes ? (
            <section className="rounded-[var(--radius-brand)] border border-line bg-surface p-5">
              <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                Notes
              </h2>
              <p className="text-sm leading-relaxed">{item.notes}</p>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
