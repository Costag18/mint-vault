import Link from "next/link";
import Image from "next/image";
import { GradeBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";
import type { ItemWithProduct } from "@/lib/db/queries/items";

interface PremiumRaritiesProps {
  items: ItemWithProduct[];
}

export function PremiumRarities({ items }: PremiumRaritiesProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-8">
        <span className="material-symbols-outlined text-tertiary">auto_awesome</span>
        <h2 className="font-headline font-bold text-xl text-on-surface">
          Premium Rarities
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map(({ item, product }) => (
          <Link
            key={item.id}
            href={`/collection/${item.id}`}
            className="group relative bg-surface-container-low rounded-2xl pt-10 pb-4 px-4 flex flex-col items-center ghost-border hover:bg-surface-container transition-all duration-200 hover:scale-[1.02]"
          >
            {/* Floating image */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-44 rounded-xl overflow-hidden shadow-lg bg-surface-container-highest">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-30">
                    style
                  </span>
                </div>
              )}
            </div>

            {/* Spacer for floating image */}
            <div className="h-32" />

            {/* Grade badge */}
            <div className="mb-2">
              <GradeBadge grade={item.grade} gradingService={item.gradingService} />
            </div>

            {/* Name */}
            <p className="font-headline font-bold text-lg text-on-surface text-center line-clamp-2 leading-tight">
              {item.name}
            </p>

            {/* Variant */}
            {item.variant && (
              <p className="text-xs text-on-surface-variant text-center mt-1 line-clamp-1">
                {item.variant}
              </p>
            )}

            {/* Price + trend */}
            <div className="mt-3 pt-3 w-full border-t border-outline-variant flex items-center justify-between">
              <p className="font-headline font-bold text-sm text-on-surface">
                {formatCurrency(product?.currentPrice)}
              </p>
              <p className="text-xs text-on-surface-variant">30d —</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
