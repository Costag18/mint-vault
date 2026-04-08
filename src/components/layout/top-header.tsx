"use client";

import { useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ShareLinks } from "@/components/layout/share-links";

export function TopHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showShare, setShowShare] = useState(false);

  function handleSearch(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        router.push(`/collection?search=${encodeURIComponent(value.trim())}`);
      }
    }, 400);
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-outline-variant/15 md:pl-72">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        {/* Mobile: logo */}
        <span className="md:hidden text-lg font-black text-primary font-headline tracking-tighter italic">
          MINT VAULT
        </span>

        {/* Desktop: search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search Vault..."
            className="w-full bg-surface-container border-none rounded-full px-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          {/* Mobile only: leaderboard */}
          <Link
            href="/leaderboard"
            aria-label="Leaderboard"
            className={`md:hidden flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
              pathname === "/leaderboard"
                ? "bg-primary/10 text-primary"
                : "hover:bg-surface-container-highest/50 text-gray-500"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              leaderboard
            </span>
          </Link>

          {/* Mobile only: settings */}
          <Link
            href="/settings"
            aria-label="Settings"
            className={`md:hidden flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
              pathname === "/settings" || pathname.startsWith("/settings/")
                ? "bg-primary/10 text-primary"
                : "hover:bg-surface-container-highest/50 text-gray-500"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              settings
            </span>
          </Link>

          {/* Mobile only: share button */}
          <button
            aria-label="Share"
            onClick={() => setShowShare((s) => !s)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-container-highest/50 transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-[22px]">
              share
            </span>
          </button>

          {/* Mobile only: UserButton */}
          <div className="md:hidden">
            <UserButton />
          </div>
        </div>
      </div>

      {/* Mobile share dropdown */}
      {showShare && (
        <div className="md:hidden px-4 pb-3 border-t border-outline-variant/15 bg-background">
          <div className="pt-3">
            <ShareLinks />
          </div>
        </div>
      )}
    </header>
  );
}
