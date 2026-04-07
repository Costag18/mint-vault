"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { ShareLinks } from "@/components/layout/share-links";
import { getPreferencesAction } from "@/lib/actions/preferences";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Collection", href: "/collection", icon: "style" },
  { label: "Wishlist", href: "/wishlist", icon: "auto_awesome" },
  { label: "Marketplace", href: "/marketplace", icon: "storefront" },
  { label: "Market Insight", href: "/market-insight", icon: "monitoring" },
  { label: "Leaderboard", href: "/leaderboard", icon: "leaderboard" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [displayName, setDisplayName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    getPreferencesAction().then((prefs) => {
      if (prefs?.displayName) setDisplayName(prefs.displayName);
      if (prefs?.avatarUrl) setAvatarUrl(prefs.avatarUrl);
    }).catch(() => {});
  }, []);

  const name = displayName || user?.firstName || "Collector";

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant/15 flex-col z-40 overflow-y-auto">
      {/* Logo */}
      <div className="px-6 pt-6 pb-2">
        <span className="text-xl font-black text-primary font-headline tracking-tighter italic">
          MINT VAULT
        </span>
      </div>

      {/* Profile card */}
      <div className="px-4 pb-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-highest/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden shrink-0 flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-xl text-primary">
                person
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-on-surface truncate">{name}</p>
            <p className="text-[10px] text-primary font-label">Collector</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-headline text-sm font-semibold uppercase tracking-widest ${
                isActive
                  ? "text-primary bg-primary-container/10 border-l-4 border-tertiary"
                  : "text-gray-500 hover:bg-surface-container-highest/50 hover:text-secondary"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 space-y-3 shrink-0">
        <ShareLinks />
        <Link
          href="/add-item"
          className="holographic-gradient flex items-center justify-center gap-2 w-full py-3 rounded-lg font-headline text-xs font-bold uppercase tracking-widest text-on-primary-fixed"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add New Asset
        </Link>
      </div>
    </aside>
  );
}
