"use server";

import {
  searchProducts,
  getProductDetail,
} from "@/lib/scraper/pricecharting";
import { upsertProduct } from "@/lib/db/queries/products";

export type SearchResultWithDbId = {
  externalId: string;
  name: string;
  category: string;
  price: string | null;
  imageUrl: string | null;
  url: string;
  dbProductId: number | null;
};

export async function searchPricechartingAction(
  query: string
): Promise<SearchResultWithDbId[]> {
  if (!query || query.length < 2) return [];
  const results = await searchProducts(query);

  // Fetch detail page for top 8 results to get images (search results have none)
  const enriched = await Promise.all(
    results.slice(0, 8).map(async (result) => {
      try {
        const detail = await getProductDetail(result.externalId);
        return { ...result, imageUrl: detail.imageUrl ?? result.imageUrl };
      } catch {
        return result;
      }
    })
  );

  // Merge enriched results back
  const merged = [...enriched, ...results.slice(8)];

  // Upsert top 10 into DB and capture DB IDs
  const final: SearchResultWithDbId[] = [];
  for (const result of merged) {
    let dbProductId: number | null = null;
    if (final.length < 10) {
      const product = await upsertProduct({
        externalId: result.externalId,
        name: result.name,
        category: result.category,
        currentPrice: result.price ?? undefined,
        imageUrl: result.imageUrl ?? undefined,
      });
      dbProductId = product.id;
    }
    final.push({ ...result, dbProductId });
  }
  return final;
}
