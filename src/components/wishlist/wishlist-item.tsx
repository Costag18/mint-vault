"use client";

import { useTransition } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format";
import {
  deleteWishlistItemAction,
  toggleWishlistAlertsAction,
} from "@/lib/actions/wishlist";

interface WishlistItemProps {
  item: {
    id: string;
    name: string;
    targetPrice: string | null;
    alertsEnabled: boolean;
  };
  product: {
    currentPrice: string | null;
    imageUrl: string | null;
  } | null;
}

export function WishlistItem({ item, product }: WishlistItemProps) {
  const [isPending, startTransition] = useTransition();

  const targetNum = item.targetPrice ? parseFloat(item.targetPrice) : null;
  const currentNum =
    product?.currentPrice ? parseFloat(product.currentPrice) : null;
  const delta =
    currentNum !== null && targetNum !== null ? currentNum - targetNum : null;
  const isOpportunity = delta !== null && delta < 0;

  function handleToggleAlerts() {
    startTransition(async () => {
      await toggleWishlistAlertsAction(item.id, !item.alertsEnabled);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteWishlistItemAction(item.id);
    });
  }

  return (
    <div
      className={cn(
        "relative flex items-center gap-4 rounded-2xl p-4",
        "bg-surface-container hover:bg-surface-container-high transition-all duration-200",
        "shadow-md overflow-hidden",
        isOpportunity &&
          "ring-2 ring-tertiary shadow-[0_0_18px_2px_rgba(var(--md-sys-color-tertiary-rgb,255,200,0)/0.25)]"
      )}
    >
      {/* Gold opportunity bar */}
      {isOpportunity && (
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-tertiary rounded-r-2xl" />
      )}

      {/* Image / placeholder */}
      <div className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-surface-container-highest">
        {product?.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-on-surface-variant opacity-40">
              image_not_supported
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-headline font-bold text-on-surface leading-tight line-clamp-2">
          {item.name}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
          <span className="text-xs text-on-surface-variant">
            <span className="font-label uppercase tracking-wide opacity-60">
              Target{" "}
            </span>
            <span className="font-semibold text-on-surface">
              {item.targetPrice ? formatCurrency(item.targetPrice) : "—"}
            </span>
          </span>
          <span className="text-xs text-on-surface-variant">
            <span className="font-label uppercase tracking-wide opacity-60">
              Market{" "}
            </span>
            <span className="font-semibold text-on-surface">
              {currentNum !== null ? formatCurrency(currentNum) : "—"}
            </span>
          </span>
          {delta !== null && (
            <span
              className={cn(
                "text-xs font-bold",
                isOpportunity ? "text-tertiary" : "text-error"
              )}
            >
              {isOpportunity ? "" : "+"}
              {formatCurrency(delta)}
              {isOpportunity && (
                <span className="ml-1 text-[10px] font-black uppercase tracking-wider">
                  BUY NOW
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Alert toggle pill */}
        <button
          onClick={handleToggleAlerts}
          disabled={isPending}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black font-label uppercase tracking-wider transition-colors",
            item.alertsEnabled
              ? "bg-primary text-on-primary"
              : "bg-surface-container-highest text-on-surface-variant hover:bg-outline-variant"
          )}
          title={item.alertsEnabled ? "Disable alerts" : "Enable alerts"}
        >
          <span className="material-symbols-outlined text-[14px]">
            {item.alertsEnabled ? "notifications_active" : "notifications_off"}
          </span>
          {item.alertsEnabled ? "On" : "Off"}
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors"
          title="Remove from wishlist"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    </div>
  );
}
