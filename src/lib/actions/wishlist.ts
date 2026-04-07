"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  getWishlistByUser,
  createWishlistItem,
  deleteWishlistItem,
  updateWishlistAlerts,
} from "@/lib/db/queries/wishlist";

export async function getWishlistAction() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return getWishlistByUser(userId);
}

export async function createWishlistItemAction(
  data: Omit<Parameters<typeof createWishlistItem>[0], "userId">
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const result = await createWishlistItem({ ...data, userId });
  revalidatePath("/wishlist");
  revalidatePath("/dashboard");
  return result;
}

export async function deleteWishlistItemAction(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await deleteWishlistItem(id, userId);
  revalidatePath("/wishlist");
}

export async function toggleWishlistAlertsAction(id: string, enabled: boolean) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await updateWishlistAlerts(id, userId, enabled);
  revalidatePath("/wishlist");
}
