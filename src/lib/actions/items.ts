"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  getItemsByUser,
  getItemCountByUser,
  getItemById,
  getTopItemsByValue,
  createItem,
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
