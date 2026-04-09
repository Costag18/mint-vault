import { db } from "@/lib/db";
import { items, pricechartingProducts, userPreferences } from "@/lib/db/schema";
import { eq, sql, desc, and, inArray } from "drizzle-orm";
import { LeaderboardList } from "@/components/leaderboard/leaderboard-list";

export const dynamic = "force-dynamic";

type LeaderboardEntry = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  totalValue: number;
  itemCount: number;
};

export default async function LeaderboardPage() {
  // First get users who opted in to the leaderboard
  const optedInUsers = await db
    .select({
      userId: userPreferences.userId,
      displayName: userPreferences.displayName,
      avatarUrl: userPreferences.avatarUrl,
    })
    .from(userPreferences)
    .where(
      and(
        eq(userPreferences.leaderboardOptIn, true),
        eq(userPreferences.profilePublic, true)
      )
    );

  let leaderboard: LeaderboardEntry[] = [];

  if (optedInUsers.length > 0) {
    const optedInIds = optedInUsers.map((u) => u.userId);
    const prefsMap = new Map(optedInUsers.map((u) => [u.userId, u]));

    // Get collection stats only for opted-in users
    const results = await db
      .select({
        userId: items.userId,
        totalValue:
          sql<string>`COALESCE(SUM(CAST(${pricechartingProducts.currentPrice} AS NUMERIC) * ${items.quantity}), 0)`.as(
            "total_value"
          ),
        itemCount: sql<number>`COALESCE(SUM(${items.quantity}), 0)`.as("item_count"),
      })
      .from(items)
      .leftJoin(
        pricechartingProducts,
        eq(items.pricechartingId, pricechartingProducts.id)
      )
      .where(inArray(items.userId, optedInIds))
      .groupBy(items.userId)
      .limit(50);

    const statsMap = new Map(results.map((r) => [r.userId, r]));

    // Include all opted-in users, even those with 0 items
    leaderboard = optedInUsers
      .map((u) => {
        const stats = statsMap.get(u.userId);
        return {
          userId: u.userId,
          displayName:
            u.displayName ?? `Collector #${u.userId.slice(-6).toUpperCase()}`,
          avatarUrl: u.avatarUrl ?? null,
          totalValue: parseFloat(stats?.totalValue ?? "0"),
          itemCount: Number(stats?.itemCount ?? 0),
        };
      })
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 50);
  }

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-2">
          Collector <span className="text-tertiary italic">Leaderboard</span>
        </h1>
        <p className="text-on-surface-variant text-base">
          Top collectors ranked by total collection market value.
        </p>
        <p className="text-on-surface-variant text-xs mt-1">
          <span className="material-symbols-outlined text-xs align-middle mr-0.5">
            info
          </span>
          Only collectors who have opted in are shown.{" "}
          <a href="/settings" className="text-primary hover:underline">
            Manage your visibility in Settings.
          </a>
        </p>
      </header>

      <LeaderboardList entries={leaderboard} />
    </div>
  );
}
