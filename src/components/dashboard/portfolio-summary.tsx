import { formatCurrency } from "@/lib/utils/format";

interface PortfolioSummaryProps {
  totalValue: number;
  uniqueCount: number;
  totalItemCount: number;
  displayName: string;
  avatarUrl: string | null;
}

export function PortfolioSummary({
  totalValue,
  uniqueCount,
  totalItemCount,
  displayName,
  avatarUrl,
}: PortfolioSummaryProps) {
  return (
    <div className="md:col-span-2 relative bg-surface-container-low rounded-2xl p-8 min-h-[280px] flex flex-col justify-between overflow-hidden ghost-border">
      {/* Profile + Header */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-surface-container-highest overflow-hidden shrink-0 flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-2xl text-primary">
                person
              </span>
            )}
          </div>
          <div>
            <p className="font-headline font-bold text-on-surface text-lg">
              {displayName}
            </p>
            <p className="text-[10px] font-label text-tertiary uppercase tracking-widest">
              Portfolio Performance
            </p>
          </div>
        </div>
        <p className="font-headline font-black text-5xl text-on-surface tracking-tighter">
          {formatCurrency(totalValue)} <span className="text-lg font-label text-outline font-normal">USD</span>
        </p>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mt-8">
        <div className="flex-1 bg-surface-container rounded-xl p-4">
          <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">
            Unique Items
          </p>
          <p className="font-headline font-black text-2xl text-on-surface">
            {uniqueCount}
          </p>
        </div>
        <div className="flex-1 bg-surface-container rounded-xl p-4">
          <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">
            Total Items
          </p>
          <p className="font-headline font-black text-2xl text-on-surface">
            {totalItemCount}
          </p>
        </div>
      </div>
    </div>
  );
}
