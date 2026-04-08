import { auth } from "@clerk/nextjs/server";
import { getItemsByUser, getItemCountByUser, getUsedTagsByUser } from "@/lib/db/queries/items";
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
  const filterOptions = {
    search: params.search,
    grade: params.grade,
    category: params.category,
    collectionId: params.collectionId,
    tag: params.tag,
  };
  const [items, totalCount, collections, usedTags] = await Promise.all([
    getItemsByUser(userId, {
      ...filterOptions,
      page,
      pageSize: 20,
    }),
    getItemCountByUser(userId, filterOptions),
    getCollectionsByUser(userId),
    getUsedTagsByUser(userId),
  ]);

  return (
    <CollectionView
      items={items}
      totalCount={totalCount}
      collections={collections}
      page={page}
      usedTags={usedTags}
    />
  );
}
