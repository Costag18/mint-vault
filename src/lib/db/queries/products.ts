import { db } from "@/lib/db";
import { pricechartingProducts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function upsertProduct(data: {
  externalId: string;
  name: string;
  category: string;
  currentPrice?: string | null;
  imageUrl?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  const existing = await db
    .select()
    .from(pricechartingProducts)
    .where(eq(pricechartingProducts.externalId, data.externalId))
    .limit(1);

  if (existing.length > 0) {
    const result = await db
      .update(pricechartingProducts)
      .set({
        name: data.name,
        category: data.category,
        currentPrice: data.currentPrice ?? undefined,
        imageUrl: data.imageUrl ?? undefined,
        metadata: data.metadata ?? undefined,
        lastFetchedAt: new Date(),
      })
      .where(eq(pricechartingProducts.externalId, data.externalId))
      .returning();
    return result[0];
  } else {
    const result = await db
      .insert(pricechartingProducts)
      .values({
        externalId: data.externalId,
        name: data.name,
        category: data.category,
        currentPrice: data.currentPrice ?? undefined,
        imageUrl: data.imageUrl ?? undefined,
        metadata: data.metadata ?? undefined,
        lastFetchedAt: new Date(),
      })
      .returning();
    return result[0];
  }
}

export async function getProductById(id: number) {
  const result = await db
    .select()
    .from(pricechartingProducts)
    .where(eq(pricechartingProducts.id, id))
    .limit(1);
  return result[0] ?? null;
}
