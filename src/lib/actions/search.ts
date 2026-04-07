"use server";

import {
  searchProducts,
  getProductDetail,
} from "@/lib/scraper/pricecharting";
import { upsertProduct } from "@/lib/db/queries/products";

export async function searchPricechartingAction(query: string) {
  if (!query || query.length < 2) return [];
  const results = await searchProducts(query);

  // Fetch detail page for top 3 results to get images (search results have none)
  const enriched = await Promise.all(
    results.slice(0, 3).map(async (result) => {
      try {
        const detail = await getProductDetail(result.externalId);
        return { ...result, imageUrl: detail.imageUrl ?? result.imageUrl };
      } catch {
        return result;
      }
    })
  );

  // Merge enriched results back
  const final = [...enriched, ...results.slice(3)];

  // Upsert top 10 into DB
  for (const result of final.slice(0, 10)) {
    await upsertProduct({
      externalId: result.externalId,
      name: result.name,
      category: result.category,
      currentPrice: result.price ?? undefined,
      imageUrl: result.imageUrl ?? undefined,
    });
  }
  return final;
}
