import Image from "next/image";
import Link from "next/link";
import { getAllItemsAdmin } from "@/lib/items";
import DeleteItemButton from "@/components/admin/DeleteItemButton";

export default async function AdminDashboard() {
  const items = await getAllItemsAdmin();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Items</h1>
          <p className="mt-1 text-sm text-muted">
            {items.length} {items.length === 1 ? "item" : "items"} · add, edit, or
            remove below.
          </p>
        </div>
        <Link
          href="/admin/items/new"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
        >
          <span className="text-base leading-none">+</span> Add item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[var(--radius-brand)] border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
          <p className="text-muted">No items yet. Add your first one.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-4 rounded-[var(--radius-brand)] border border-line bg-surface p-3"
            >
              <div className="relative h-16 w-20 flex-none overflow-hidden rounded-md bg-paper">
                <Image
                  src={item.coverImage}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-medium">{item.title}</span>
                  {!item.available && (
                    <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs text-muted">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-sm text-muted">
                  {item.category} · /{item.slug}
                </p>
              </div>

              <div className="flex flex-none items-center gap-2">
                <Link
                  href={`/admin/items/${item.id}/edit`}
                  className="rounded-full border border-line px-4 py-1.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
                >
                  Edit
                </Link>
                <DeleteItemButton id={item.id} title={item.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
