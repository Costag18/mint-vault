import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { items, wishlistItems, pricechartingProducts, priceSnapshots } from "@/lib/db/schema";
import { eq, isNotNull } from "drizzle-orm";
import { getProductDetail } from "@/lib/scraper/pricecharting";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all distinct pricecharting product IDs from items and wishlist
  const itemProductIds = await db
    .selectDistinct({ id: items.pricechartingId })
    .from(items)
    .where(isNotNull(items.pricechartingId));

  const wishlistProductIds = await db
    .selectDistinct({ id: wishlistItems.pricechartingId })
    .from(wishlistItems)
    .where(isNotNull(wishlistItems.pricechartingId));

  const allIds = new Set([
    ...itemProductIds.map((r) => r.id).filter(Boolean),
    ...wishlistProductIds.map((r) => r.id).filter(Boolean),
  ]);

  let updated = 0;
  let errors = 0;

  for (const productId of allIds) {
    try {
      const product = await db
        .select()
        .from(pricechartingProducts)
        .where(eq(pricechartingProducts.id, productId!))
        .limit(1);

      if (!product[0]) continue;

      const detail = await getProductDetail(product[0].externalId);
      if (!detail || !detail.price) continue;

      await db
        .update(pricechartingProducts)
        .set({ currentPrice: detail.price, lastFetchedAt: new Date() })
        .where(eq(pricechartingProducts.id, productId!));

      await db.insert(priceSnapshots).values({
        productId: productId!,
        price: detail.price,
        source: "pricecharting",
      });

      updated++;
      // Rate limit: 1 request per second
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to update product ${productId}:`, error);
      errors++;
    }
  }

  return NextResponse.json({ updated, errors, total: allIds.size });
}
