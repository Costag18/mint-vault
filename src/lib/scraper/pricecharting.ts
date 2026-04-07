import * as cheerio from "cheerio";
import { getCached, setCache } from "./cache";

const TTL_MS = 60 * 60 * 1000; // 1 hour
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

export type PricechartingSearchResult = {
  externalId: string;
  name: string;
  category: string;
  price: string | null;
  imageUrl: string | null;
  url: string;
};

export type PricechartingDetail = {
  externalId: string;
  name: string;
  category: string;
  price: string | null;
  imageUrl: string | null;
  variants: { name: string; url: string }[];
  metadata: Record<string, unknown>;
};

function categorize(consoleName: string): string {
  const lower = consoleName.toLowerCase();
  if (
    lower.includes("pokemon") ||
    lower.includes("magic") ||
    lower.includes("yugioh") ||
    lower.includes("trading card")
  ) {
    return "tcg";
  }
  if (lower.includes("comic")) {
    return "comics";
  }
  return "games";
}

export async function searchProducts(
  query: string
): Promise<PricechartingSearchResult[]> {
  const cacheKey = `search:${query}`;
  const cached = getCached<PricechartingSearchResult[]>(cacheKey);
  if (cached) return cached;

  const url = `https://www.pricecharting.com/search-products?q=${encodeURIComponent(query)}&type=prices`;
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!res.ok) {
    throw new Error(`PriceCharting search failed: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const results: PricechartingSearchResult[] = [];

  $("table#games_table tbody tr").each((_i, row) => {
    const titleAnchor = $(row).find("td.title a").first();
    const name = titleAnchor.text().trim();
    const href = titleAnchor.attr("href") ?? "";
    const imageEl = $(row).find("td.title img").first();
    const imageUrl = imageEl.attr("src") ?? imageEl.attr("data-src") ?? null;
    const priceEl = $(row).find("td.price span.js-price").first();
    const price = priceEl.text().trim() || null;
    const consoleName = $(row).find("td.console-name").text().trim();

    if (!name || !href) return;

    // Extract slug from URL like /game/nintendo-64/super-mario-64
    // externalId = full path without leading slash
    const externalId = href.replace(/^\//, "");

    results.push({
      externalId,
      name,
      category: categorize(consoleName),
      price: price ? price.replace(/[^0-9.]/g, "") || null : null,
      imageUrl: imageUrl ?? null,
      url: `https://www.pricecharting.com${href}`,
    });
  });

  setCache(cacheKey, results, TTL_MS);
  return results;
}

export async function getProductDetail(
  slug: string
): Promise<PricechartingDetail> {
  const cacheKey = `detail:${slug}`;
  const cached = getCached<PricechartingDetail>(cacheKey);
  if (cached) return cached;

  const url = `https://www.pricecharting.com/game/${slug}`;
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!res.ok) {
    throw new Error(`PriceCharting detail fetch failed: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const name = $("h1#product_name").text().trim();

  // Find product image — PriceCharting hosts on Google Cloud Storage
  let imageUrl: string | null = null;
  $("img").each((_i, el) => {
    const src = $(el).attr("src") ?? "";
    if (src.includes("images.pricecharting.com") && !imageUrl) {
      imageUrl = src;
    }
  });
  if (!imageUrl) {
    imageUrl = $('meta[property="og:image"]').attr("content") ?? null;
  }

  const priceEl = $("td#used_price span.js-price").first();
  const rawPrice = priceEl.text().trim();
  const price = rawPrice ? rawPrice.replace(/[^0-9.]/g, "") || null : null;

  // Collect variants (if any)
  const variants: { name: string; url: string }[] = [];
  $("div#variants a, ul.variants a").each((_i, el) => {
    const vName = $(el).text().trim();
    const vHref = $(el).attr("href") ?? "";
    if (vName && vHref) {
      variants.push({ name: vName, url: `https://www.pricecharting.com${vHref}` });
    }
  });

  // Determine category from console/platform info
  const consoleName =
    $("div#product_details span.console, span.console-name").text().trim();
  const category = categorize(consoleName);

  const detail: PricechartingDetail = {
    externalId: slug,
    name,
    category,
    price,
    imageUrl,
    variants,
    metadata: {},
  };

  setCache(cacheKey, detail, TTL_MS);
  return detail;
}
