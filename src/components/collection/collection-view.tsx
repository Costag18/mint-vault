"use client";

import { useState } from "react";
import Link from "next/link";
import { ItemCard } from "@/components/collection/item-card";
import { FilterBar } from "@/components/collection/filter-bar";
import type { ItemWithProduct } from "@/lib/db/queries/items";

type Collection = { id: string; name: string };

export function CollectionView({
  items,
  totalCount,
  collections,
  page,
}: {
  items: ItemWithProduct[];
  totalCount: number;
  collections: Collection[];
  page: number;
}) {
  const [cardScale, setCardScale] = useState(0.7);

  // Map scale to grid columns: lower scale = more columns
  const gridClass =
    cardScale <= 0.6
      ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      : cardScale <= 0.8
        ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        : cardScale <= 1.0
          ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3";

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-on-surface tracking-tighter mb-2">
          MINT <span className="text-primary italic">STATE</span>
        </h1>
        <p className="font-body text-base text-on-surface-variant max-w-xl">
          Your high-end digital gallery of graded assets, legendary comics, and
          secret rare gaming cards.
        </p>
      </header>

      <FilterBar
        collections={collections}
        cardScale={cardScale}
        onScaleChange={setCardScale}
      />

      {items.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">
            style
          </span>
          <h3 className="font-headline text-xl font-bold mb-2">
            No items yet
          </h3>
          <p className="text-on-surface-variant mb-6">
            Start building your collection by adding your first asset.
          </p>
          <Link
            href="/add-item"
            className="inline-flex items-center gap-2 holographic-gradient text-on-primary-fixed font-headline font-bold py-3 px-6 rounded-lg"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add First Asset
          </Link>
        </div>
      ) : (
        <>
          <div className={`grid ${gridClass} gap-4`}>
            {items.map((data) => (
              <ItemCard key={data.item.id} {...data} scale={cardScale} />
            ))}
          </div>
          <div className="mt-12 flex items-center justify-between bg-surface-container-low rounded-2xl p-4">
            <div className="flex items-center gap-3">
              {page > 1 && (
                <Link
                  href={`/collection?page=${page - 1}`}
                  className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-gray-500"
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_left
                  </span>
                </Link>
              )}
              <span className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary text-sm">
                {page}
              </span>
              {items.length === 20 && (
                <Link
                  href={`/collection?page=${page + 1}`}
                  className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-gray-500"
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </Link>
              )}
            </div>
            <p className="font-label text-xs text-gray-500 uppercase tracking-widest">
              {items.length} of {totalCount}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
