"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export function TopHeader() {
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        <div className="flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-container-highest/50 transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-[22px]">
              notifications
            </span>
          </button>

          {/* Mobile only: UserButton */}
          <div className="md:hidden">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
