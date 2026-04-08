"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/dashboard", icon: "dashboard" },
  { label: "Collection", href: "/collection", icon: "style" },
  { label: "Wishlist", href: "/wishlist", icon: "auto_awesome" },
  { label: "Add", href: "/add-item", icon: "add", isCenter: true },
  { label: "Board", href: "/leaderboard", icon: "leaderboard" },
  { label: "Settings", href: "/settings", icon: "settings" },
  { label: "Tools", href: "/market-insight", icon: "link" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-outline-variant/15">
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map((item) => {
          const isActive =
            !item.isCenter &&
            (pathname === item.href || pathname.startsWith(item.href + "/"));

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl bg-gradient-to-b from-primary-container to-background text-white scale-110"
              >
                <span className="material-symbols-outlined text-[22px]">
                  {item.icon}
                </span>
                <span className="font-label text-[10px] font-bold uppercase tracking-tighter">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-1.5 py-1.5 transition-colors ${
                isActive ? "text-primary" : "text-gray-500"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={
                  isActive
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {item.icon}
              </span>
              <span className="font-label text-[10px] font-bold uppercase tracking-tighter">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
