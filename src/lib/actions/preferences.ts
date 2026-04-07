"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  getPreferences,
  upsertPreferences,
} from "@/lib/db/queries/preferences";

export async function getPreferencesAction() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return getPreferences(userId);
}

export async function updatePreferencesAction(
  data: Parameters<typeof upsertPreferences>[1]
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const result = await upsertPreferences(userId, data);
  revalidatePath("/settings");
  return result;
}
