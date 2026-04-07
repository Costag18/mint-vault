"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  getCollectionsByUser,
  createCollection,
  deleteCollection,
} from "@/lib/db/queries/collections";

export async function getCollectionsAction() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return getCollectionsByUser(userId);
}

export async function createCollectionAction(data: {
  name: string;
  description?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const result = await createCollection(userId, data);
  revalidatePath("/collection");
  return result;
}

export async function deleteCollectionAction(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await deleteCollection(id, userId);
  revalidatePath("/collection");
}
