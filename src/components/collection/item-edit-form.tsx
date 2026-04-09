"use client";

import { useState, useTransition, useEffect } from "react";
import {
  updateItemDetailsAction,
  updateCustomProductPriceAction,
} from "@/lib/actions/items";
import { getCustomTagsAction, updateCustomTagsAction } from "@/lib/actions/preferences";

const GRADING_SERVICES = ["", "PSA", "CGC", "BGS", "WATA"];

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

type Props = {
  itemId: string;
  initialData: {
    name: string;
    variant: string | null;
    grade: string | null;
    gradingService: string | null;
    certNumber: string | null;
    notes: string | null;
    tags: string[] | null;
    quantity: number;
    askingPrice: string | null;
    marketPrice: string | null;
    productId: number | null;
  };
};

export function ItemEditForm({ itemId, initialData }: Props) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(initialData.name);
  const [variant, setVariant] = useState(initialData.variant ?? "");
  const [grade, setGrade] = useState(initialData.grade ?? "");
  const [gradingService, setGradingService] = useState(
    initialData.gradingService ?? ""
  );
  const [certNumber, setCertNumber] = useState(initialData.certNumber ?? "");
  const [notes, setNotes] = useState(initialData.notes ?? "");
  const [tags, setTags] = useState<string[]>(initialData.tags ?? []);
  const [quantity, setQuantity] = useState(initialData.quantity);
  const [askingPrice, setAskingPrice] = useState(initialData.askingPrice ?? "");
  const [marketPrice, setMarketPrice] = useState(initialData.marketPrice ?? "");
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newCustomTag, setNewCustomTag] = useState("");

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
    const updated = customTags.filter((t) => t !== tag);
    setCustomTags(updated);
    setTags((prev) => prev.filter((t) => t !== tag));
    updateCustomTagsAction(updated);
  }

  function handleSave() {
    startTransition(async () => {
      await updateItemDetailsAction(itemId, {
        name,
        variant: variant || null,
        grade: grade || null,
        gradingService: gradingService || null,
        certNumber: certNumber || null,
        notes: notes || null,
        tags,
        quantity,
        askingPrice: tags.includes("Open to Offers") && askingPrice ? askingPrice : null,
      });

      // Update custom product market price if applicable
      if (initialData.productId && marketPrice) {
        await updateCustomProductPriceAction(initialData.productId, marketPrice);
      }

      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant font-headline font-bold text-xs uppercase tracking-widest hover:bg-surface-container-high transition-all active:scale-95"
      >
        <span className="material-symbols-outlined text-lg">edit</span>
        {saved ? "Saved!" : "Edit Details"}
      </button>
    );
  }

  return (
    <div className="rounded-3xl bg-surface-container p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-label font-medium text-outline uppercase tracking-widest">
          Edit Details
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(false)}
            className="px-4 py-2 rounded-lg text-xs font-headline font-bold text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-4 py-2 rounded-lg text-xs font-headline font-bold bg-primary text-on-primary hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-1">
        <label className="text-[10px] font-label text-outline uppercase tracking-widest">
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Variant */}
      <div className="space-y-1">
        <label className="text-[10px] font-label text-outline uppercase tracking-widest">
          Variant
        </label>
        <input
          value={variant}
          onChange={(e) => setVariant(e.target.value)}
          placeholder="e.g. 1st Edition Shadowless"
          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50"
        />
      </div>

      {/* Grade row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-label text-outline uppercase tracking-widest">
            Grading Service
          </label>
          <select
            value={gradingService}
            onChange={(e) => setGradingService(e.target.value)}
            className="w-full bg-surface-container-high border-none rounded-xl px-3 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
          >
            <option value="">None</option>
            {GRADING_SERVICES.filter(Boolean).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-label text-outline uppercase tracking-widest">
            Grade
          </label>
          <input
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="e.g. 10"
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-label text-outline uppercase tracking-widest">
            Cert #
          </label>
          <input
            value={certNumber}
            onChange={(e) => setCertNumber(e.target.value)}
            placeholder="e.g. 42880192"
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50"
          />
        </div>
      </div>

      {/* Quantity */}
      <div className="space-y-1">
        <label className="text-[10px] font-label text-outline uppercase tracking-widest">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-lg">remove</span>
          </button>
          <span className="font-headline font-bold text-lg w-8 text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
          </button>
        </div>
      </div>

      {/* Market Price — only for custom products */}
      {initialData.productId && (
        <div className="space-y-1">
          <label className="text-[10px] font-label text-outline uppercase tracking-widest">
            Market Price (USD)
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              $
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={marketPrice}
              onChange={(e) => setMarketPrice(e.target.value)}
              placeholder="0.00"
              className="w-full bg-surface-container-high border-none rounded-xl pl-7 pr-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50"
            />
          </div>
          <p className="text-[10px] text-on-surface-variant">
            Update the market value for this custom item.
          </p>
        </div>
      )}

      {/* Notes */}
      <div className="space-y-1">
        <label className="text-[10px] font-label text-outline uppercase tracking-widest">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Tell the story of this piece..."
          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary resize-none placeholder:text-outline/50"
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-[10px] font-label text-outline uppercase tracking-widest">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_TAGS.filter((t) => t !== "Open to Offers").map((tag) => {
            const isSelected = tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  setTags((prev) =>
                    isSelected
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  )
                }
                className={`px-3 py-1.5 rounded-full text-xs font-label font-bold transition-colors ${
                  isSelected
                    ? "bg-tertiary text-on-tertiary"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
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
        <label className="text-[10px] font-label text-outline uppercase tracking-widest">
          Custom Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {customTags.map((tag) => {
            const isSelected = tags.includes(tag);
            return (
              <div key={tag} className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() =>
                    setTags((prev) =>
                      isSelected
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    )
                  }
                  className={`px-3 py-1.5 rounded-l-full text-xs font-label font-bold transition-colors ${
                    isSelected
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
                >
                  {tag}
                </button>
                <button
                  type="button"
                  onClick={() => removeCustomTag(tag)}
                  className="px-1.5 py-1.5 rounded-r-full bg-surface-container-high text-on-surface-variant hover:bg-error hover:text-on-error transition-colors text-xs"
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
            className="flex-1 bg-surface-container-high border-none rounded-xl px-4 py-2 text-xs text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50"
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

      {/* Open to Offers */}
      <div className="space-y-2 pt-2 border-t border-outline-variant/15">
        <label className="text-[10px] font-label text-outline uppercase tracking-widest">
          Selling
        </label>
        <button
          type="button"
          onClick={() =>
            setTags((prev) =>
              prev.includes("Open to Offers")
                ? prev.filter((t) => t !== "Open to Offers")
                : [...prev, "Open to Offers"]
            )
          }
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-headline font-bold transition-all ${
            tags.includes("Open to Offers")
              ? "bg-primary text-on-primary ring-2 ring-primary/30"
              : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
          }`}
        >
          <span className="material-symbols-outlined text-lg">sell</span>
          Open to Offers
        </button>
        {tags.includes("Open to Offers") && (
          <div className="space-y-1 mt-3">
            <label className="text-[10px] font-label text-outline uppercase tracking-widest">
              Asking Price (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={askingPrice}
                onChange={(e) => setAskingPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-surface-container-high border-none rounded-xl pl-7 pr-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50"
              />
            </div>
          </div>
        )}
        <p className="text-[10px] text-on-surface-variant">
          Mark this item as available. It will appear on your public &quot;For Sale&quot; page.
        </p>
      </div>
    </div>
  );
}
