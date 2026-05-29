"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteItem } from "@/app/admin/actions";

/**
 * Delete button with a simple inline confirm step (click once to arm, again to
 * confirm) so an item can't be removed by a single accidental tap.
 */
export default function DeleteItemButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onDelete() {
    startTransition(async () => {
      const res = await deleteItem(id);
      if (!res.ok) {
        setError(res.error);
        setConfirming(false);
        return;
      }
      router.refresh();
    });
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          className="rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink disabled:opacity-60"
          aria-label={`Confirm delete ${title}`}
        >
          {pending ? "Deleting…" : "Confirm"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="rounded-full border border-line px-3 py-1.5 text-sm text-muted"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <span className="flex flex-col items-end">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
      >
        Delete
      </button>
      {error && <span className="mt-1 text-xs text-accent">{error}</span>}
    </span>
  );
}
