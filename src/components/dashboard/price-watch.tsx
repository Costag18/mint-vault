import { formatCurrency } from "@/lib/utils/format";

interface PriceWatchItem {
  wishlistItem: { id: string; name: string };
  product: { currentPrice: string | null } | null;
}

interface PriceWatchProps {
  items: PriceWatchItem[];
}

export function PriceWatch({ items }: PriceWatchProps) {
  const displayItems = items.slice(0, 5);

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 ghost-border h-full">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-on-surface-variant">
          visibility
        </span>
        <h2 className="font-headline font-bold text-xl text-on-surface">
          Price Watch
        </h2>
      </div>

      {displayItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-40 mb-3">
            bookmark_add
          </span>
          <p className="text-on-surface-variant text-sm">
            No watchlist items yet
          </p>
          <p className="text-on-surface-variant text-xs mt-1 opacity-70">
            Add items to your wishlist to track prices
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {displayItems.map(({ wishlistItem, product }) => (
            <li key={wishlistItem.id} className="flex items-center gap-3">
              {/* Colored bar */}
              <div className="w-2 h-8 rounded-full bg-tertiary flex-shrink-0" />

              {/* Name */}
              <p className="flex-1 text-sm text-on-surface font-label font-semibold truncate">
                {wishlistItem.name}
              </p>

              {/* Price */}
              <p className="text-sm font-headline font-bold text-on-surface flex-shrink-0">
                {formatCurrency(product?.currentPrice)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
