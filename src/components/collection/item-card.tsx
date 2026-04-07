import Link from "next/link";
import Image from "next/image";
import { GradeBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { ItemWithProduct } from "@/lib/db/queries/items";

export function ItemCard({
  item,
  product,
  scale = 1,
  className,
}: ItemWithProduct & { scale?: number; className?: string }) {
  const isCompact = scale < 0.8;

  return (
    <Link
      href={`/collection/${item.id}`}
      className={cn(
        "group relative flex flex-col rounded-xl overflow-hidden",
        "bg-surface-container hover:bg-surface-container-high",
        "shadow-md hover:shadow-xl transition-all duration-200 hover:scale-[1.02]",
        className
      )}
    >
      {/* Image — 3:4 aspect */}
      <div className="relative w-full" style={{ paddingBottom: "133.33%" }}>
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container-highest">
            <span
              className={cn(
                "material-symbols-outlined text-on-surface-variant opacity-40",
                isCompact ? "text-2xl" : "text-4xl"
              )}
            >
              image
            </span>
          </div>
        )}

        {/* Grade badge */}
        {item.grade && (
          <div className="absolute top-1.5 right-1.5 rotate-[8deg]">
            <GradeBadge
              grade={item.grade}
              gradingService={item.gradingService}
              className={isCompact ? "text-[8px] px-2 py-0.5" : undefined}
            />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className={cn("flex flex-col gap-0.5 flex-1", isCompact ? "p-2" : "p-3")}>
        <p
          className={cn(
            "font-headline font-bold leading-tight line-clamp-2 text-on-surface",
            isCompact ? "text-xs" : "text-sm"
          )}
        >
          {item.name}
        </p>

        {/* Value */}
        <div className="mt-auto pt-1">
          <p
            className={cn(
              "font-bold font-headline text-on-surface",
              isCompact ? "text-xs" : "text-sm"
            )}
          >
            {formatCurrency(product?.currentPrice)}
          </p>
        </div>
      </div>
    </Link>
  );
}
