import { db } from "@/lib/db";
import { wishlistItems, pricechartingProducts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export type WishlistItemWithProduct = {
  wishlistItem: typeof wishlistItems.$inferSelect;
  product: typeof pricechartingProducts.$inferSelect | null;
};

export async function getWishlistByUser(
  userId: string
): Promise<WishlistItemWithProduct[]> {
  const rows = await db
    .select({
      wishlistItem: wishlistItems,
      product: pricechartingProducts,
    })
    .from(wishlistItems)
    .leftJoin(
      pricechartingProducts,
      eq(wishlistItems.pricechartingId, pricechartingProducts.id)
    )
    .where(eq(wishlistItems.userId, userId));

  return rows as WishlistItemWithProduct[];
}

export async function createWishlistItem(data: {
  userId: string;
  name: string;
  pricechartingId?: number | null;
  targetPrice?: string | null;
  alertsEnabled?: boolean;
  notes?: string | null;
}) {
  const result = await db
    .insert(wishlistItems)
    .values({
      userId: data.userId,
      name: data.name,
      pricechartingId: data.pricechartingId ?? undefined,
      targetPrice: data.targetPrice ?? undefined,
      alertsEnabled: data.alertsEnabled ?? false,
      notes: data.notes ?? undefined,
    })
    .returning();
  return result[0];
}

export async function deleteWishlistItem(id: string, userId: string) {
  return db
    .delete(wishlistItems)
    .where(and(eq(wishlistItems.id, id), eq(wishlistItems.userId, userId)));
}

export async function updateWishlistAlerts(
  id: string,
  userId: string,
  enabled: boolean
) {
  return db
    .update(wishlistItems)
    .set({ alertsEnabled: enabled })
    .where(and(eq(wishlistItems.id, id), eq(wishlistItems.userId, userId)));
}
