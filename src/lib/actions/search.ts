"use server";

import { searchProducts } from "@/lib/scraper/pricecharting";
import { upsertProduct } from "@/lib/db/queries/products";

export async function searchPricechartingAction(query: string) {
  if (!query || query.length < 2) return [];
  const results = await searchProducts(query);
  // Upsert top 10 results into DB for caching
  for (const result of results.slice(0, 10)) {
    await upsertProduct({
      externalId: result.externalId,
      name: result.name,
      category: result.category,
      currentPrice: result.price ?? undefined,
      imageUrl: result.imageUrl ?? undefined,
    });
  }
  return results;
}
