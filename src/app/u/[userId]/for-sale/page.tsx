import { db } from "@/lib/db";
import { items, pricechartingProducts, collections } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { getPreferences } from "@/lib/db/queries/preferences";
import { getCollectionsByUser } from "@/lib/db/queries/collections";
import Link from "next/link";
import { ForSaleGrid } from "@/components/for-sale/for-sale-grid";

export default async function ForSalePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const prefs = await getPreferences(userId);
  if (prefs && !prefs.profilePublic) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">lock</span>
          <h1 className="font-headline text-2xl font-bold mb-2">Private Collection</h1>
          <p className="text-on-surface-variant">This collector has set their profile to private.</p>
        </div>
      </div>
    );
  }

  // Get items tagged "Open to Offers"
  const [forSaleItems, userCollections] = await Promise.all([
    db
      .select({ item: items, product: pricechartingProducts, collection: collections })
      .from(items)
      .leftJoin(pricechartingProducts, eq(items.pricechartingId, pricechartingProducts.id))
      .leftJoin(collections, eq(items.collectionId, collections.id))
      .where(
        sql`${items.userId} = ${userId} AND ${items.tags}::jsonb ? 'Open to Offers'`
      ),
    getCollectionsByUser(userId),
  ]);

  const customTags = (prefs?.customTags as string[]) ?? [];

  const gridItems = forSaleItems.map(({ item, product, collection }) => ({
    id: item.id,
    name: item.name,
    imageUrl: item.imageUrl,
    productImageUrl: product?.imageUrl ?? null,
    grade: item.grade,
    askingPrice: item.askingPrice,
    marketPrice: product?.currentPrice ?? null,
    tags: (item.tags as string[]) ?? [],
    category: product?.category ?? null,
    collectionId: item.collectionId,
    collectionName: collection?.name ?? null,
    createdAt: item.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter">
              MINT <span className="text-primary italic">VAULT</span>
            </h1>
          </Link>
          <p className="text-on-surface-variant text-sm mt-1">
            Items Open to Offers
          </p>
        </div>

        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <span className="px-4 py-2 rounded-full text-sm font-label font-bold bg-tertiary text-on-tertiary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">sell</span>
            Open to Offers ({forSaleItems.length})
          </span>
        </div>
      </header>

      <main className="px-4 sm:px-6 max-w-6xl mx-auto pb-12">
        {forSaleItems.length === 0 ? (
          <div className="text-center py-20 text-outline">
            <span className="material-symbols-outlined text-6xl mb-4 block">
              sell
            </span>
            <p>No items currently listed for offers.</p>
          </div>
        ) : (
          <ForSaleGrid
            items={gridItems}
            customTags={customTags}
            collections={userCollections.map((c) => ({ id: c.id, name: c.name }))}
          />
        )}
      </main>
    </div>
  );
}
