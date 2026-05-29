import Link from "next/link";
import ItemForm from "@/components/admin/ItemForm";

export default function NewItemPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin"
        className="text-sm text-muted transition-colors hover:text-accent"
      >
        ← Back to items
      </Link>
      <h1 className="font-display text-3xl tracking-tight">Add a new item</h1>
      <ItemForm mode="create" />
    </div>
  );
}
