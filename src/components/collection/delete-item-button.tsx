"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteItemAction } from "@/lib/actions/items";

export function DeleteItemButton({ itemId }: { itemId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Remove this item from your collection? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteItemAction(itemId);
      router.push("/collection");
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="flex items-center gap-2 px-6 py-4 rounded-xl border border-error/30 text-error font-headline font-bold text-xs uppercase tracking-widest hover:bg-error/10 transition-all active:scale-95 disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-lg">delete</span>
      {isPending ? "Removing..." : "Remove from Vault"}
    </button>
  );
}
