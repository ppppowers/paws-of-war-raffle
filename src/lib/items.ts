import { createClient } from "@/lib/supabase/server";

/**
 * The shape used throughout the UI. Mirrors a row in the Supabase `items`
 * table, converted to camelCase.
 */
export type Item = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  notes?: string;
  coverImage: string;
  images: string[];
  includedItems: string[];
  available: boolean;
};

/** Raw row shape returned by Supabase (snake_case). */
type ItemRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  notes: string | null;
  cover_image: string;
  images: string[] | null;
  included_items: string[] | null;
  available: boolean;
};

function mapRow(row: ItemRow): Item {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    description: row.description,
    notes: row.notes ?? undefined,
    coverImage: row.cover_image,
    images: row.images ?? [],
    includedItems: row.included_items ?? [],
    available: row.available,
  };
}

/* ------------------------------------------------------------------ *
 * Public reads — only `available` items, visible to everyone.
 * ------------------------------------------------------------------ */

export async function getVisibleItems(): Promise<Item[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("available", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load items:", error.message);
    return [];
  }
  return (data as ItemRow[]).map(mapRow);
}

export async function getItemBySlug(slug: string): Promise<Item | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("slug", slug)
    .eq("available", true)
    .maybeSingle();

  if (error || !data) return null;
  return mapRow(data as ItemRow);
}

export async function getCategories(): Promise<string[]> {
  const items = await getVisibleItems();
  const set = new Set(items.map((item) => item.category));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/* ------------------------------------------------------------------ *
 * Admin reads — every item, including hidden ones. Row-Level Security
 * only returns rows when the caller is a signed-in approved admin.
 * ------------------------------------------------------------------ */

export async function getAllItemsAdmin(): Promise<Item[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load items (admin):", error.message);
    return [];
  }
  return (data as ItemRow[]).map(mapRow);
}

export async function getItemByIdAdmin(id: string): Promise<Item | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapRow(data as ItemRow);
}
