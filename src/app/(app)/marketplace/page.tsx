"use client";

import { useState } from "react";

export default function MarketplacePage() {
  const [search, setSearch] = useState("");

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="font-headline text-5xl font-extrabold text-on-surface tracking-tighter mb-2">
          MARKETPLACE
        </h1>
        <p className="text-on-surface-variant font-body">
          Find listings and compare prices across the market.
        </p>
      </header>

      {/* Search */}
      <div className="relative mb-12">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[22px]">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a card, comic, or game…"
          className="w-full bg-surface-container rounded-2xl pl-12 pr-5 py-4 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary text-lg font-body transition-shadow"
        />
      </div>

      {/* Placeholder content */}
      <div className="text-center py-24 bg-surface-container rounded-2xl">
        <span className="material-symbols-outlined text-7xl text-outline mb-5 block">
          storefront
        </span>
        <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
          Search above to find listings
        </h3>
        <p className="text-on-surface-variant font-body">
          eBay integration coming soon
        </p>
      </div>
    </div>
  );
}
