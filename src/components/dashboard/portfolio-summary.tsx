import { formatCompactCurrency } from "@/lib/utils/format";

interface PortfolioSummaryProps {
  totalValue: number;
  itemCount: number;
}

export function PortfolioSummary({ totalValue, itemCount }: PortfolioSummaryProps) {
  return (
    <div className="md:col-span-2 relative bg-surface-container-low rounded-2xl p-8 min-h-[300px] flex flex-col justify-between overflow-hidden ghost-border">
      {/* Decorative icon */}
      <span
        className="material-symbols-outlined absolute top-4 right-4 text-on-surface opacity-20 select-none pointer-events-none"
        style={{ fontSize: "160px" }}
        aria-hidden="true"
      >
        shield_with_heart
      </span>

      {/* Header */}
      <div className="relative">
        <p className="font-headline text-xs font-bold uppercase tracking-widest text-tertiary mb-2">
          Portfolio Performance
        </p>
        <p className="font-headline font-black text-5xl text-on-surface tracking-tighter">
          {formatCompactCurrency(totalValue)}
        </p>
      </div>

      {/* Stats row */}
      <div className="relative flex gap-4 mt-8">
        <div className="flex-1 bg-surface-container rounded-xl p-4">
          <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">
            Graded Assets
          </p>
          <p className="font-headline font-black text-2xl text-on-surface">
            {itemCount}
          </p>
        </div>
        <div className="flex-1 bg-surface-container rounded-xl p-4">
          <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">
            Market Volume
          </p>
          <p className="font-headline font-black text-2xl text-on-surface-variant">
            —
          </p>
        </div>
      </div>
    </div>
  );
}
