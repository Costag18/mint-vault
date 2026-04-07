"use client";

import Image from "next/image";
import { formatCurrency } from "@/lib/utils/format";

interface ValuationStepProps {
  itemName: string;
  imageUrl: string | null;
  marketValue: string | null;
  purchasePrice: string;
  onConfirm: () => void;
  onBack: () => void;
  isPending: boolean;
}

export function ValuationStep({
  itemName,
  imageUrl,
  marketValue,
  purchasePrice,
  onConfirm,
  onBack,
  isPending,
}: ValuationStepProps) {
  const marketNum = marketValue ? parseFloat(marketValue) : null;
  const purchaseNum = purchasePrice ? parseFloat(purchasePrice) : null;

  const diff =
    marketNum !== null && purchaseNum !== null
      ? marketNum - purchaseNum
      : null;
  const diffPercent =
    diff !== null && purchaseNum ? (diff / purchaseNum) * 100 : null;

  const isGain = diff !== null && diff >= 0;

  return (
    <div className="max-w-xl space-y-8">
      {/* Item card */}
      <div className="bg-surface-container rounded-2xl overflow-hidden shadow-lg flex gap-6 p-6">
        {/* Image */}
        <div className="relative w-24 h-32 shrink-0 rounded-xl overflow-hidden bg-surface-container-highest">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={itemName}
              fill
              className="object-cover"
              sizes="96px"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant opacity-30">
                image
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <p className="font-headline text-xl font-bold text-on-surface leading-tight line-clamp-3">
            {itemName}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-1">
                Market Value
              </p>
              <p className="font-headline text-lg font-bold text-on-surface">
                {marketValue ? formatCurrency(marketValue) : "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-1">
                You Paid
              </p>
              <p className="font-headline text-lg font-bold text-on-surface">
                {purchasePrice ? formatCurrency(purchasePrice) : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gain / Loss comparison */}
      {diff !== null && (
        <div
          className={`rounded-2xl px-6 py-5 flex items-center gap-4 ${
            isGain
              ? "bg-tertiary/10 border border-tertiary/20"
              : "bg-error/10 border border-error/20"
          }`}
        >
          <span
            className={`material-symbols-outlined text-3xl ${
              isGain ? "text-tertiary" : "text-error"
            }`}
          >
            {isGain ? "trending_up" : "trending_down"}
          </span>
          <div>
            <p
              className={`font-headline text-xl font-bold ${
                isGain ? "text-tertiary" : "text-error"
              }`}
            >
              {isGain ? "+" : ""}
              {formatCurrency(diff)}
              {diffPercent !== null && (
                <span className="text-sm ml-2 font-body font-normal opacity-80">
                  ({isGain ? "+" : ""}
                  {diffPercent.toFixed(1)}%)
                </span>
              )}
            </p>
            <p className="text-sm text-on-surface-variant mt-0.5">
              {isGain
                ? "Above your purchase price"
                : "Below your purchase price"}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-headline font-bold text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-headline font-bold holographic-gradient text-on-primary-fixed hover:brightness-110 transition-all disabled:opacity-60 shadow-lg"
        >
          {isPending ? (
            <>
              <span className="material-symbols-outlined text-base animate-spin">
                progress_activity
              </span>
              Adding to Vault…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">
                verified
              </span>
              Add to Vault
            </>
          )}
        </button>
      </div>
    </div>
  );
}
