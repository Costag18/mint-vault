"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/format";

type LeaderboardEntry = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  totalValue: number;
  itemCount: number;
};

const medals = ["🥇", "🥈", "🥉"];

export function LeaderboardList({ entries }: { entries: LeaderboardEntry[] }) {
  const [search, setSearch] = useState("");

  const filtered = entries.filter((entry) => {
    if (!search) return true;
    return entry.displayName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username..."
            className="w-full bg-surface-container border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface placeholder:text-outline/50 outline-none focus:ring-2 focus:ring-primary/30 transition"
          />
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-outline">
          <span className="material-symbols-outlined text-4xl mb-2 block">
            {search ? "search_off" : "leaderboard"}
          </span>
          <p>
            {search
              ? "No collectors match your search."
              : "No collectors have opted in yet. Be the first!"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Show original rank from the full list, not filtered index */}
          {filtered.map((entry) => {
            const originalRank = entries.indexOf(entry);
            return (
              <Link
                key={entry.userId}
                href={`/u/${entry.userId}`}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-surface-container-high ${
                  originalRank < 3
                    ? "bg-surface-container border border-tertiary/20"
                    : "bg-surface-container-low"
                }`}
              >
                <div className="w-8 text-center font-headline font-bold text-lg shrink-0">
                  {originalRank < 3 ? (
                    <span className="text-xl">{medals[originalRank]}</span>
                  ) : (
                    <span className="text-on-surface-variant">
                      {originalRank + 1}
                    </span>
                  )}
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden shrink-0 flex items-center justify-center">
                  {entry.avatarUrl ? (
                    <img
                      src={entry.avatarUrl}
                      alt={entry.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-xl text-outline">
                      person
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-headline font-bold text-on-surface text-sm">
                    {entry.displayName}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
