import { getItemsByUser, getItemCountByUser } from "@/lib/db/queries/items";
import { getPreferences } from "@/lib/db/queries/preferences";
import { formatCurrency } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";

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
    getItemsByUser(userId, { pageSize: 50 }),
    getItemCountByUser(userId),
  ]);

  const totalValue = items.reduce((sum, { product }) => {
    return sum + (product?.currentPrice ? parseFloat(product.currentPrice) : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-headline text-4xl font-bold tracking-tighter">
              MINT <span className="text-primary italic">VAULT</span>
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
              Public Collection
            </p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-2xl font-headline font-bold">{totalCount}</p>
              <p className="text-[10px] font-label text-outline uppercase tracking-widest">
                Items
              </p>
            </div>
            <div>
              <p className="text-2xl font-headline font-bold text-tertiary">
                {formatCurrency(totalValue)}
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

      <main className="px-6 max-w-6xl mx-auto pb-12">
        {items.length === 0 ? (
          <div className="text-center py-20 text-outline">
            <span className="material-symbols-outlined text-6xl mb-4 block">
              style
            </span>
            <p>This collection is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map(({ item, product }) => (
              <div
                key={item.id}
                className="bg-surface-container rounded-xl overflow-hidden"
              >
                <div className="relative w-full" style={{ paddingBottom: "133.33%" }}>
                  {item.imageUrl || product?.imageUrl ? (
                    <Image
                      src={item.imageUrl ?? product?.imageUrl ?? ""}
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
                  {(item.tags as string[] | null)?.includes("Open to Offers") && (
                    <div className="absolute bottom-1.5 left-1.5 bg-primary text-on-primary text-[8px] font-black font-label px-2 py-0.5 rounded-full shadow">
                      FOR SALE
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-headline font-bold line-clamp-2">
                    {item.name}
                  </p>
                  {product?.currentPrice && (
                    <p className="text-xs font-bold text-tertiary mt-0.5">
                      {formatCurrency(product.currentPrice)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
