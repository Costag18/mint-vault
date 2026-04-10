import { db } from "@/lib/db";
import { items, pricechartingProducts } from "@/lib/db/schema";
import { eq, and, or, desc, asc, ilike, sql, count, inArray } from "drizzle-orm";

export type ItemWithProduct = {
  item: typeof items.$inferSelect;
  product: typeof pricechartingProducts.$inferSelect | null;
};

export type SortOption = "newest" | "oldest" | "price-high" | "price-low" | "name-az" | "name-za";

export async function getItemsByUser(
  userId: string,
  options?: {
    search?: string;
    grade?: string;
    category?: string;
    collectionId?: string;
    tag?: string;
    tags?: string[];
    tagMode?: "and" | "or";
    sort?: SortOption;
    page?: number;
    pageSize?: number;
  }
): Promise<ItemWithProduct[]> {
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  const conditions = [eq(items.userId, userId)];

  if (options?.search) {
    conditions.push(ilike(items.name, `%${options.search}%`));
  }

  if (options?.grade) {
    conditions.push(eq(items.grade, options.grade));
  }

  if (options?.category) {
    conditions.push(eq(pricechartingProducts.category, options.category));
  }

  if (options?.collectionId) {
    conditions.push(eq(items.collectionId, options.collectionId));
  }

  // Support multiple tags with AND/OR mode
  const tagList = options?.tags ?? (options?.tag ? [options.tag] : []);
  if (tagList.length > 0) {
    if (options?.tagMode === "or") {
      const tagConditions = tagList.map((t) => sql`${items.tags}::jsonb ? ${t}`);
      conditions.push(or(...tagConditions)!);
    } else {
      for (const t of tagList) {
        conditions.push(sql`${items.tags}::jsonb ? ${t}`);
      }
    }
  }

  const rows = await db
    .select({
      item: items,
      product: pricechartingProducts,
    })
    .from(items)
    .leftJoin(
      pricechartingProducts,
      eq(items.pricechartingId, pricechartingProducts.id)
    )
    .where(and(...conditions))
    .orderBy(
      (() => {
        switch (options?.sort) {
          case "oldest": return asc(items.createdAt);
          case "price-high": return desc(sql`COALESCE(CAST(${pricechartingProducts.currentPrice} AS NUMERIC), 0)`);
          case "price-low": return asc(sql`COALESCE(CAST(${pricechartingProducts.currentPrice} AS NUMERIC), 0)`);
          case "name-az": return asc(items.name);
          case "name-za": return desc(items.name);
          default: return desc(items.createdAt);
        }
      })()
    )
    .limit(pageSize)
    .offset(offset);

  return rows as ItemWithProduct[];
}

export async function getItemCountByUser(
  userId: string,
  options?: {
    search?: string;
    grade?: string;
    category?: string;
    collectionId?: string;
    tag?: string;
    tags?: string[];
    tagMode?: "and" | "or";
  }
): Promise<number> {
  const conditions = [eq(items.userId, userId)];

  if (options?.search) {
    conditions.push(ilike(items.name, `%${options.search}%`));
  }
  if (options?.grade) {
    conditions.push(eq(items.grade, options.grade));
  }
  if (options?.category) {
    conditions.push(eq(pricechartingProducts.category, options.category));
  }
  if (options?.collectionId) {
    conditions.push(eq(items.collectionId, options.collectionId));
  }
  const tagList = options?.tags ?? (options?.tag ? [options.tag] : []);
  if (tagList.length > 0) {
    if (options?.tagMode === "or") {
      const tagConditions = tagList.map((t) => sql`${items.tags}::jsonb ? ${t}`);
      conditions.push(or(...tagConditions)!);
    } else {
      for (const t of tagList) {
        conditions.push(sql`${items.tags}::jsonb ? ${t}`);
      }
    }
  }

  const needsJoin = !!options?.category;

  if (needsJoin) {
    const result = await db
      .select({ total: sql<number>`COALESCE(SUM(${items.quantity}), 0)` })
      .from(items)
      .leftJoin(
        pricechartingProducts,
        eq(items.pricechartingId, pricechartingProducts.id)
      )
      .where(and(...conditions));
    return Number(result[0]?.total ?? 0);
  }

  const result = await db
    .select({ total: sql<number>`COALESCE(SUM(${items.quantity}), 0)` })
    .from(items)
    .where(and(...conditions));
  return Number(result[0]?.total ?? 0);
}

export async function getItemById(
  id: string,
  userId: string
): Promise<ItemWithProduct | null> {
  const rows = await db
    .select({
      item: items,
      product: pricechartingProducts,
    })
    .from(items)
    .leftJoin(
      pricechartingProducts,
      eq(items.pricechartingId, pricechartingProducts.id)
    )
    .where(and(eq(items.id, id), eq(items.userId, userId)))
    .limit(1);

  if (rows.length === 0) return null;
  return rows[0] as ItemWithProduct;
}

export async function getTopItemsByValue(
  userId: string,
  limit = 4
): Promise<ItemWithProduct[]> {
  const rows = await db
    .select({
      item: items,
      product: pricechartingProducts,
    })
    .from(items)
    .leftJoin(
      pricechartingProducts,
      eq(items.pricechartingId, pricechartingProducts.id)
    )
    .where(
      and(
        eq(items.userId, userId),
        sql`${pricechartingProducts.currentPrice} is not null`
      )
    )
    .orderBy(desc(pricechartingProducts.currentPrice))
    .limit(limit);

  return rows as ItemWithProduct[];
}

export async function createItem(data: {
  collectionId: string;
  userId: string;
  name: string;
  pricechartingId?: number | null;
  variant?: string | null;
  grade?: string | null;
  gradingService?: string | null;
  certNumber?: string | null;
  purchasePrice?: string | null;
  purchaseDate?: string | null;
  notes?: string | null;
  imageUrl?: string | null;
  tags?: string[];
  askingPrice?: string | null;
  quantity?: number;
}) {
  const result = await db
    .insert(items)
    .values({
      collectionId: data.collectionId,
      userId: data.userId,
      name: data.name,
      pricechartingId: data.pricechartingId ?? undefined,
      variant: data.variant ?? undefined,
      grade: data.grade ?? undefined,
      gradingService: data.gradingService ?? undefined,
      certNumber: data.certNumber ?? undefined,
      purchasePrice: data.purchasePrice ?? undefined,
      purchaseDate: data.purchaseDate ?? undefined,
      notes: data.notes ?? undefined,
      imageUrl: data.imageUrl ?? undefined,
      tags: data.tags ?? [],
      askingPrice: data.askingPrice ?? undefined,
      quantity: data.quantity ?? 1,
    })
    .returning();
  return result[0];
}

export async function updateItem(
  id: string,
  userId: string,
  data: Partial<{
    collectionId: string;
    tags: string[];
    name: string;
    variant: string | null;
    grade: string | null;
    gradingService: string | null;
    certNumber: string | null;
    purchasePrice: string | null;
    purchaseDate: string | null;
    notes: string | null;
    quantity: number;
    askingPrice: string | null;
  }>
) {
  const result = await db
    .update(items)
    .set(data)
    .where(and(eq(items.id, id), eq(items.userId, userId)))
    .returning();
  return result[0] ?? null;
}

/** Update the price on a custom product record */
export async function updateCustomProductPrice(
  productId: number,
  price: string
) {
  const result = await db
    .update(pricechartingProducts)
    .set({ currentPrice: price, lastFetchedAt: new Date() })
    .where(eq(pricechartingProducts.id, productId))
    .returning();
  return result[0] ?? null;
}

export async function deleteItem(id: string, userId: string) {
  return db
    .delete(items)
    .where(and(eq(items.id, id), eq(items.userId, userId)));
}

/** Get all distinct tags used across a user's items */
export async function getUsedTagsByUser(userId: string): Promise<string[]> {
  const rows = await db
    .select({ tags: items.tags })
    .from(items)
    .where(eq(items.userId, userId));
  const tagSet = new Set<string>();
  for (const row of rows) {
    if (Array.isArray(row.tags)) {
      for (const tag of row.tags as string[]) {
        tagSet.add(tag);
      }
    }
  }
  return [...tagSet].sort();
}

/** Create a custom product record for manual entries with a market price */
export async function createCustomProduct(data: {
  name: string;
  price: string;
  imageUrl?: string | null;
}) {
  const externalId = `custom-${crypto.randomUUID()}`;
  const result = await db
    .insert(pricechartingProducts)
    .values({
      externalId,
      name: data.name,
      category: "Custom",
      currentPrice: data.price,
      imageUrl: data.imageUrl ?? undefined,
      lastFetchedAt: new Date(),
    })
    .returning();
  return result[0];
}

/** Check if a user already owns an item with a given pricechartingId */
export async function findExistingItem(
  userId: string,
  pricechartingId: number
): Promise<{ id: string; name: string; quantity: number } | null> {
  const rows = await db
    .select({
      id: items.id,
      name: items.name,
      quantity: items.quantity,
    })
    .from(items)
    .where(
      and(eq(items.userId, userId), eq(items.pricechartingId, pricechartingId))
    )
    .limit(1);
  return rows[0] ?? null;
}

/** Get distinct categories from products linked to a user's items */
export async function getCategoriesByUser(userId: string): Promise<string[]> {
  const rows = await db
    .selectDistinct({ category: pricechartingProducts.category })
    .from(items)
    .innerJoin(
      pricechartingProducts,
      eq(items.pricechartingId, pricechartingProducts.id)
    )
    .where(eq(items.userId, userId))
    .orderBy(pricechartingProducts.category);
  return rows.map((r) => r.category);
}

/** Get all item IDs matching filters (no pagination, for bulk select-all) */
export async function getFilteredItemIds(
  userId: string,
  options?: {
    search?: string;
    grade?: string;
    category?: string;
    collectionId?: string;
    tags?: string[];
    tagMode?: "and" | "or";
  }
): Promise<string[]> {
  const conditions = [eq(items.userId, userId)];

  if (options?.search) {
    conditions.push(ilike(items.name, `%${options.search}%`));
  }
  if (options?.grade) {
    conditions.push(eq(items.grade, options.grade));
  }
  if (options?.category) {
    conditions.push(eq(pricechartingProducts.category, options.category));
  }
  if (options?.collectionId) {
    conditions.push(eq(items.collectionId, options.collectionId));
  }
  const tagList = options?.tags ?? [];
  if (tagList.length > 0) {
    if (options?.tagMode === "or") {
      const tagConditions = tagList.map((t) => sql`${items.tags}::jsonb ? ${t}`);
      conditions.push(or(...tagConditions)!);
    } else {
      for (const t of tagList) {
        conditions.push(sql`${items.tags}::jsonb ? ${t}`);
      }
    }
  }

  const needsJoin = !!options?.category;

  if (needsJoin) {
    const rows = await db
      .select({ id: items.id })
      .from(items)
      .leftJoin(pricechartingProducts, eq(items.pricechartingId, pricechartingProducts.id))
      .where(and(...conditions));
    return rows.map((r) => r.id);
  }

  const rows = await db
    .select({ id: items.id })
    .from(items)
    .where(and(...conditions));
  return rows.map((r) => r.id);
}

// ── Bulk operations ──

export async function bulkDeleteItems(ids: string[], userId: string) {
  if (ids.length === 0) return;
  return db
    .delete(items)
    .where(and(inArray(items.id, ids), eq(items.userId, userId)));
}

export async function bulkMoveItems(
  ids: string[],
  userId: string,
  collectionId: string
) {
  if (ids.length === 0) return;
  return db
    .update(items)
    .set({ collectionId })
    .where(and(inArray(items.id, ids), eq(items.userId, userId)));
}

export async function bulkAddTag(
  ids: string[],
  userId: string,
  tag: string
) {
  if (ids.length === 0) return;
  return db
    .update(items)
    .set({
      tags: sql`CASE WHEN NOT (${items.tags}::jsonb ? ${tag}) THEN ${items.tags}::jsonb || to_jsonb(${tag}::text) ELSE ${items.tags} END`,
    })
    .where(and(inArray(items.id, ids), eq(items.userId, userId)));
}

export async function bulkRemoveTag(
  ids: string[],
  userId: string,
  tag: string
) {
  if (ids.length === 0) return;
  return db
    .update(items)
    .set({
      tags: sql`(${items.tags}::jsonb - ${tag})`,
    })
    .where(and(inArray(items.id, ids), eq(items.userId, userId)));
}
