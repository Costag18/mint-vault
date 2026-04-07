import { db } from "@/lib/db";
import { collections } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";

export async function getCollectionsByUser(userId: string) {
  return db
    .select()
    .from(collections)
    .where(eq(collections.userId, userId))
    .orderBy(asc(collections.name));
}

export async function getCollectionById(id: string, userId: string) {
  const result = await db
    .select()
    .from(collections)
    .where(and(eq(collections.id, id), eq(collections.userId, userId)))
    .limit(1);
  return result[0] ?? null;
}

export async function createCollection(
  userId: string,
  data: { name: string; description?: string }
) {
  const result = await db
    .insert(collections)
    .values({ userId, name: data.name, description: data.description })
    .returning();
  return result[0];
}

export async function deleteCollection(id: string, userId: string) {
  return db
    .delete(collections)
    .where(and(eq(collections.id, id), eq(collections.userId, userId)));
}
