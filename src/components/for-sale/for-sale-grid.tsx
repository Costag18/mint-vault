"use client";

import { useState } from "react";
import Image from "next/image";
import {
  formatCurrency,
  convertFromUSD,
  CURRENCY_OPTIONS,
  type CurrencyCode,
} from "@/lib/utils/format";

type ForSaleItem = {
  id: string;
  name: string;
  imageUrl: string | null;
  productImageUrl: string | null;
  grade: string | null;
  askingPrice: string | null;
  marketPrice: string | null;
  tags: string[];
  category: string | null;
  collectionId: string;
  collectionName: string | null;
  createdAt: string;
};

type Collection = { id: string; name: string };

type SortOption = "newest" | "oldest" | "price-high" | "price-low" | "name-az" | "name-za";

const DEFAULT_TAGS = [
  "Video Games",
  "Game Accessories",
  "Comics",
  "Action Figures",
  "Trading Cards",
  "Retro Gaming",
  "Sealed/New",
  "Limited Edition",
  "Vinyl/Records",
  "Sports Cards",
  "Manga",
  "Board Games",
];

export function ForSaleGrid({
  items,
  customTags = [],
  collections = [],
}: {
  items: ForSaleItem[];
  customTags?: string[];
  collections?: Collection[];
}) {
  const [currency, setCurrency] = useState<CurrencyCode | "">("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeCollection, setActiveCollection] = useState("all");
  const [activeGrade, setActiveGrade] = useState("all");

  // Only show collections that have items in this list
  const usedCollectionIds = new Set(items.map((item) => item.collectionId));
  const visibleCollections = collections.filter((c) => usedCollectionIds.has(c.id));

  // Collect grades that exist on items
  const usedGrades = [...new Set(items.map((item) => item.grade).filter(Boolean) as string[])].sort();

  // Collect categories that exist on items
  const usedCategories = [...new Set(items.map((item) => item.category).filter(Boolean) as string[])].sort();

  // Collect tags that actually exist on items (exclude "Open to Offers" since all items have it)
  const usedTags = new Set(items.flatMap((item) => item.tags.filter((t) => t !== "Open to Offers")));
  const visibleDefaults = DEFAULT_TAGS.filter((t) => usedTags.has(t));
  const visibleCustom = customTags.filter((t) => usedTags.has(t));

  const filtered = items.filter((item) => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTag !== "all" && !item.tags.includes(activeTag)) return false;
    if (activeGrade !== "all" && item.grade !== activeGrade) return false;
    if (activeCategory !== "all" && item.category !== activeCategory) return false;
    if (activeCollection !== "all" && item.collectionId !== activeCollection) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "price-high": return parseFloat(b.askingPrice ?? b.marketPrice ?? "0") - parseFloat(a.askingPrice ?? a.marketPrice ?? "0");
      case "price-low": return parseFloat(a.askingPrice ?? a.marketPrice ?? "0") - parseFloat(b.askingPrice ?? b.marketPrice ?? "0");
      case "name-az": return a.name.localeCompare(b.name);
      case "name-za": return b.name.localeCompare(a.name);
      default: return 0;
    }
  });

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2 text-sm text-on-surface placeholder:text-outline/50 outline-none focus:ring-2 focus:ring-primary/30 w-full sm:w-48"
        />
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 flex-1 sm:flex-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="name-az">Name: A-Z</option>
            <option value="name-za">Name: Z-A</option>
          </select>
          {visibleCollections.length > 1 && (
            <select
              value={activeCollection}
              onChange={(e) => setActiveCollection(e.target.value)}
              className="bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 flex-1 sm:flex-none"
            >
              <option value="all">All Collections</option>
              {visibleCollections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          {usedGrades.length > 1 && (
            <select
              value={activeGrade}
              onChange={(e) => setActiveGrade(e.target.value)}
              className="bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 flex-1 sm:flex-none"
            >
              <option value="all">All Grades</option>
              {usedGrades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          )}
          {usedCategories.length > 1 && (
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 flex-1 sm:flex-none"
            >
              <option value="all">All Categories</option>
              {usedCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-label text-outline uppercase tracking-widest whitespace-nowrap">
              Convert to
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode | "")}
              className="bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">USD only</option>
              {Object.entries(CURRENCY_OPTIONS).map(([code, { label }]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs text-on-surface-variant font-label whitespace-nowrap ml-auto">
            {sorted.length} items
          </span>
        </div>
      </div>

      {/* Tags */}
      {(visibleDefaults.length > 0 || visibleCustom.length > 0) && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap sm:overflow-visible sm:pb-0">
          <button
            onClick={() => setActiveTag("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-label font-bold transition-colors whitespace-nowrap ${
              activeTag === "all"
                ? "bg-primary text-on-primary"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            All
          </button>
          {visibleDefaults.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-label font-bold transition-colors whitespace-nowrap ${
                activeTag === tag
                  ? "bg-tertiary text-on-tertiary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {tag}
            </button>
          ))}
          {visibleCustom.length > 0 && (
            <>
              <div className="w-px h-6 bg-outline-variant/30 mx-1" />
              {visibleCustom.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-label font-bold transition-colors whitespace-nowrap ${
                    activeTag === tag
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-outline">
          <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
          <p>No items match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
          {sorted.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container rounded-xl overflow-hidden border border-tertiary/20"
            >
              <div
                className="relative w-full"
                style={{ paddingBottom: "133.33%" }}
              >
                {item.imageUrl || item.productImageUrl ? (
                  <Image
                    src={item.imageUrl ?? item.productImageUrl ?? ""}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 20vw"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-surface-container-highest">
                    <span className="material-symbols-outlined text-2xl text-outline">
                      image
                    </span>
                  </div>
                )}
                {item.grade && (
                  <div className="absolute top-1.5 right-1.5 bg-tertiary text-on-tertiary text-[8px] font-black font-label px-2 py-0.5 rounded-full shadow rotate-[6deg]">
                    {item.grade}
                  </div>
                )}
                <div className="absolute bottom-1.5 left-1.5 bg-primary text-on-primary text-[8px] font-black font-label px-2 py-0.5 rounded-full shadow">
                  OPEN TO OFFERS
                </div>
              </div>
              <div className="p-2 space-y-1">
                <p className="text-xs font-headline font-bold line-clamp-2">
                  {item.name}
                </p>
                {item.askingPrice && (
                  <div>
                    <p className="text-sm font-bold text-primary">
                      {formatCurrency(item.askingPrice)}{" "}
                      <span className="text-[9px] font-label text-outline font-normal">
                        USD
                      </span>
                    </p>
                    {currency && (
                      <p className="text-[10px] text-on-surface-variant">
                        {convertFromUSD(item.askingPrice, currency)} {currency}
                      </p>
                    )}
                  </div>
                )}
                {item.marketPrice && (
                  <div>
                    <p className="text-[10px] font-label text-outline uppercase tracking-widest">
                      Market
                    </p>
                    <p className="text-xs font-bold text-tertiary">
                      {formatCurrency(item.marketPrice)}{" "}
                      <span className="text-[9px] font-label text-outline font-normal">
                        USD
                      </span>
                    </p>
                    {currency && (
                      <p className="text-[10px] text-on-surface-variant">
                        {convertFromUSD(item.marketPrice, currency)} {currency}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
