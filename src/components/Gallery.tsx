"use client";

import { useMemo, useState } from "react";
import type { Item } from "@/lib/items";
import ItemCard from "./ItemCard";
import SearchAndFilter from "./SearchAndFilter";

/**
 * Client-side gallery: owns the search + category state, filters the items
 * passed in from the server page, and renders the grid (or an empty state
 * when nothing matches). Filtering happens in the browser so it feels instant
 * and needs no server round-trips.
 */
export default function Gallery({
  items,
  categories,
}: {
  items: Item[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(""); // "" = All

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = category === "" || item.category === category;
      if (!matchesCategory) return false;
      if (q === "") return true;
      // Search across title, description, category, and included items.
      const haystack = [
        item.title,
        item.description,
        item.category,
        ...item.includedItems,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query, category]);

  return (
    <div className="flex flex-col gap-8">
      <SearchAndFilter
        query={query}
        category={category}
        categories={categories}
        resultCount={filtered.length}
        onQueryChange={setQuery}
        onCategoryChange={setCategory}
      />

      {filtered.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => (
            <li
              key={item.slug}
              className="animate-rise-in"
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
            >
              <ItemCard item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          onReset={() => {
            setQuery("");
            setCategory("");
          }}
        />
      )}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-[var(--radius-brand)] border border-dashed border-line bg-surface/60 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line text-muted">
        <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="font-display text-xl">No baskets found</h2>
      <p className="max-w-sm text-sm text-muted">
        Nothing matches your search or filter right now. Try a different term or
        clear the filters.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-1 rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
      >
        Clear filters
      </button>
    </div>
  );
}
