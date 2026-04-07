"use client";

import { useTransition } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format";
import { deleteWishlistItemAction } from "@/lib/actions/wishlist";

interface WishlistItemProps {
  item: {
    id: string;
    name: string;
  };
  product: {
    currentPrice: string | null;
    imageUrl: string | null;
  } | null;
}

export function WishlistItem({ item, product }: WishlistItemProps) {
  const [isPending, startTransition] = useTransition();

  const currentNum =
    product?.currentPrice ? parseFloat(product.currentPrice) : null;

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
        "shadow-md overflow-hidden"
      )}
    >

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

        {currentNum !== null && (
          <p className="text-xs text-on-surface-variant mt-1">
            <span className="font-label uppercase tracking-wide opacity-60">Market </span>
            <span className="font-semibold text-on-surface">{formatCurrency(currentNum)}</span>
            <span className="text-[9px] font-label text-outline ml-1">USD</span>
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
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
