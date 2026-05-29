"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { createItem, updateItem, type ItemInput } from "@/app/admin/actions";
import type { Item } from "@/lib/items";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ItemForm({
  mode,
  item,
}: {
  mode: "create" | "edit";
  item?: Item;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [category, setCategory] = useState(item?.category ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [available, setAvailable] = useState(item?.available ?? true);
  const [includedItems, setIncludedItems] = useState<string[]>(
    item?.includedItems.length ? item.includedItems : [""],
  );
  const [images, setImages] = useState<string[]>(item?.images ?? []);
  const [coverImage, setCoverImage] = useState(item?.coverImage ?? "");

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function onFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setUploadError(null);
    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(fileList)) {
      const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("item-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) {
        setUploadError(error.message);
        continue;
      }
      const { data } = supabase.storage.from("item-images").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    if (uploaded.length > 0) {
      setImages((prev) => [...prev, ...uploaded]);
      setCoverImage((current) => current || uploaded[0]);
    }
    setUploading(false);
  }

  function removeImage(url: string) {
    setImages((prev) => {
      const next = prev.filter((u) => u !== url);
      if (url === coverImage) setCoverImage(next[0] ?? "");
      return next;
    });
  }

  function updateIncluded(index: number, value: string) {
    setIncludedItems((prev) => prev.map((v, i) => (i === index ? value : v)));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const input: ItemInput = {
      slug,
      title,
      category,
      description,
      notes,
      coverImage,
      images,
      includedItems: includedItems.filter((v) => v.trim() !== ""),
      available,
    };

    startTransition(async () => {
      const res =
        mode === "create" ? await createItem(input) : await updateItem(item!.id, input);
      if (!res.ok) {
        setSubmitError(res.error);
        return;
      }
      router.push("/admin");
      router.refresh();
    });
  }

  const fieldClass =
    "rounded-[var(--radius-brand)] border border-line bg-surface px-3 py-2.5 text-base focus:border-accent focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-6">
      {/* Title + slug */}
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Title
        <input
          className={fieldClass}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Slug (web address)
        <input
          className={`${fieldClass} font-mono text-sm`}
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          required
        />
        <span className="text-xs font-normal text-muted">
          Lowercase letters, numbers, and hyphens. Page will be at /items/{slug || "your-slug"}.
        </span>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Category
        <input
          className={fieldClass}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Cameras"
          required
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Short description
        <textarea
          className={`${fieldClass} min-h-20 resize-y`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>

      {/* Images */}
      <div className="flex flex-col gap-2.5 text-sm font-medium">
        Photos
        <p className="text-xs font-normal text-muted">
          Upload one or more photos. Click a photo to make it the cover (shown on
          the gallery card).
        </p>

        {images.length > 0 && (
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((url) => {
              const isCover = url === coverImage;
              return (
                <li key={url} className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setCoverImage(url)}
                    className={`relative aspect-square overflow-hidden rounded-md border-2 ${
                      isCover ? "border-accent" : "border-line"
                    }`}
                    aria-label={isCover ? "Cover photo" : "Set as cover photo"}
                  >
                    <Image src={url} alt="" fill sizes="120px" className="object-cover" />
                    {isCover && (
                      <span className="absolute bottom-1 left-1 rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-ink">
                        Cover
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="text-xs text-muted transition-colors hover:text-accent"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-normal transition-colors hover:border-accent">
          {uploading ? "Uploading…" : "+ Upload photos"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              onFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        {uploadError && <span className="text-xs text-accent">{uploadError}</span>}
      </div>

      {/* Included items */}
      <div className="flex flex-col gap-2.5 text-sm font-medium">
        What&rsquo;s included
        {includedItems.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              className={`${fieldClass} flex-1 font-normal`}
              value={value}
              onChange={(e) => updateIncluded(index, e.target.value)}
              placeholder={`Item ${index + 1}`}
            />
            <button
              type="button"
              onClick={() =>
                setIncludedItems((prev) =>
                  prev.length === 1 ? [""] : prev.filter((_, i) => i !== index),
                )
              }
              className="rounded-[var(--radius-brand)] border border-line px-3 text-muted transition-colors hover:border-accent hover:text-accent"
              aria-label="Remove this entry"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setIncludedItems((prev) => [...prev, ""])}
          className="w-fit text-sm font-normal text-accent transition-opacity hover:opacity-80"
        >
          + Add another
        </button>
      </div>

      {/* Notes */}
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Notes (optional)
        <textarea
          className={`${fieldClass} min-h-16 resize-y font-normal`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>

      {/* Available toggle */}
      <label className="flex items-center gap-3 text-sm font-medium">
        <input
          type="checkbox"
          checked={available}
          onChange={(e) => setAvailable(e.target.checked)}
          className="h-4 w-4 accent-[var(--brand-accent)]"
        />
        Visible on the public site
      </label>

      {submitError && (
        <p className="rounded-[var(--radius-brand)] border border-accent/30 bg-accent/5 px-3 py-2 text-sm text-accent">
          {submitError}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || uploading}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Saving…" : mode === "create" ? "Create item" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
