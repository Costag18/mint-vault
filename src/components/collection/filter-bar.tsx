"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type Collection = { id: string; name: string };

export function FilterBar({ collections }: { collections: Collection[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  return (
    <section className="mb-8 bg-surface-container-low rounded-2xl p-4 flex flex-wrap items-center gap-6 shadow-sm">
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
          <option value="PSA 10">PSA 10 (Gem Mint)</option>
          <option value="PSA 9">PSA 9 (Mint)</option>
          <option value="BGS 10">BGS 10 (Pristine)</option>
          <option value="CGC 9.8">CGC 9.8</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-label text-[10px] uppercase text-gray-500 px-1">
          Search
        </label>
        <input
          className="bg-surface-container-high border-none text-sm font-body rounded-lg py-2 px-3 focus:ring-1 focus:ring-primary text-on-surface w-48 placeholder:text-outline/50"
          placeholder="Search items..."
          defaultValue={searchParams.get("search") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParam("search", (e.target as HTMLInputElement).value);
            }
          }}
        />
      </div>
      <div className="ml-auto self-end flex gap-2">
        <button className="p-2 bg-surface-container-highest rounded-lg text-primary">
          <span className="material-symbols-outlined">grid_view</span>
        </button>
        <button className="p-2 hover:bg-surface-container-highest rounded-lg text-gray-500">
          <span className="material-symbols-outlined">list</span>
        </button>
      </div>
    </section>
  );
}
