"use client";

import { useState, useRef, useEffect, useCallback, useTransition } from "react";
import Image from "next/image";
import {
  searchPricechartingAction,
  fetchProductImageAction,
  lookupPricechartingUrlAction,
  type SearchResultWithDbId,
} from "@/lib/actions/search";
import { createWishlistItemAction } from "@/lib/actions/wishlist";
import { formatCurrency } from "@/lib/utils/format";
import { LazyResultImage } from "@/components/add-item/lazy-result-image";

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [pasteUrl, setPasteUrl] = useState("");
  const [pasteLoading, setPasteLoading] = useState(false);
  const [pasteError, setPasteError] = useState(false);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handlePasteUrl() {
    const url = pasteUrl.trim();
    if (!url) return;
    setPasteLoading(true);
    setPasteError(false);
    try {
      const result = await lookupPricechartingUrlAction(url);
      if (result) {
        setResults([result]);
        setPreview(result);
        setSearched(true);
      } else {
        setPasteError(true);
      }
    } catch {
      setPasteError(true);
    } finally {
      setPasteLoading(false);
    }
  }

  function handleBookmark(result: SearchResultWithDbId) {
    if (bookmarked.has(result.externalId)) return;
    startTransition(async () => {
      await createWishlistItemAction({
        name: result.name,
        pricechartingId: result.dbProductId ?? null,
        targetPrice: result.price ? String(result.price) : null,
      });
      setBookmarked((prev) => new Set(prev).add(result.externalId));
    });
  }

  const doSearch = useCallback(async (q: string) => {
    if (!q || q.length < 2) return;
    setLoading(true);
    setSearched(false);
    setPreview(null);
    try {
      const data = await searchPricechartingAction(q);
      setResults(data);
      if (data.length > 0) setPreview(data[0]);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  // Fetch preview image when selecting a result without one
  useEffect(() => {
    if (!preview) { setPreviewImage(null); return; }
    if (preview.imageUrl) { setPreviewImage(preview.imageUrl); return; }
    setPreviewImage(null);
    fetchProductImageAction(preview.externalId).then((url) => {
      if (url) setPreviewImage(url);
    });
  }, [preview]);

  // Debounced search on every keystroke (800ms delay since we're scraping)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length >= 2) {
      debounceRef.current = setTimeout(() => doSearch(query), 800);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

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
          placeholder="Search by name, set, or series…"
          className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl pl-12 pr-32 py-4 text-base text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30 transition"
        />
        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary animate-spin">
            progress_activity
          </span>
        )}
      </div>

      {/* Paste URL section */}
      <div className="max-w-2xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-outline-variant/20" />
          <span className="text-xs font-label text-outline uppercase tracking-widest">or paste a link</span>
          <div className="h-px flex-1 bg-outline-variant/20" />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={pasteUrl}
            onChange={(e) => { setPasteUrl(e.target.value); setPasteError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handlePasteUrl()}
            placeholder="https://www.pricecharting.com/game/..."
            className="flex-1 bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30 transition"
          />
          <button
            onClick={handlePasteUrl}
            disabled={pasteLoading || !pasteUrl.trim()}
            className="px-5 py-3 rounded-xl bg-primary text-on-primary font-headline font-bold text-sm disabled:opacity-30 transition-opacity flex items-center gap-2"
          >
            {pasteLoading ? (
              <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-lg">link</span>
            )}
            Lookup
          </button>
        </div>
        {pasteError && (
          <p className="text-xs text-error">
            Could not find a product at that URL. Make sure it&apos;s a valid PriceCharting link.
          </p>
        )}
        <p className="text-xs text-on-surface-variant">
          Browse{" "}
          <a
            href="https://www.pricecharting.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            PriceCharting.com
          </a>{" "}
          to find your item, then paste the product URL here.
        </p>
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
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt={preview.name}
                      fill
                      className="object-contain p-6"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {!preview.imageUrl ? (
                        <span className="material-symbols-outlined text-3xl text-primary animate-spin">
                          progress_activity
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-8xl text-outline">
                          image
                        </span>
                      )}
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
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleBookmark(preview)}
                      disabled={bookmarked.has(preview.externalId) || isPending}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                        bookmarked.has(preview.externalId)
                          ? "bg-tertiary text-on-tertiary"
                          : "bg-surface-container-high text-on-surface-variant hover:bg-tertiary/20 hover:text-tertiary"
                      }`}
                      title={bookmarked.has(preview.externalId) ? "Added to wishlist" : "Add to wishlist"}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {bookmarked.has(preview.externalId) ? "bookmark_added" : "bookmark_add"}
                      </span>
                    </button>
                    <button
                      onClick={() => onSelect({ ...preview, imageUrl: previewImage ?? preview.imageUrl ?? null })}
                      className="holographic-gradient text-on-primary-fixed font-headline font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 active:scale-95 transition-transform shadow-lg"
                    >
                      <span className="material-symbols-outlined text-lg">
                        add
                      </span>
                      Add
                    </button>
                  </div>
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
                        <LazyResultImage
                          externalId={result.externalId}
                          initialImageUrl={result.imageUrl}
                          alt={result.name}
                          size={32}
                        />
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
