"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ItemCard } from "@/components/collection/item-card";
import { FilterBar, DEFAULT_TAGS } from "@/components/collection/filter-bar";
import { BulkActionBar } from "@/components/collection/bulk-action-bar";
import { getCustomTagsAction } from "@/lib/actions/preferences";
import {
  bulkDeleteItemsAction,
  bulkMoveItemsAction,
  bulkAddTagAction,
  bulkRemoveTagAction,
  getAllFilteredItemIdsAction,
} from "@/lib/actions/items";
import type { ItemWithProduct } from "@/lib/db/queries/items";

type Collection = { id: string; name: string };

export function CollectionView({
  items,
  totalCount,
  collections,
  page,
  usedTags = [],
}: {
  items: ItemWithProduct[];
  totalCount: number;
  collections: Collection[];
  page: number;
  usedTags?: string[];
}) {
  const [cardScale, setCardScale] = useState(0.7);
  const searchParams = useSearchParams();

  // Select mode state
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [customTags, setCustomTags] = useState<string[]>([]);

  // Fetch custom tags for bulk action dropdowns
  useEffect(() => {
    getCustomTagsAction().then(setCustomTags).catch(() => {});
  }, []);

  // NOTE: no useEffect clearing selection on page change — selections persist across pages

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Select ALL items across all pages matching current filters
  const selectAll = useCallback(() => {
    const params = Object.fromEntries(searchParams.entries());
    const filterOptions = {
      search: params.search,
      grade: params.grade,
      category: params.category,
      collectionId: params.collectionId,
      tags: params.tag ? params.tag.split(",").filter(Boolean) : undefined,
      tagMode: (params.tagMode === "or" ? "or" : "and") as "and" | "or",
    };
    startTransition(async () => {
      const allIds = await getAllFilteredItemIdsAction(filterOptions);
      setSelectedIds(new Set(allIds));
    });
  }, [searchParams, startTransition]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const exitSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelectedIds(new Set());
  }, []);

  // Bulk handlers
  const handleBulkDelete = useCallback(() => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const confirmed = window.confirm(
      `Remove ${ids.length} item${ids.length > 1 ? "s" : ""} from your collection? This cannot be undone.`
    );
    if (!confirmed) return;
    startTransition(async () => {
      await bulkDeleteItemsAction(ids);
      exitSelectMode();
    });
  }, [selectedIds, exitSelectMode]);

  const handleBulkAddTag = useCallback(
    (tag: string) => {
      const ids = Array.from(selectedIds);
      if (ids.length === 0) return;
      startTransition(async () => {
        await bulkAddTagAction(ids, tag);
        setSelectedIds(new Set());
      });
    },
    [selectedIds]
  );

  const handleBulkRemoveTag = useCallback(
    (tag: string) => {
      const ids = Array.from(selectedIds);
      if (ids.length === 0) return;
      startTransition(async () => {
        await bulkRemoveTagAction(ids, tag);
        setSelectedIds(new Set());
      });
    },
    [selectedIds]
  );

  const handleBulkMove = useCallback(
    (collectionId: string) => {
      const ids = Array.from(selectedIds);
      if (ids.length === 0) return;
      startTransition(async () => {
        await bulkMoveItemsAction(ids, collectionId);
        exitSelectMode();
      });
    },
    [selectedIds, exitSelectMode]
  );

  // All available tags for add dropdown
  const availableTags = [
    ...DEFAULT_TAGS,
    ...customTags.filter((t) => !DEFAULT_TAGS.includes(t)),
    "Open to Offers",
  ];

  // Tags actually present on selected items on current page (for remove dropdown)
  const removableTags = (() => {
    if (selectedIds.size === 0) return [];
    const tagSet = new Set<string>();
    for (const data of items) {
      if (selectedIds.has(data.item.id) && Array.isArray(data.item.tags)) {
        for (const tag of data.item.tags as string[]) {
          tagSet.add(tag);
        }
      }
    }
    return [...tagSet].sort();
  })();

  // Pagination range
  const pageSize = 20;
  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = (page - 1) * pageSize + items.length;

  // Build pagination href preserving all current filters
  function paginationHref(targetPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (targetPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(targetPage));
    }
    const qs = params.toString();
    return `/collection${qs ? `?${qs}` : ""}`;
  }

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
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-on-surface tracking-tighter mb-2">
            MINT <span className="text-primary italic">STATE</span>
          </h1>
          <p className="font-body text-base text-on-surface-variant max-w-xl">
            Your high-end digital gallery of graded assets, legendary comics, and
            secret rare gaming cards.
          </p>
        </div>

        {/* Select mode toggle */}
        {items.length > 0 && (
          <button
            onClick={() => {
              if (selectMode) exitSelectMode();
              else setSelectMode(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition shrink-0 ${
              selectMode
                ? "bg-primary text-on-primary"
                : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {selectMode ? "close" : "checklist"}
            </span>
            <span className="hidden sm:inline">
              {selectMode ? "Cancel" : "Select"}
            </span>
          </button>
        )}
      </header>

      <FilterBar
        collections={collections}
        cardScale={cardScale}
        onScaleChange={setCardScale}
        usedTags={usedTags}
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
              <ItemCard
                key={data.item.id}
                {...data}
                scale={cardScale}
                selectMode={selectMode}
                isSelected={selectedIds.has(data.item.id)}
                onToggleSelect={() => toggleSelect(data.item.id)}
              />
            ))}
          </div>
          <div className="mt-12 flex items-center justify-between bg-surface-container-low rounded-2xl p-4">
            <div className="flex items-center gap-3">
              {page > 1 && (
                <Link
                  href={paginationHref(page - 1)}
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
                  href={paginationHref(page + 1)}
                  className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-gray-500"
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </Link>
              )}
            </div>
            <p className="font-label text-xs text-gray-500 uppercase tracking-widest">
              {rangeStart}–{rangeEnd} of {totalCount}
            </p>
          </div>
        </>
      )}

      {/* Bulk action bar */}
      {selectMode && selectedIds.size > 0 && (
        <BulkActionBar
          selectedCount={selectedIds.size}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          onBulkDelete={handleBulkDelete}
          onBulkAddTag={handleBulkAddTag}
          onBulkRemoveTag={handleBulkRemoveTag}
          onBulkMove={handleBulkMove}
          onCancel={exitSelectMode}
          collections={collections}
          availableTags={availableTags}
          removableTags={removableTags}
          isProcessing={isPending}
        />
      )}
    </div>
  );
}
