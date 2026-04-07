import { auth } from "@clerk/nextjs/server";
import { getItemsByUser, getItemCountByUser } from "@/lib/db/queries/items";
import { getCollectionsByUser } from "@/lib/db/queries/collections";
import { ItemCard } from "@/components/collection/item-card";
import { FilterBar } from "@/components/collection/filter-bar";
import Link from "next/link";

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { userId } = await auth();
  if (!userId) return null;

  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const [items, totalCount, collections] = await Promise.all([
    getItemsByUser(userId, {
      search: params.search,
      grade: params.grade,
      collectionId: params.collectionId,
      page,
      pageSize: 20,
    }),
    getItemCountByUser(userId),
    getCollectionsByUser(userId),
  ]);

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <header className="mb-12 relative">
        <div className="max-w-4xl">
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-on-surface tracking-tighter mb-4">
            MINT <span className="text-primary italic">STATE</span>
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-xl">
            Your high-end digital gallery of graded assets, legendary comics,
            and secret rare gaming cards.
          </p>
        </div>
      </header>

      <FilterBar collections={collections} />

      {items.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">
            style
          </span>
          <h3 className="font-headline text-xl font-bold mb-2">
            No items yet
          </h3>
          <p className="text-on-surface-variant mb-6">
            Start building your collection by adding your first asset.
          </p>
          <Link
            href="/add-item"
            className="inline-flex items-center gap-2 holographic-gradient text-on-primary-fixed font-headline font-bold py-3 px-6 rounded-lg"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add First Asset
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((data) => (
              <ItemCard key={data.item.id} {...data} />
            ))}
          </div>
          <div className="mt-16 flex items-center justify-between bg-surface-container-low rounded-2xl p-6">
            <div className="flex items-center gap-4">
              {page > 1 && (
                <Link
                  href={`/collection?page=${page - 1}`}
                  className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-gray-500"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </Link>
              )}
              <span className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                {page}
              </span>
              {items.length === 20 && (
                <Link
                  href={`/collection?page=${page + 1}`}
                  className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-gray-500"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </Link>
              )}
            </div>
            <p className="font-label text-xs text-gray-500 uppercase tracking-widest">
              Showing {items.length} of {totalCount} assets
            </p>
          </div>
        </>
      )}
    </div>
  );
}
