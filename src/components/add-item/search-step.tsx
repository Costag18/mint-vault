"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { searchPricechartingAction } from "@/lib/actions/search";
import type { PricechartingSearchResult } from "@/lib/scraper/pricecharting";

interface SearchStepProps {
  onSelect: (result: PricechartingSearchResult) => void;
  onManualEntry: () => void;
}

export function SearchStep({ onSelect, onManualEntry }: SearchStepProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PricechartingSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSearch() {
    if (!query || query.length < 2) return;
    setLoading(true);
    setSearched(false);
    try {
      const data = await searchPricechartingAction(query);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  const primary = results[0] ?? null;
  const others = results.slice(1, 8);

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

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-3 text-on-surface-variant py-8">
          <span className="material-symbols-outlined animate-spin text-primary text-2xl">
            progress_activity
          </span>
          <span className="font-body text-sm">Searching PriceCharting…</span>
        </div>
      )}

      {/* Results */}
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

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-12 gap-6">
          {/* Primary result — col-span-7 */}
          {primary && (
            <button
              onClick={() => onSelect(primary)}
              className="col-span-12 md:col-span-7 text-left group relative rounded-2xl overflow-hidden bg-surface-container h-[400px] flex items-center justify-center hover:ring-2 ring-tertiary transition-all duration-300"
            >
              {/* Hero image */}
              {primary.imageUrl ? (
                <Image
                  src={primary.imageUrl}
                  alt={primary.name}
                  fill
                  className="object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 p-8"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
              ) : (
                <span className="material-symbols-outlined text-8xl text-outline">
                  image
                </span>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-80" />
              {/* Top Match badge */}
              <div className="absolute top-4 left-4 z-10 bg-tertiary text-on-tertiary text-[10px] font-black font-label px-3 py-1 rounded uppercase tracking-widest shadow-lg">
                Top Match
              </div>
              {/* Bottom info */}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <p className="font-headline text-2xl font-bold text-white mb-1 line-clamp-2">
                  {primary.name}
                </p>
                <p className="font-label text-sm text-on-surface-variant uppercase tracking-widest">
                  {primary.category}
                </p>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-[10px] font-label text-on-surface-variant uppercase">
                    Market Price
                  </span>
                  <span className="font-headline text-xl font-bold text-tertiary">
                    {primary.price ? `$${primary.price}` : "—"}
                  </span>
                </div>
              </div>
              {/* Hover arrow */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <span className="material-symbols-outlined text-white text-2xl">
                  arrow_forward
                </span>
              </div>
            </button>
          )}

          {/* Right column — col-span-5 */}
          {(others.length > 0 || primary) && (
            <div className="col-span-12 md:col-span-5 flex flex-col gap-3">
              {/* Market Snapshot card */}
              {primary && (
                <div className="bg-surface-container rounded-2xl p-4">
                  <p className="font-label text-xs text-on-surface-variant uppercase tracking-widest mb-3">
                    Market Snapshot
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface-variant">Used Price</span>
                    <span className="font-headline font-bold text-on-surface">
                      {primary.price ? `$${primary.price}` : "N/A"}
                    </span>
                  </div>
                </div>
              )}

              {/* Other results */}
              {others.length > 0 && (
                <div className="bg-surface-container rounded-2xl overflow-hidden">
                  <p className="font-label text-xs text-on-surface-variant uppercase tracking-widest px-4 pt-4 pb-2">
                    Other Results
                  </p>
                  <ul>
                    {others.map((result) => (
                      <li key={result.externalId}>
                        <button
                          onClick={() => onSelect(result)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-high transition-colors text-left"
                        >
                          {/* Thumbnail */}
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
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Manual entry link */}
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
