"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  getPreferences,
  upsertPreferences,
} from "@/lib/db/queries/preferences";
import { checkProfanity, validateAvatarUrl } from "@/lib/utils/moderation";

export async function getPreferencesAction() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return getPreferences(userId);
}

export async function updatePreferencesAction(
  data: Parameters<typeof upsertPreferences>[1]
): Promise<
  | { success: true; data: Awaited<ReturnType<typeof upsertPreferences>> }
  | { success: false; error: string }
> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Validate display name for profanity
  if (data.displayName) {
    const badWord = checkProfanity(data.displayName);
    if (badWord) {
      return {
        success: false,
        error: "Display name contains inappropriate language. Please choose a different name.",
      };
    }
  }

  // Validate avatar URL
  if (data.avatarUrl) {
    const avatarError = validateAvatarUrl(data.avatarUrl);
    if (avatarError) {
      return { success: false, error: avatarError };
    }
  }

  const result = await upsertPreferences(userId, data);
  revalidatePath("/settings");
  revalidatePath("/leaderboard");
  return { success: true, data: result };
}

export async function getCustomTagsAction(): Promise<string[]> {
  const { userId } = await auth();
  if (!userId) return [];
  const prefs = await getPreferences(userId);
  return prefs?.customTags ?? [];
}

export async function updateCustomTagsAction(tags: string[]) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return upsertPreferences(userId, { customTags: tags });
}
