import { auth } from "@clerk/nextjs/server";
import { getItemsByUser, getItemCountByUser } from "@/lib/db/queries/items";
import { getCollectionsByUser } from "@/lib/db/queries/collections";
import { CollectionView } from "@/components/collection/collection-view";

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
      tag: params.tag,
      page,
      pageSize: 20,
    }),
    getItemCountByUser(userId),
    getCollectionsByUser(userId),
  ]);

  return (
    <CollectionView
      items={items}
      totalCount={totalCount}
      collections={collections}
      page={page}
    />
  );
}
