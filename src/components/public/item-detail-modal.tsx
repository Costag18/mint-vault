"use client";

import Image from "next/image";
import { formatCurrency } from "@/lib/utils/format";

type ItemDetail = {
  id: string;
  name: string;
  imageUrl: string | null;
  productImageUrl: string | null;
  grade: string | null;
  gradingService: string | null;
  certNumber: string | null;
  notes: string | null;
  tags: string[];
  category: string | null;
  collectionName: string | null;
  askingPrice?: string | null;
  marketPrice?: string | null;
  price?: number;
};

export function ItemDetailModal({
  item,
  onClose,
}: {
  item: ItemDetail;
  onClose: () => void;
}) {
  const imageUrl = item.imageUrl ?? item.productImageUrl;
  const isForSale = item.tags.includes("Open to Offers");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-surface-container-low rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-surface-container-highest/80 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Image */}
        {imageUrl && (
          <div className="relative w-full aspect-square bg-surface-container rounded-t-3xl overflow-hidden">
            <Image
              src={imageUrl}
              alt={item.name}
              fill
              className="object-contain p-6"
              sizes="(max-width: 512px) 100vw, 512px"
              unoptimized
            />
            {item.grade && (
              <div className="absolute top-3 right-3 bg-tertiary text-on-tertiary text-xs font-black font-label px-3 py-1 rounded-full shadow">
                {item.gradingService ? `${item.gradingService} ` : ""}
                {item.grade}
              </div>
            )}
            {isForSale && (
              <div className="absolute bottom-3 left-3 bg-primary text-on-primary text-xs font-black font-label px-3 py-1 rounded-full shadow">
                OPEN TO OFFERS
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Name */}
          <h2 className="font-headline text-2xl font-bold text-on-surface leading-tight">
            {item.name}
          </h2>

          {/* Price info */}
          <div className="flex flex-wrap gap-3">
            {item.askingPrice && (
              <div className="rounded-xl bg-primary/10 px-4 py-2">
                <p className="text-[10px] font-label text-primary uppercase tracking-widest">
                  Asking Price
                </p>
                <p className="text-lg font-headline font-bold text-primary">
                  {formatCurrency(item.askingPrice)}
                </p>
              </div>
            )}
            {(item.marketPrice || (item.price && item.price > 0)) && (
              <div className="rounded-xl bg-tertiary/10 px-4 py-2">
                <p className="text-[10px] font-label text-tertiary uppercase tracking-widest">
                  Market Value
                </p>
                <p className="text-lg font-headline font-bold text-tertiary">
                  {formatCurrency(item.marketPrice ?? item.price ?? 0)}
                </p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="rounded-2xl bg-surface-container p-4 space-y-2.5">
            {item.gradingService && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-outline">Grading Service</span>
                <span className="text-xs text-on-surface font-medium">
                  {item.gradingService}
                </span>
              </div>
            )}
            {item.grade && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-outline">Grade</span>
                <span className="text-xs text-on-surface font-medium">
                  {item.grade}
                </span>
              </div>
            )}
            {item.certNumber && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-outline">Cert Number</span>
                <span className="text-xs text-on-surface font-medium">
                  #{item.certNumber}
                </span>
              </div>
            )}
            {item.category && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-outline">Category</span>
                <span className="text-xs text-on-surface font-medium">
                  {item.category}
                </span>
              </div>
            )}
            {item.collectionName && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-outline">Collection</span>
                <span className="text-xs text-on-surface font-medium">
                  {item.collectionName}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-label font-bold ${
                    tag === "Open to Offers"
                      ? "bg-primary/15 text-primary"
                      : "bg-tertiary/10 text-tertiary"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="rounded-2xl bg-surface-container p-4">
              <p className="text-[10px] font-label text-outline uppercase tracking-widest mb-2">
                Notes
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {item.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
