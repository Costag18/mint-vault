"use client";

import { useTransition } from "react";
import { moveItemToCollectionAction } from "@/lib/actions/items";

type Collection = { id: string; name: string };

export function MoveCollectionSelect({
  itemId,
  currentCollectionId,
  collections,
}: {
  itemId: string;
  currentCollectionId: string;
  collections: Collection[];
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newCollectionId = e.target.value;
    if (newCollectionId === currentCollectionId) return;
    startTransition(async () => {
      await moveItemToCollectionAction(itemId, newCollectionId);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <span className="material-symbols-outlined text-outline text-lg">
        folder
      </span>
      <select
        value={currentCollectionId}
        onChange={handleChange}
        disabled={isPending}
        className="bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary disabled:opacity-50"
      >
        {collections.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {isPending && (
        <span className="material-symbols-outlined text-primary text-sm animate-spin">
          progress_activity
        </span>
      )}
    </div>
  );
}
