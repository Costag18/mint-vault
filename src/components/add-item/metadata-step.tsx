"use client";

import { useState, useEffect } from "react";
import type { SearchResultWithDbId } from "@/lib/actions/search";
import { getCollectionsAction } from "@/lib/actions/collections";
import { getCustomTagsAction, updateCustomTagsAction } from "@/lib/actions/preferences";

type Collection = Awaited<ReturnType<typeof getCollectionsAction>>[number];

export type MetadataFormData = {
  collectionId: string;
  newCollectionName?: string;
  gradingService: string;
  grade: string;
  certNumber: string;
  notes: string;
  tags: string[];
  imageUrl?: string;
  itemName?: string;
  askingPrice?: string;
};

interface MetadataStepProps {
  selectedProduct: SearchResultWithDbId | null;
  onSubmit: (data: MetadataFormData) => void;
  onBack: () => void;
}

const GRADING_SERVICES = ["None", "PSA", "CGC", "BGS", "WATA"];

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
  "Open to Offers",
];

export function MetadataStep({
  selectedProduct,
  onSubmit,
  onBack,
}: MetadataStepProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(true);

  const [collectionId, setCollectionId] = useState("new:");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [gradingService, setGradingService] = useState("None");
  const [grade, setGrade] = useState("");
  const [certNumber, setCertNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newCustomTag, setNewCustomTag] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [itemName, setItemName] = useState("");

  useEffect(() => {
    getCustomTagsAction().then(setCustomTags).catch(() => {});
  }, []);

  function addCustomTag() {
    const t = newCustomTag.trim();
    if (!t || customTags.includes(t) || DEFAULT_TAGS.includes(t)) return;
    const updated = [...customTags, t];
    setCustomTags(updated);
    setNewCustomTag("");
    updateCustomTagsAction(updated);
  }

  function removeCustomTag(tag: string) {
    const updated = customTags.filter((ct) => ct !== tag);
    setCustomTags(updated);
    setSelectedTags((prev) => prev.filter((st) => st !== tag));
    updateCustomTagsAction(updated);
  }

  useEffect(() => {
    getCollectionsAction()
      .then((data) => {
        setCollections(data);
        if (data.length === 0) {
          setCollectionId("new:");
        } else {
          setCollectionId(data[0].id);
        }
      })
      .catch(() => {
        setCollections([]);
        setCollectionId("new:");
      })
      .finally(() => setLoadingCollections(false));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      collectionId,
      newCollectionName: collectionId === "new:" ? newCollectionName : undefined,
      gradingService,
      grade,
      certNumber,
      notes,
      tags: selectedTags,
      imageUrl: imageUrl.trim() || undefined,
      itemName: itemName.trim() || undefined,
      askingPrice: selectedTags.includes("Open to Offers") ? askingPrice.trim() || undefined : undefined,
    });
  }

  const noCollections = !loadingCollections && collections.length === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Selected item summary */}
      {selectedProduct && (
        <div className="bg-surface-container rounded-2xl px-5 py-4 flex items-center gap-4 mb-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            sell
          </span>
          <div className="min-w-0">
            <p className="font-headline font-bold text-on-surface line-clamp-1">
              {selectedProduct.name}
            </p>
            <p className="text-xs text-on-surface-variant uppercase tracking-wide font-label">
              {selectedProduct.category}
            </p>
          </div>
          {selectedProduct.price && (
            <span className="ml-auto font-headline font-bold text-primary shrink-0">
              ${selectedProduct.price}
            </span>
          )}
        </div>
      )}

      {/* Manual entry fields — shown when no product selected */}
      {!selectedProduct && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface font-headline">
              Item Name
            </label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Charizard Base Set Holo"
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface font-headline">
              Photo URL
            </label>
            <p className="text-xs text-on-surface-variant">
              Find an image on{" "}
              <a
                href="https://images.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                Google Images
              </a>{" "}
              or share one from your{" "}
              <a
                href="https://photos.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                Google Photos
              </a>
              , then paste the link here.
            </p>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://photos.google.com/... or any image URL"
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
            />
            {imageUrl && (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-surface-container-highest">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Collection */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-on-surface font-headline">
          Collection
        </label>
        {loadingCollections ? (
          <div className="bg-surface-container rounded-xl px-4 py-3 text-on-surface-variant text-sm animate-pulse">
            Loading collections…
          </div>
        ) : noCollections ? (
          <div className="space-y-2">
            <p className="text-xs text-on-surface-variant">
              You have no collections yet. Enter a name to create one:
            </p>
            <input
              type="text"
              required
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="e.g. Pokémon Cards"
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        ) : (
          <select
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
          >
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
            <option value="new:">+ New Collection</option>
          </select>
        )}

        {!noCollections && collectionId === "new:" && (
          <input
            type="text"
            required
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="New collection name"
            className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
          />
        )}
      </div>

      {/* Grading service */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-on-surface font-headline">
          Grading Service
        </label>
        <div className="flex flex-wrap gap-2">
          {GRADING_SERVICES.map((svc) => (
            <button
              key={svc}
              type="button"
              onClick={() => setGradingService(svc)}
              className={`px-4 py-2 rounded-full text-sm font-headline font-bold transition-colors ${
                gradingService === svc
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {svc}
            </button>
          ))}
        </div>
      </div>

      {/* Grade + Cert number */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-on-surface font-headline">
            Grade
          </label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder={
              gradingService !== "None" ? "e.g. 9.5" : "e.g. NM/MT"
            }
            className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-on-surface font-headline">
            Cert Number
          </label>
          <input
            type="text"
            value={certNumber}
            onChange={(e) => setCertNumber(e.target.value)}
            placeholder="e.g. 12345678"
            className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-on-surface font-headline">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_TAGS.filter((t) => t !== "Open to Offers").map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  setSelectedTags((prev) =>
                    isSelected
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  )
                }
                className={`px-3 py-1.5 rounded-full text-xs font-label font-bold transition-colors ${
                  isSelected
                    ? "bg-tertiary text-on-tertiary"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Tags */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-on-surface font-headline">
          Custom Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {customTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <div key={tag} className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedTags((prev) =>
                      isSelected
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    )
                  }
                  className={`px-3 py-1.5 rounded-l-full text-xs font-label font-bold transition-colors ${
                    isSelected
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {tag}
                </button>
                <button
                  type="button"
                  onClick={() => removeCustomTag(tag)}
                  className="px-1.5 py-1.5 rounded-r-full bg-surface-container text-on-surface-variant hover:bg-error hover:text-on-error transition-colors text-xs"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCustomTag}
            onChange={(e) => setNewCustomTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
            placeholder="Add custom tag..."
            className="flex-1 bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-outline/50"
          />
          <button
            type="button"
            onClick={addCustomTag}
            disabled={!newCustomTag.trim()}
            className="px-3 py-2 rounded-xl bg-primary text-on-primary text-xs font-headline font-bold disabled:opacity-30 transition-opacity"
          >
            Add
          </button>
        </div>
      </div>

      {/* Open to Offers — separated */}
      <div className="space-y-3 pt-2 border-t border-outline-variant/15">
        <label className="block text-sm font-semibold text-on-surface font-headline">
          Selling
        </label>
        <button
          type="button"
          onClick={() =>
            setSelectedTags((prev) =>
              prev.includes("Open to Offers")
                ? prev.filter((t) => t !== "Open to Offers")
                : [...prev, "Open to Offers"]
            )
          }
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-headline font-bold transition-all ${
            selectedTags.includes("Open to Offers")
              ? "bg-primary text-on-primary ring-2 ring-primary/30"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-lg">sell</span>
          Open to Offers
        </button>
        {selectedTags.includes("Open to Offers") && (
          <div className="space-y-2 pl-1">
            <label className="block text-sm font-semibold text-on-surface font-headline">
              Asking Price
            </label>
            <div className="relative max-w-xs">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={askingPrice}
                onChange={(e) => setAskingPrice(e.target.value)}
                placeholder={
                  selectedProduct?.price
                    ? String(selectedProduct.price)
                    : "0.00"
                }
                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl pl-8 pr-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <p className="text-[10px] text-on-surface-variant">
              {selectedProduct?.price
                ? `Defaults to market value ($${selectedProduct.price}) if left empty.`
                : "Leave empty to default to market value."}
            </p>
          </div>
        )}
        <p className="text-[10px] text-on-surface-variant">
          This item will appear on your public &quot;For Sale&quot; page.
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-on-surface font-headline">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Any additional notes about this item…"
          className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-headline font-bold text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-headline font-bold bg-primary text-on-primary hover:brightness-110 transition-all"
        >
          Continue
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </form>
  );
}
