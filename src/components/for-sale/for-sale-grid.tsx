"use client";

import { useState } from "react";
import Image from "next/image";
import {
  formatCurrency,
  convertFromUSD,
  CURRENCY_OPTIONS,
  type CurrencyCode,
} from "@/lib/utils/format";

type ForSaleItem = {
  id: string;
  name: string;
  imageUrl: string | null;
  productImageUrl: string | null;
  grade: string | null;
  askingPrice: string | null;
  marketPrice: string | null;
};

export function ForSaleGrid({ items }: { items: ForSaleItem[] }) {
  const [currency, setCurrency] = useState<CurrencyCode | "">("");

  return (
    <div>
      {/* Currency selector */}
      <div className="flex items-center gap-3 mb-6">
        <label className="text-[10px] font-label text-outline uppercase tracking-widest">
          Convert to
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode | "")}
          className="bg-surface-container-high border-none text-sm font-body rounded-lg py-2 pl-3 pr-10 focus:ring-1 focus:ring-primary text-on-surface"
        >
          <option value="">USD only</option>
          {Object.entries(CURRENCY_OPTIONS).map(([code, { label }]) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-surface-container rounded-xl overflow-hidden border border-tertiary/20"
          >
            <div
              className="relative w-full"
              style={{ paddingBottom: "133.33%" }}
            >
              {item.imageUrl || item.productImageUrl ? (
                <Image
                  src={item.imageUrl ?? item.productImageUrl ?? ""}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 20vw"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-container-highest">
                  <span className="material-symbols-outlined text-2xl text-outline">
                    image
                  </span>
                </div>
              )}
              {item.grade && (
                <div className="absolute top-1.5 right-1.5 bg-tertiary text-on-tertiary text-[8px] font-black font-label px-2 py-0.5 rounded-full shadow rotate-[6deg]">
                  {item.grade}
                </div>
              )}
              <div className="absolute bottom-1.5 left-1.5 bg-primary text-on-primary text-[8px] font-black font-label px-2 py-0.5 rounded-full shadow">
                OPEN TO OFFERS
              </div>
            </div>
            <div className="p-2 space-y-1">
              <p className="text-xs font-headline font-bold line-clamp-2">
                {item.name}
              </p>
              {item.askingPrice && (
                <div>
                  <p className="text-sm font-bold text-primary">
                    {formatCurrency(item.askingPrice)}{" "}
                    <span className="text-[9px] font-label text-outline font-normal">
                      USD
                    </span>
                  </p>
                  {currency && (
                    <p className="text-[10px] text-on-surface-variant">
                      {convertFromUSD(item.askingPrice, currency)} {currency}
                    </p>
                  )}
                </div>
              )}
              {item.marketPrice && (
                <div>
                  <p className="text-[10px] font-label text-outline uppercase tracking-widest">
                    Market
                  </p>
                  <p className="text-xs font-bold text-tertiary">
                    {formatCurrency(item.marketPrice)}{" "}
                    <span className="text-[9px] font-label text-outline font-normal">
                      USD
                    </span>
                  </p>
                  {currency && (
                    <p className="text-[10px] text-on-surface-variant">
                      {convertFromUSD(item.marketPrice, currency)} {currency}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
