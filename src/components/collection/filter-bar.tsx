"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

type Collection = { id: string; name: string };

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

export function FilterBar({
  collections,
  cardScale,
  onScaleChange,
}: {
  collections: Collection[];
  cardScale: number;
  onScaleChange: (scale: number) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/collection?${params.toString()}`);
    },
    [router, searchParams]
  );

  const activeTag = searchParams.get("tag") ?? "all";

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

      {/* Tags row */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParam("tag", "all")}
          className={`px-3 py-1.5 rounded-full text-xs font-label font-bold transition-colors ${
            activeTag === "all"
              ? "bg-primary text-on-primary"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          All
        </button>
        {DEFAULT_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => updateParam("tag", tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-label font-bold transition-colors ${
              activeTag === tag
                ? "bg-tertiary text-on-tertiary"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}
