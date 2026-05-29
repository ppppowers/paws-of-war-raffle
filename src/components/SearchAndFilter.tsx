"use client";

/**
 * Controlled search box + category filter pills. Holds no state of its own —
 * the parent (Gallery) owns the values and passes change handlers in. This
 * keeps filtering logic in one place and the component easy to reuse.
 */
export default function SearchAndFilter({
  query,
  category,
  categories,
  resultCount,
  onQueryChange,
  onCategoryChange,
}: {
  query: string;
  category: string; // "" means "All"
  categories: string[];
  resultCount: number;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Search */}
      <div className="relative">
        <svg
          width="18"
          height="18"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M11 11l3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search baskets…"
          aria-label="Search baskets"
          className="w-full rounded-full border border-line bg-surface py-3 pl-11 pr-4 text-base text-ink placeholder:text-muted shadow-sm transition-colors focus:border-accent focus:outline-none"
        />
      </div>

      {/* Category pills */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter by category"
      >
        <FilterPill
          label="All"
          active={category === ""}
          onClick={() => onCategoryChange("")}
        />
        {categories.map((cat) => (
          <FilterPill
            key={cat}
            label={cat}
            active={category === cat}
            onClick={() => onCategoryChange(cat)}
          />
        ))}

        <span className="ml-auto text-sm text-muted tabular-nums">
          {resultCount} {resultCount === 1 ? "basket" : "baskets"}
        </span>
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
        active
          ? "border-accent bg-accent text-accent-ink"
          : "border-line bg-surface text-ink hover:border-accent/60"
      }`}
    >
      {label}
    </button>
  );
}
