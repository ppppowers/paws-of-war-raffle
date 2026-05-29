"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Form payload sent from the editor. */
export type ItemInput = {
  slug: string;
  title: string;
  category: string;
  description: string;
  notes: string;
  coverImage: string;
  images: string[];
  includedItems: string[];
  available: boolean;
};

export type ActionResult = { ok: true } | { ok: false; error: string };

const STORAGE_PREFIX = "/storage/v1/object/public/item-images/";

/**
 * Confirms the caller is a signed-in, approved admin. Row-Level Security also
 * enforces this at the database, but checking here gives friendlier errors.
 */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { supabase, ok: false as const, error: "You are not signed in." };
  }
  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!adminRow) {
    return { supabase, ok: false as const, error: "Your account is not an approved admin." };
  }
  return { supabase, ok: true as const };
}

function toRow(input: ItemInput) {
  const images = input.images.map((s) => s.trim()).filter(Boolean);
  const coverImage = input.coverImage.trim();
  // Make sure the cover is part of the gallery.
  if (coverImage && !images.includes(coverImage)) {
    images.unshift(coverImage);
  }
  return {
    slug: input.slug.trim().toLowerCase(),
    title: input.title.trim(),
    category: input.category.trim(),
    description: input.description.trim(),
    notes: input.notes.trim() === "" ? null : input.notes.trim(),
    cover_image: coverImage,
    images,
    included_items: input.includedItems.map((s) => s.trim()).filter(Boolean),
    available: input.available,
  };
}

function validate(row: ReturnType<typeof toRow>): string | null {
  if (!row.title) return "Title is required.";
  if (!row.slug) return "Slug is required.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug)) {
    return "Slug may only contain lowercase letters, numbers, and hyphens.";
  }
  if (!row.category) return "Category is required.";
  if (!row.description) return "Description is required.";
  if (!row.cover_image) return "Please add at least one image (it becomes the cover).";
  return null;
}

function revalidateAll(slug?: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/items/${slug}`);
}

export async function createItem(input: ItemInput): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { ok: false, error: auth.error };

  const row = toRow(input);
  const error = validate(row);
  if (error) return { ok: false, error };

  const { error: dbError } = await auth.supabase.from("items").insert(row);
  if (dbError) {
    if (dbError.code === "23505") {
      return { ok: false, error: "That slug is already in use — choose a different one." };
    }
    return { ok: false, error: dbError.message };
  }

  revalidateAll(row.slug);
  return { ok: true };
}

export async function updateItem(id: string, input: ItemInput): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { ok: false, error: auth.error };

  const row = toRow(input);
  const error = validate(row);
  if (error) return { ok: false, error };

  const { error: dbError } = await auth.supabase.from("items").update(row).eq("id", id);
  if (dbError) {
    if (dbError.code === "23505") {
      return { ok: false, error: "That slug is already in use — choose a different one." };
    }
    return { ok: false, error: dbError.message };
  }

  revalidateAll(row.slug);
  return { ok: true };
}

export async function deleteItem(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { ok: false, error: auth.error };

  // Look up the images first so we can clean up uploaded files afterwards.
  const { data: existing } = await auth.supabase
    .from("items")
    .select("images")
    .eq("id", id)
    .maybeSingle();

  const { error: dbError } = await auth.supabase.from("items").delete().eq("id", id);
  if (dbError) return { ok: false, error: dbError.message };

  // Remove any images that live in our storage bucket (skip seed SVG paths).
  const images: string[] = existing?.images ?? [];
  const paths = images
    .filter((url) => url.includes(STORAGE_PREFIX))
    .map((url) => decodeURIComponent(url.split(STORAGE_PREFIX)[1]));
  if (paths.length > 0) {
    await auth.supabase.storage.from("item-images").remove(paths);
  }

  revalidateAll();
  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
