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

  // Fetch detail page for top 3 results to get images upfront (rest lazy-loaded)
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
  const merged = [...enriched, ...results.slice(3)];

  // Upsert top 10 into DB and capture DB IDs
  const final: SearchResultWithDbId[] = [];
  for (const result of merged) {
    let dbProductId: number | null = null;
    if (final.length < 10) {
      const product = await upsertProduct({
        externalId: result.externalId,
        name: result.name,
        category: result.category,
        currentPrice: result.price,
        imageUrl: result.imageUrl,
      });
      dbProductId = product.id;
    }
    final.push({ ...result, dbProductId });
  }
  return final;
}

export async function lookupPricechartingUrlAction(
  rawUrl: string
): Promise<SearchResultWithDbId | null> {
  try {
    const parsed = new URL(rawUrl);
    if (!parsed.hostname.includes("pricecharting.com")) return null;
    const slug = parsed.pathname.replace(/^\//, "");
    if (!slug) return null;

    const detail = await getProductDetail(slug);
    if (!detail.name) return null;

    const product = await upsertProduct({
      externalId: slug,
      name: detail.name,
      category: detail.category,
      currentPrice: detail.price,
      imageUrl: detail.imageUrl,
    });

    return {
      externalId: slug,
      name: detail.name,
      category: detail.category,
      price: detail.price,
      imageUrl: detail.imageUrl,
      url: rawUrl,
      dbProductId: product.id,
    };
  } catch {
    return null;
  }
}

/** Ensure a product exists in the DB — used when adding items beyond the top 10 search results */
export async function ensureProductAction(data: {
  externalId: string;
  name: string;
  category: string;
  price: string | null;
  imageUrl: string | null;
}): Promise<number> {
  const product = await upsertProduct({
    externalId: data.externalId,
    name: data.name,
    category: data.category,
    currentPrice: data.price,
    imageUrl: data.imageUrl,
  });
  return product.id;
}

export async function fetchProductImageAction(
  externalId: string
): Promise<string | null> {
  try {
    const detail = await getProductDetail(externalId);
    return detail.imageUrl ?? null;
  } catch {
    return null;
  }
}
