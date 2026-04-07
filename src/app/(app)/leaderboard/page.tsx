import { db } from "@/lib/db";
import { items, pricechartingProducts, userPreferences } from "@/lib/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";

type LeaderboardEntry = {
  userId: string;
  totalValue: number;
  itemCount: number;
};

export default async function LeaderboardPage() {
  // Get all users with public profiles ranked by total collection value
  const results = await db
    .select({
      userId: items.userId,
      totalValue:
        sql<string>`COALESCE(SUM(CAST(${pricechartingProducts.currentPrice} AS NUMERIC)), 0)`.as(
          "total_value"
        ),
      itemCount: sql<number>`COUNT(${items.id})`.as("item_count"),
    })
    .from(items)
    .leftJoin(
      pricechartingProducts,
      eq(items.pricechartingId, pricechartingProducts.id)
    )
    .groupBy(items.userId)
    .orderBy(
      desc(
        sql`COALESCE(SUM(CAST(${pricechartingProducts.currentPrice} AS NUMERIC)), 0)`
      )
    )
    .limit(50);

  // Filter to only public profiles
  const publicUsers = new Set<string>();
  if (results.length > 0) {
    const prefs = await db
      .select({ userId: userPreferences.userId, profilePublic: userPreferences.profilePublic })
      .from(userPreferences);

    const privateUsers = new Set(
      prefs.filter((p) => !p.profilePublic).map((p) => p.userId)
    );

    for (const r of results) {
      if (!privateUsers.has(r.userId)) publicUsers.add(r.userId);
    }
  }

  const leaderboard: LeaderboardEntry[] = results
    .filter((r) => publicUsers.has(r.userId) || publicUsers.size === 0)
    .map((r) => ({
      userId: r.userId,
      totalValue: parseFloat(r.totalValue ?? "0"),
      itemCount: Number(r.itemCount),
    }));

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-2">
          Collector <span className="text-tertiary italic">Leaderboard</span>
        </h1>
        <p className="text-on-surface-variant text-base">
          Top collectors ranked by total collection market value.
        </p>
      </header>

      {leaderboard.length === 0 ? (
        <div className="text-center py-20 text-outline">
          <span className="material-symbols-outlined text-6xl mb-4 block">
            leaderboard
          </span>
          <p>No public collectors yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, i) => (
            <Link
              key={entry.userId}
              href={`/u/${entry.userId}`}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-surface-container-high ${
                i < 3
                  ? "bg-surface-container border border-tertiary/20"
                  : "bg-surface-container-low"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-headline font-bold text-lg shrink-0">
                {i < 3 ? (
                  <span className="text-xl">{medals[i]}</span>
                ) : (
                  <span className="text-on-surface-variant">{i + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-headline font-bold text-on-surface text-sm">
                  Collector #{entry.userId.slice(-6)}
                </p>
                <p className="text-[10px] font-label text-outline uppercase tracking-widest">
                  {entry.itemCount} items
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-headline font-bold text-tertiary text-lg">
                  {formatCurrency(entry.totalValue)}
                </p>
              </div>
              <span className="material-symbols-outlined text-outline text-sm">
                chevron_right
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
