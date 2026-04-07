"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  searchPricechartingAction,
  type SearchResultWithDbId,
} from "@/lib/actions/search";
import { formatCurrency } from "@/lib/utils/format";

interface SearchStepProps {
  onSelect: (result: SearchResultWithDbId) => void;
  onManualEntry: () => void;
}

export function SearchStep({ onSelect, onManualEntry }: SearchStepProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultWithDbId[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [preview, setPreview] = useState<SearchResultWithDbId | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSearch() {
    if (!query || query.length < 2) return;
    setLoading(true);
    setSearched(false);
    setPreview(null);
    try {
      const data = await searchPricechartingAction(query);
      setResults(data);
      // Auto-preview the top result
      if (data.length > 0) setPreview(data[0]);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
  }

  const others = results.filter((r) => r.externalId !== preview?.externalId);

  return (
    <div className="space-y-8">
      {/* Search input */}
      <div className="relative max-w-2xl">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px] pointer-events-none">
          search
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by name, set, or series…"
          className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl pl-12 pr-32 py-4 text-base text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30 transition"
        />
        <button
          onClick={handleSearch}
          disabled={loading || query.length < 2}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-on-primary font-headline font-bold text-sm px-5 py-2 rounded-xl disabled:opacity-40 transition hover:brightness-110"
        >
          {loading ? (
            <span className="material-symbols-outlined text-base animate-spin">
              progress_activity
            </span>
          ) : (
            "Search"
          )}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 text-on-surface-variant py-8">
          <span className="material-symbols-outlined animate-spin text-primary text-2xl">
            progress_activity
          </span>
          <span className="font-body text-sm">Searching PriceCharting…</span>
        </div>
      )}

      {/* No results */}
      {!loading && searched && results.length === 0 && (
        <div className="py-12 text-center">
          <span className="material-symbols-outlined text-5xl text-outline mb-3 block">
            search_off
          </span>
          <p className="text-on-surface-variant mb-4">
            No results found. Try a different search.
          </p>
          <button
            onClick={onManualEntry}
            className="text-primary underline text-sm font-headline font-semibold"
          >
            Enter details manually
          </button>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-12 gap-6">
          {/* Preview panel — col-span-7 */}
          <div className="col-span-12 md:col-span-7">
            {preview ? (
              <div className="relative rounded-2xl overflow-hidden bg-surface-container h-[420px] flex flex-col">
                {/* Image area */}
                <div className="relative flex-1">
                  {preview.imageUrl ? (
                    <Image
                      src={preview.imageUrl}
                      alt={preview.name}
                      fill
                      className="object-contain p-6"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-8xl text-outline">
                        image
                      </span>
                    </div>
                  )}
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                  {/* Badge */}
                  {preview === results[0] && (
                    <div className="absolute top-4 left-4 bg-tertiary text-on-tertiary text-[10px] font-black font-label px-3 py-1 rounded uppercase tracking-widest shadow-lg">
                      Top Match
                    </div>
                  )}
                </div>

                {/* Info + Add button */}
                <div className="p-5 flex items-end justify-between gap-4 bg-surface-container">
                  <div className="min-w-0 flex-1">
                    <p className="font-headline text-xl font-bold text-on-surface leading-tight line-clamp-2">
                      {preview.name}
                    </p>
                    <p className="font-label text-xs text-on-surface-variant uppercase tracking-widest mt-1">
                      {preview.category}
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-[10px] font-label text-on-surface-variant uppercase">
                        Market Price
                      </span>
                      <span className="font-headline text-lg font-bold text-tertiary">
                        {preview.price
                          ? formatCurrency(preview.price)
                          : "—"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelect(preview)}
                    className="shrink-0 holographic-gradient text-on-primary-fixed font-headline font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 active:scale-95 transition-transform shadow-lg"
                  >
                    <span className="material-symbols-outlined text-lg">
                      add
                    </span>
                    Add
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-surface-container h-[420px] flex items-center justify-center text-outline">
                <p>Select an item to preview</p>
              </div>
            )}
          </div>

          {/* Right column — col-span-5 */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-3">
            {/* Market snapshot */}
            {preview && (
              <div className="bg-surface-container rounded-2xl p-4">
                <p className="font-label text-xs text-on-surface-variant uppercase tracking-widest mb-3">
                  Market Snapshot
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">
                    Used Price
                  </span>
                  <span className="font-headline font-bold text-on-surface">
                    {preview.price
                      ? formatCurrency(preview.price)
                      : "N/A"}
                  </span>
                </div>
              </div>
            )}

            {/* Results list */}
            <div className="bg-surface-container rounded-2xl overflow-hidden flex-1">
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-widest px-4 pt-4 pb-2">
                Results ({results.length})
              </p>
              <ul className="max-h-[300px] overflow-y-auto">
                {results.map((result) => {
                  const isActive = result.externalId === preview?.externalId;
                  return (
                    <li key={result.externalId}>
                      <button
                        onClick={() => setPreview(result)}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                          isActive
                            ? "bg-primary/10 border-l-2 border-primary"
                            : "hover:bg-surface-container-high border-l-2 border-transparent"
                        }`}
                      >
                        <div className="relative w-8 h-10 shrink-0 rounded overflow-hidden bg-surface-container-highest">
                          {result.imageUrl ? (
                            <Image
                              src={result.imageUrl}
                              alt={result.name}
                              fill
                              className="object-cover"
                              sizes="32px"
                              unoptimized
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="material-symbols-outlined text-xs text-on-surface-variant opacity-40">
                                image
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-on-surface line-clamp-1">
                            {result.name}
                          </p>
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">
                            {result.category}
                          </p>
                        </div>
                        <span className="text-sm font-headline font-bold text-on-surface shrink-0">
                          {result.price ? `$${result.price}` : "—"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Manual entry */}
      {!loading && (
        <div className="pt-2">
          <button
            onClick={onManualEntry}
            className="text-on-surface-variant hover:text-primary text-sm transition-colors font-body underline underline-offset-2"
          >
            Can&apos;t find it? Enter details manually
          </button>
        </div>
      )}
    </div>
  );
}
