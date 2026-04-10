"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState, useEffect } from "react";
import { getCustomTagsAction } from "@/lib/actions/preferences";
import { getCategoriesAction } from "@/lib/actions/items";

type Collection = { id: string; name: string };

export const DEFAULT_TAGS = [
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

export function FilterBar({
  collections,
  cardScale,
  onScaleChange,
  usedTags: usedTagsProp = [],
}: {
  collections: Collection[];
  cardScale: number;
  onScaleChange: (scale: number) => void;
  usedTags?: string[];
}) {
  const usedTagSet = new Set(usedTagsProp);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    getCustomTagsAction().then(setCustomTags).catch(() => {});
    getCategoriesAction().then(setCategories).catch(() => {});
  }, []);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/collection?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const activeTagParam = searchParams.get("tag") ?? "";
  const activeTags = activeTagParam ? activeTagParam.split(",").filter(Boolean) : [];
  const tagMode = searchParams.get("tagMode") === "or" ? "or" : "and";

  function toggleTagMode() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tagMode", tagMode === "and" ? "or" : "and");
    params.delete("page");
    router.push(`/collection?${params.toString()}`, { scroll: false });
  }

  function toggleTag(tag: string) {
    const params = new URLSearchParams(searchParams.toString());
    let newTags: string[];
    if (activeTags.includes(tag)) {
      newTags = activeTags.filter((t) => t !== tag);
    } else {
      newTags = [...activeTags, tag];
    }
    if (newTags.length > 0) {
      params.set("tag", newTags.join(","));
    } else {
      params.delete("tag");
    }
    params.delete("page");
    router.push(`/collection?${params.toString()}`, { scroll: false });
  }

  function clearTags() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    params.delete("tagMode");
    params.delete("page");
    router.push(`/collection?${params.toString()}`, { scroll: false });
  }

  return (
    <section className="mb-8 space-y-4">
      {/* Main filters row */}
      <div className="bg-surface-container-low rounded-2xl p-4 flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-label text-[10px] uppercase text-gray-500 px-1">
            Collection
          </label>
          <select
            className="bg-surface-container-high border-none text-sm font-body rounded-lg py-2 pl-3 pr-10 focus:ring-1 focus:ring-primary text-on-surface"
            value={searchParams.get("collectionId") ?? "all"}
            onChange={(e) => updateParam("collectionId", e.target.value)}
          >
            <option value="all">All Collections</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-label text-[10px] uppercase text-gray-500 px-1">
            Grade
          </label>
          <select
            className="bg-surface-container-high border-none text-sm font-body rounded-lg py-2 pl-3 pr-10 focus:ring-1 focus:ring-primary text-on-surface"
            value={searchParams.get("grade") ?? "all"}
            onChange={(e) => updateParam("grade", e.target.value)}
          >
            <option value="all">All Grades</option>
            <option value="PSA 10">PSA 10</option>
            <option value="PSA 9">PSA 9</option>
            <option value="BGS 10">BGS 10</option>
            <option value="CGC 9.8">CGC 9.8</option>
          </select>
        </div>
        {categories.length > 0 && (
          <div className="flex flex-col gap-1">
            <label className="font-label text-[10px] uppercase text-gray-500 px-1">
              Category
            </label>
            <select
              className="bg-surface-container-high border-none text-sm font-body rounded-lg py-2 pl-3 pr-10 focus:ring-1 focus:ring-primary text-on-surface"
              value={searchParams.get("category") ?? "all"}
              onChange={(e) => updateParam("category", e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label className="font-label text-[10px] uppercase text-gray-500 px-1">
            Search
          </label>
          <input
            className="bg-surface-container-high border-none text-sm font-body rounded-lg py-2 px-3 focus:ring-1 focus:ring-primary text-on-surface w-40 placeholder:text-outline/50"
            placeholder="Search..."
            defaultValue={searchParams.get("search") ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (searchDebounce.current) clearTimeout(searchDebounce.current);
              searchDebounce.current = setTimeout(() => {
                updateParam("search", value);
              }, 300);
            }}
          />
        </div>
        {/* Sort */}
        <div className="flex flex-col gap-1">
          <label className="font-label text-[10px] uppercase text-gray-500 px-1">
            Sort
          </label>
          <select
            className="bg-surface-container-high border-none text-sm font-body rounded-lg py-2 pl-3 pr-10 focus:ring-1 focus:ring-primary text-on-surface"
            value={searchParams.get("sort") ?? "newest"}
            onChange={(e) => updateParam("sort", e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High → Low</option>
            <option value="price-low">Price: Low → High</option>
            <option value="name-az">Name: A → Z</option>
            <option value="name-za">Name: Z → A</option>
          </select>
        </div>
        {/* Scale slider */}
        <div className="flex flex-col gap-1 ml-auto">
          <label className="font-label text-[10px] uppercase text-gray-500 px-1">
            Size
          </label>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-outline">
              grid_view
            </span>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.1}
              value={cardScale}
              onChange={(e) => onScaleChange(parseFloat(e.target.value))}
              className="w-20 accent-primary"
            />
            <span className="material-symbols-outlined text-sm text-outline">
              view_agenda
            </span>
          </div>
        </div>
      </div>

      {/* Tags row — only show tags that have items, multi-select */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={clearTags}
          className={`px-3 py-1.5 rounded-full text-xs font-label font-bold transition-colors ${
            activeTags.length === 0
              ? "bg-primary text-on-primary"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          All
        </button>
        {DEFAULT_TAGS.filter((tag) => usedTagSet.has(tag)).map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-label font-bold transition-colors ${
              activeTags.includes(tag)
                ? "bg-tertiary text-on-tertiary"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {tag}
          </button>
        ))}
        {customTags.filter((tag) => usedTagSet.has(tag)).length > 0 && (
          <>
            <div className="w-px h-6 bg-outline-variant/30 mx-1" />
            {customTags.filter((tag) => usedTagSet.has(tag)).map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-label font-bold transition-colors ${
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
        {/* Separated selling filter — only show if items are tagged */}
        {usedTagSet.has("Open to Offers") && (
          <>
            <div className="w-px h-6 bg-outline-variant/30 mx-1" />
            <button
              onClick={() => toggleTag("Open to Offers")}
              className={`px-3 py-1.5 rounded-full text-xs font-label font-bold transition-colors flex items-center gap-1.5 ${
                activeTags.includes("Open to Offers")
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined text-xs">sell</span>
              For Sale
            </button>
          </>
        )}
        {/* AND/OR toggle — only visible with 2+ active tags */}
        {activeTags.length >= 2 && (
          <>
            <div className="w-px h-6 bg-outline-variant/30 mx-1" />
            <button
              onClick={toggleTagMode}
              className="flex items-center rounded-full text-[10px] font-label font-bold overflow-hidden border border-outline-variant/30"
            >
              <span
                className={`px-2 py-1 transition-colors ${
                  tagMode === "and"
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                AND
              </span>
              <span
                className={`px-2 py-1 transition-colors ${
                  tagMode === "or"
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                OR
              </span>
            </button>
          </>
        )}
      </div>
    </section>
  );
}
