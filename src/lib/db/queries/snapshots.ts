import { db } from "@/lib/db";
import { priceSnapshots } from "@/lib/db/schema";
import { eq, desc, gte, and } from "drizzle-orm";

export async function addSnapshot(data: {
  productId: number;
  price: string;
  source: string;
}) {
  return db.insert(priceSnapshots).values({
    productId: data.productId,
    price: data.price,
    source: data.source,
  });
}

export async function getSnapshotsByProduct(productId: number, since?: Date) {
  if (since) {
    return db
      .select()
      .from(priceSnapshots)
      .where(
        and(
          eq(priceSnapshots.productId, productId),
          gte(priceSnapshots.recordedAt, since)
        )
      )
      .orderBy(desc(priceSnapshots.recordedAt));
  }

  return db
    .select()
    .from(priceSnapshots)
    .where(eq(priceSnapshots.productId, productId))
    .orderBy(desc(priceSnapshots.recordedAt));
}
