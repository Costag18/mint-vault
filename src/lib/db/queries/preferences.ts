import { db } from "@/lib/db";
import { userPreferences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getPreferences(userId: string) {
  const result = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);
  return result[0] ?? null;
}

export async function upsertPreferences(
  userId: string,
  data: Partial<{
    displayName: string;
    avatarUrl: string;
    profilePublic: boolean;
    emailAlertsEnabled: boolean;
    defaultView: string;
    defaultCategory: string | null;
  }>
) {
  const existing = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    const result = await db
      .update(userPreferences)
      .set(data)
      .where(eq(userPreferences.userId, userId))
      .returning();
    return result[0];
  } else {
    const result = await db
      .insert(userPreferences)
      .values({ userId, ...data })
      .returning();
    return result[0];
  }
}
