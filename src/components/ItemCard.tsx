import Image from "next/image";
import Link from "next/link";
import type { Item } from "@/lib/items";

/**
 * A single gallery card: cover image, category tag, title, short description,
 * and a "View Details" affordance. The whole card is one link for an easy tap
 * target on mobile; the labelled button is kept for visual clarity.
 */
export default function ItemCard({ item }: { item: Item }) {
  return (
    <Link
      href={`/items/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-brand)] border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(20,42,99,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper">
        <Image
          src={item.coverImage}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-accent/95 px-3 py-1 text-xs font-medium uppercase tracking-wide text-accent-ink backdrop-blur">
          {item.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h2 className="font-display text-xl leading-snug tracking-tight">
          {item.title}
        </h2>
        <p className="text-sm leading-relaxed text-muted line-clamp-2">
          {item.description}
        </p>

        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
          View Details
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
