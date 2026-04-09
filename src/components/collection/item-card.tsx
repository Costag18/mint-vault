import Link from "next/link";
import Image from "next/image";
import { GradeBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { ItemWithProduct } from "@/lib/db/queries/items";

type ItemCardProps = ItemWithProduct & {
  scale?: number;
  className?: string;
  selectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
};

export function ItemCard({
  item,
  product,
  scale = 1,
  className,
  selectMode,
  isSelected,
  onToggleSelect,
}: ItemCardProps) {
  const isCompact = scale < 0.8;

  const cardContent = (
    <>
      {/* Image — 3:4 aspect */}
      <div className="relative w-full" style={{ paddingBottom: "133.33%" }}>
        {(item.imageUrl || product?.imageUrl) ? (
          <Image
            src={item.imageUrl || product?.imageUrl || ""}
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

        {/* Selection checkbox */}
        {selectMode && (
          <div className="absolute top-2 left-2 z-10">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                isSelected
                  ? "bg-primary shadow-md"
                  : "border-2 border-white/70 bg-black/20"
              )}
            >
              {isSelected && (
                <span className="material-symbols-outlined text-on-primary text-sm font-bold">
                  check
                </span>
              )}
            </div>
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

        {/* Value + Qty */}
        <div className="mt-auto pt-1 flex items-center justify-between gap-1">
          <p
            className={cn(
              "font-bold font-headline text-on-surface",
              isCompact ? "text-xs" : "text-sm"
            )}
          >
            {formatCurrency(product?.currentPrice)} <span className={cn("font-label text-outline font-normal", isCompact ? "text-[8px]" : "text-[10px]")}>USD</span>
          </p>
          {item.quantity > 1 && (
            <span
              className={cn(
                "font-label font-bold text-tertiary shrink-0",
                isCompact ? "text-[9px]" : "text-[10px]"
              )}
            >
              QTY: {item.quantity}
            </span>
          )}
        </div>
      </div>
    </>
  );

  const sharedClasses = cn(
    "group relative flex flex-col rounded-xl overflow-hidden",
    "bg-surface-container shadow-md transition-all duration-200",
    selectMode
      ? isSelected
        ? "ring-2 ring-primary ring-offset-1 ring-offset-surface"
        : "opacity-60"
      : "hover:bg-surface-container-high hover:shadow-xl hover:scale-[1.02]",
    className
  );

  if (selectMode) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onToggleSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleSelect?.();
          }
        }}
        className={cn(sharedClasses, "cursor-pointer")}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={`/collection/${item.id}`} className={sharedClasses}>
      {cardContent}
    </Link>
  );
}
