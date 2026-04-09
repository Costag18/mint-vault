"use client";

import { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils/format";
import { ItemDetailModal } from "@/components/public/item-detail-modal";

type PublicItem = {
  id: string;
  name: string;
  imageUrl: string | null;
  productImageUrl: string | null;
  grade: string | null;
  gradingService: string | null;
  certNumber: string | null;
  notes: string | null;
  askingPrice: string | null;
  price: number;
  quantity: number;
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

export function PublicCollectionGrid({
  items,
  customTags = [],
  collections = [],
}: {
  items: PublicItem[];
  customTags?: string[];
  collections?: Collection[];
}) {
  const [sort, setSort] = useState<SortOption>("newest");
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeCollection, setActiveCollection] = useState("all");
  const [activeGrade, setActiveGrade] = useState("all");
  const [cardScale, setCardScale] = useState(0.7);
  const [selectedItem, setSelectedItem] = useState<PublicItem | null>(null);

  const usedGrades = [...new Set(items.map((item) => item.grade).filter(Boolean) as string[])].sort();
  const usedCategories = [...new Set(items.map((item) => item.category).filter(Boolean) as string[])].sort();
  const usedTags = new Set(items.flatMap((item) => item.tags));
  const visibleDefaults = DEFAULT_TAGS.filter((t) => usedTags.has(t));
  const visibleCustom = customTags.filter((t) => usedTags.has(t));

  const filtered = items.filter((item) => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTags.length > 0 && !activeTags.every((t) => item.tags.includes(t))) return false;
    if (activeGrade !== "all" && item.grade !== activeGrade) return false;
    if (activeCategory !== "all" && item.category !== activeCategory) return false;
    if (activeCollection !== "all" && item.collectionId !== activeCollection) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "price-high": return b.price - a.price;
      case "price-low": return a.price - b.price;
      case "name-az": return a.name.localeCompare(b.name);
      case "name-za": return b.name.localeCompare(a.name);
      default: return 0;
    }
  });

  const gridClass =
    cardScale <= 0.6
      ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      : cardScale <= 0.8
        ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        : cardScale <= 1.0
          ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3";

  return (
    <div>
      {/* Filter bar */}
      <div className="bg-surface-container-low rounded-2xl p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-surface-container-high border-none text-sm font-body rounded-lg py-2 px-3 focus:ring-1 focus:ring-primary text-on-surface w-full sm:w-40 placeholder:text-outline/50"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-surface-container-high border-none text-sm font-body rounded-lg py-2 pl-3 pr-10 focus:ring-1 focus:ring-primary text-on-surface"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="name-az">Name: A-Z</option>
            <option value="name-za">Name: Z-A</option>
          </select>
          {collections.length > 1 && (
            <select
              value={activeCollection}
              onChange={(e) => setActiveCollection(e.target.value)}
              className="bg-surface-container-high border-none text-sm font-body rounded-lg py-2 pl-3 pr-10 focus:ring-1 focus:ring-primary text-on-surface"
            >
              <option value="all">All Collections</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
          {usedGrades.length > 1 && (
            <select
              value={activeGrade}
              onChange={(e) => setActiveGrade(e.target.value)}
              className="bg-surface-container-high border-none text-sm font-body rounded-lg py-2 pl-3 pr-10 focus:ring-1 focus:ring-primary text-on-surface"
            >
              <option value="all">All Grades</option>
              {usedGrades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          )}
          {usedCategories.length > 1 && (
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="bg-surface-container-high border-none text-sm font-body rounded-lg py-2 pl-3 pr-10 focus:ring-1 focus:ring-primary text-on-surface"
            >
              <option value="all">All Categories</option>
              {usedCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
          {/* Size slider */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="font-label text-[10px] uppercase text-gray-500">Size</span>
            <span className="material-symbols-outlined text-sm text-outline">grid_view</span>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.1}
              value={cardScale}
              onChange={(e) => setCardScale(parseFloat(e.target.value))}
              className="w-20 accent-primary"
            />
            <span className="material-symbols-outlined text-sm text-outline">view_agenda</span>
          </div>
          <span className="text-xs text-on-surface-variant font-label whitespace-nowrap">
            {sorted.length} items
          </span>
        </div>
      </div>

      {/* Tags */}
      {(visibleDefaults.length > 0 || visibleCustom.length > 0) && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap sm:overflow-visible sm:pb-0">
          <button
            onClick={() => setActiveTags([])}
            className={`px-3 py-1.5 rounded-full text-xs font-label font-bold transition-colors whitespace-nowrap ${
              activeTags.length === 0
                ? "bg-primary text-on-primary"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            All
          </button>
          {visibleDefaults.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])}
              className={`px-3 py-1.5 rounded-full text-xs font-label font-bold transition-colors whitespace-nowrap ${
                activeTags.includes(tag)
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
                  onClick={() => setActiveTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])}
                  className={`px-3 py-1.5 rounded-full text-xs font-label font-bold transition-colors whitespace-nowrap ${
                    activeTags.includes(tag)
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
        <div className={`grid ${gridClass} gap-2 sm:gap-4`}>
          {sorted.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-surface-container rounded-xl overflow-hidden text-left hover:ring-2 hover:ring-primary/30 transition-all"
            >
              <div className="relative w-full" style={{ paddingBottom: "133.33%" }}>
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
                    <span className="material-symbols-outlined text-2xl text-outline">image</span>
                  </div>
                )}
                {item.grade && (
                  <div className="absolute top-1.5 right-1.5 bg-tertiary text-on-tertiary text-[8px] font-black font-label px-2 py-0.5 rounded-full shadow rotate-[6deg]">
                    {item.grade}
                  </div>
                )}
                {item.tags.includes("Open to Offers") && (
                  <div className="absolute bottom-1.5 left-1.5 bg-primary text-on-primary text-[8px] font-black font-label px-2 py-0.5 rounded-full shadow">
                    FOR SALE
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-headline font-bold line-clamp-2">{item.name}</p>
                <div className="flex items-center justify-between gap-1 mt-0.5">
                  {item.price > 0 ? (
                    <p className="text-xs font-bold text-tertiary">
                      {formatCurrency(item.price)} <span className="text-[9px] font-label text-outline font-normal">USD</span>
                    </p>
                  ) : <span />}
                  {item.quantity > 1 && (
                    <span className="text-[9px] font-label font-bold text-tertiary shrink-0">
                      QTY: {item.quantity}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Item detail modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
