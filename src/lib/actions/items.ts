"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  getItemsByUser,
  getItemCountByUser,
  getItemById,
  getTopItemsByValue,
  createItem,
  updateItem,
  deleteItem,
} from "@/lib/db/queries/items";
import { logActivity } from "@/lib/db/queries/activity";

export async function getItemsAction(
  options?: Parameters<typeof getItemsByUser>[1]
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return getItemsByUser(userId, options);
}

export async function getItemCountAction() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return getItemCountByUser(userId);
}

export async function getItemDetailAction(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return getItemById(id, userId);
}

export async function getTopItemsAction(limit?: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return getTopItemsByValue(userId, limit);
}

export async function createItemAction(
  data: Parameters<typeof createItem>[0]
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const item = await createItem({ ...data, userId });

  await logActivity({
    userId,
    type: "item_added",
    itemId: item.id,
    metadata: { name: item.name },
  });

  revalidatePath("/collection");
  revalidatePath("/dashboard");

  return item;
}

export async function moveItemToCollectionAction(
  itemId: string,
  collectionId: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await updateItem(itemId, userId, { collectionId });
  revalidatePath("/collection");
}

export async function updateItemTagsAction(
  itemId: string,
  tags: string[]
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await updateItem(itemId, userId, { tags });
  revalidatePath("/collection");
  revalidatePath(`/collection/${itemId}`);
}

export async function updateItemDetailsAction(
  itemId: string,
  data: {
    name?: string;
    variant?: string;
    grade?: string;
    gradingService?: string;
    certNumber?: string;
    purchasePrice?: string;
    purchaseDate?: string;
    notes?: string;
    tags?: string[];
    quantity?: number;
  }
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await updateItem(itemId, userId, {
    name: data.name || undefined,
    variant: data.variant ?? undefined,
    grade: data.grade ?? undefined,
    gradingService: data.gradingService ?? undefined,
    certNumber: data.certNumber ?? undefined,
    purchasePrice: data.purchasePrice ?? undefined,
    purchaseDate: data.purchaseDate ?? undefined,
    notes: data.notes ?? undefined,
    tags: data.tags,
    quantity: data.quantity,
  });
  revalidatePath(`/collection/${itemId}`);
  revalidatePath("/collection");
  revalidatePath("/dashboard");
}

export async function deleteItemAction(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const existing = await getItemById(id, userId);

  await deleteItem(id, userId);

  await logActivity({
    userId,
    type: "item_removed",
    itemId: id,
    metadata: existing ? { name: existing.item.name } : undefined,
  });

  revalidatePath("/collection");
  revalidatePath("/dashboard");
}
