import Link from "next/link";
import { notFound } from "next/navigation";
import ItemForm from "@/components/admin/ItemForm";
import { getItemByIdAdmin } from "@/lib/items";

export default async function EditItemPage(
  props: PageProps<"/admin/items/[id]/edit">,
) {
  const { id } = await props.params;
  const item = await getItemByIdAdmin(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin"
        className="text-sm text-muted transition-colors hover:text-accent"
      >
        ← Back to items
      </Link>
      <h1 className="font-display text-3xl tracking-tight">Edit item</h1>
      <ItemForm mode="edit" item={item} />
    </div>
  );
}
