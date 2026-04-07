import Link from "next/link";
import Image from "next/image";
import { GradeBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { ItemWithProduct } from "@/lib/db/queries/items";

export function ItemCard({
  item,
  product,
  className,
}: ItemWithProduct & { className?: string }) {
  return (
    <Link
      href={`/collection/${item.id}`}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden",
        "bg-surface-container hover:bg-surface-container-high",
        "shadow-md hover:shadow-xl transition-all duration-200 hover:scale-[1.02]",
        className
      )}
    >
      {/* Image area — 3:4 aspect ratio */}
      <div className="relative w-full" style={{ paddingBottom: "133.33%" }}>
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container-highest">
            <svg
              className="w-12 h-12 text-on-surface-variant opacity-40"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3 3h18M3 9h18"
              />
            </svg>
          </div>
        )}

        {/* Grade badge — top-right, rotated */}
        {item.grade && (
          <div className="absolute top-2 right-2 rotate-[8deg]">
            <GradeBadge grade={item.grade} gradingService={item.gradingService} />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        <p className="font-headline text-lg font-bold leading-tight line-clamp-2 text-on-surface">
          {item.name}
        </p>
        {item.variant && (
          <p className="text-xs text-on-surface-variant line-clamp-1">
            {item.variant}
          </p>
        )}

        {/* Bottom section */}
        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-wide">
              Current Value
            </p>
            <p className="text-base font-bold font-headline text-on-surface">
              {formatCurrency(product?.currentPrice)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-wide">
              Market Trend
            </p>
            <p className="text-base font-bold text-on-surface-variant">—</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
