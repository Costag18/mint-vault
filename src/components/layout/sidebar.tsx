"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Collection", href: "/collection", icon: "style" },
  { label: "Wishlist", href: "/wishlist", icon: "auto_awesome" },
  { label: "Marketplace", href: "/marketplace", icon: "storefront" },
  { label: "Market Insight", href: "/market-insight", icon: "monitoring" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant/15 flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6">
        <span className="text-xl font-black text-primary font-headline tracking-tighter italic">
          MINT VAULT
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-5 space-y-3">
        <Link
          href="/add-item"
          className="holographic-gradient flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-headline text-sm font-semibold uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add New Asset
        </Link>
        <div className="flex items-center justify-center">
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </aside>
  );
}
