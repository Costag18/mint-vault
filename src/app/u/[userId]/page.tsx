import { getItemsByUser, getItemCountByUser } from "@/lib/db/queries/items";
import { getPreferences } from "@/lib/db/queries/preferences";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";
import { PublicCollectionGrid } from "@/components/public/public-collection-grid";

export default async function PublicProfilePage({
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

  const [items, totalCount] = await Promise.all([
    getItemsByUser(userId, { pageSize: 200 }),
    getItemCountByUser(userId),
  ]);

  const customTags = (prefs?.customTags as string[]) ?? [];

  const totalValue = items.reduce((sum, { item, product }) => {
    const price = product?.currentPrice ? parseFloat(product.currentPrice) : 0;
    return sum + price * (item.quantity ?? 1);
  }, 0);

  const gridItems = items.map(({ item, product }) => ({
    id: item.id,
    name: item.name,
    imageUrl: item.imageUrl,
    productImageUrl: product?.imageUrl ?? null,
    grade: item.grade,
    price: product?.currentPrice ? parseFloat(product.currentPrice) : 0,
    quantity: item.quantity,
    tags: (item.tags as string[]) ?? [],
    createdAt: item.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tighter">
                MINT <span className="text-primary italic">VAULT</span>
              </h1>
            </Link>
            <p className="text-on-surface-variant text-sm mt-1">
              {prefs?.displayName ? `${prefs.displayName}'s Collection` : "Public Collection"}
            </p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-xl sm:text-2xl font-headline font-bold">{totalCount}</p>
              <p className="text-[10px] font-label text-outline uppercase tracking-widest">
                Items
              </p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-headline font-bold text-tertiary">
                {formatCurrency(totalValue)} <span className="text-xs font-label text-outline">USD</span>
              </p>
              <p className="text-[10px] font-label text-outline uppercase tracking-widest">
                Value
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          <Link
            href={`/u/${userId}`}
            className="px-4 py-2 rounded-full text-sm font-label font-bold bg-primary text-on-primary"
          >
            All Items
          </Link>
          <Link
            href={`/u/${userId}/for-sale`}
            className="px-4 py-2 rounded-full text-sm font-label font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Open to Offers
          </Link>
        </div>
      </header>

      <main className="px-4 sm:px-6 max-w-6xl mx-auto pb-12">
        {items.length === 0 ? (
          <div className="text-center py-20 text-outline">
            <span className="material-symbols-outlined text-6xl mb-4 block">
              style
            </span>
            <p>This collection is empty.</p>
          </div>
        ) : (
          <PublicCollectionGrid items={gridItems} customTags={customTags} />
        )}
      </main>
    </div>
  );
}
