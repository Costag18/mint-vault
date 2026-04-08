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
    // Build update payload — always update price/image when provided,
    // but don't overwrite a good value with null
    const updates: Record<string, unknown> = {
      name: data.name,
      category: data.category,
      lastFetchedAt: new Date(),
    };
    if (data.currentPrice != null) {
      updates.currentPrice = data.currentPrice;
    }
    if (data.imageUrl != null) {
      updates.imageUrl = data.imageUrl;
    }
    if (data.metadata != null) {
      updates.metadata = data.metadata;
    }

    const result = await db
      .update(pricechartingProducts)
      .set(updates)
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
        currentPrice: data.currentPrice ?? null,
        imageUrl: data.imageUrl ?? null,
        metadata: data.metadata ?? null,
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
