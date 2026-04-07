import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { items, pricechartingProducts } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { getItemCountByUser, getTopItemsByValue } from "@/lib/db/queries/items";
import { getRecentActivity } from "@/lib/db/queries/activity";
import { getWishlistByUser } from "@/lib/db/queries/wishlist";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { PremiumRarities } from "@/components/dashboard/premium-rarities";
import { VaultHistory } from "@/components/dashboard/vault-history";
import { PriceWatch } from "@/components/dashboard/price-watch";

async function getTotalValue(userId: string): Promise<number> {
  const result = await db
    .select({
      total: sql<string>`COALESCE(SUM(CAST(${pricechartingProducts.currentPrice} AS NUMERIC)), 0)`,
    })
    .from(items)
    .leftJoin(
      pricechartingProducts,
      eq(items.pricechartingId, pricechartingProducts.id)
    )
    .where(eq(items.userId, userId));

  return parseFloat(result[0]?.total ?? "0");
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const [itemCount, topItems, recentActivity, wishlist, totalValue] =
    await Promise.all([
      getItemCountByUser(userId),
      getTopItemsByValue(userId, 4),
      getRecentActivity(userId, 5),
      getWishlistByUser(userId),
      getTotalValue(userId),
    ]);

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <header>
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-on-surface tracking-tighter">
          VAULT <span className="text-primary italic">HQ</span>
        </h1>
        <p className="font-body text-lg text-on-surface-variant mt-2 max-w-xl">
          Your collection at a glance — values, rarities, and market pulse.
        </p>
      </header>

      {/* Portfolio Summary — spans 2 cols on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PortfolioSummary totalValue={totalValue} itemCount={itemCount} />
      </div>

      {/* Premium Rarities */}
      <PremiumRarities items={topItems} />

      {/* Vault History + Price Watch */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <VaultHistory
            activities={recentActivity.map((a) => ({
              id: a.id,
              type: a.type,
              metadata: a.metadata ?? null,
              createdAt: a.createdAt,
            }))}
          />
        </div>
        <div className="md:col-span-1">
          <PriceWatch items={wishlist} />
        </div>
      </div>
    </div>
  );
}
