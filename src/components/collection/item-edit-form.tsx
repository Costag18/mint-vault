"use client";

import { useState, useTransition } from "react";
import { updateItemDetailsAction } from "@/lib/actions/items";

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
    purchasePrice: string | null;
    purchaseDate: string | null;
    notes: string | null;
    tags: string[] | null;
    quantity: number;
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
  const [purchasePrice, setPurchasePrice] = useState(
    initialData.purchasePrice ?? ""
  );
  const [purchaseDate, setPurchaseDate] = useState(
    initialData.purchaseDate ?? ""
  );
  const [notes, setNotes] = useState(initialData.notes ?? "");
  const [tags, setTags] = useState<string[]>(initialData.tags ?? []);
  const [quantity, setQuantity] = useState(initialData.quantity);

  function handleSave() {
    startTransition(async () => {
      await updateItemDetailsAction(itemId, {
        name,
        variant: variant || undefined,
        grade: grade || undefined,
        gradingService: gradingService || undefined,
        certNumber: certNumber || undefined,
        purchasePrice: purchasePrice || undefined,
        purchaseDate: purchaseDate || undefined,
        notes: notes || undefined,
        tags,
        quantity,
      });
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

      {/* Purchase row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-label text-outline uppercase tracking-widest">
            Purchase Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              $
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="0.00"
              className="w-full bg-surface-container-high border-none rounded-xl pl-7 pr-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-label text-outline uppercase tracking-widest">
            Purchase Date
          </label>
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
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
          {DEFAULT_TAGS.map((tag) => {
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
    </div>
  );
}
