import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getItemById } from "@/lib/db/queries/items";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { DeleteItemButton } from "@/components/collection/delete-item-button";
import { MoveCollectionSelect } from "@/components/collection/move-collection-select";
import { ItemEditForm } from "@/components/collection/item-edit-form";
import { getCollectionsByUser } from "@/lib/db/queries/collections";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return notFound();

  const result = await getItemById(id, userId);
  if (!result) return notFound();

  const { item, product } = result;

  const collections = await getCollectionsByUser(userId);
  const hasVerifiedBadge = !!(item.certNumber && item.gradingService);
  const imageUrl = item.imageUrl ?? product?.imageUrl ?? null;
  const currentMarketValue = product?.currentPrice ?? null;

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Back link */}
      <Link
        href="/collection"
        className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-8"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back to Collection
      </Link>

      {/* 12-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left column — image */}
        <div className="md:col-span-6 flex flex-col gap-4">
          <div className="relative aspect-[3/4] rounded-3xl bg-surface-container-low overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={item.name}
                fill
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-6xl">
                  image
                </span>
              </div>
            )}

            {/* Verified Asset badge */}
            {hasVerifiedBadge && (
              <div className="absolute bottom-4 left-4 glass-effect flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-label font-medium text-on-surface">
                <span className="material-symbols-outlined text-sm text-tertiary">
                  verified
                </span>
                Verified Asset
              </div>
            )}
          </div>
        </div>

        {/* Right column — details */}
        <div className="md:col-span-6 flex flex-col gap-6">
          {/* Grade badge + cert */}
          <div className="flex items-center gap-3 flex-wrap">
            {item.grade && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-sm font-label font-semibold">
                {item.gradingService ? `${item.gradingService} ` : ""}
                {item.grade}
              </span>
            )}
            {item.certNumber && (
              <span className="text-sm text-outline font-label">
                #{item.certNumber}
              </span>
            )}
          </div>

          {/* Item name */}
          <div>
            <h1 className="text-5xl md:text-6xl font-headline font-bold tracking-tighter text-on-surface leading-tight">
              {item.name}
            </h1>
            {item.variant && (
              <p className="text-xl font-headline text-primary font-medium mt-2">
                {item.variant}
              </p>
            )}
          </div>

          {/* Market stats bento */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl bg-surface-container p-5 flex flex-col gap-1">
              <span className="text-xs font-label text-outline uppercase tracking-widest">
                Market Value
              </span>
              <span className="text-2xl font-headline font-bold text-tertiary">
                {formatCurrency(currentMarketValue)} <span className="text-xs font-label text-outline">USD</span>
              </span>
            </div>
            <div className="rounded-3xl bg-surface-container p-5 flex flex-col gap-1">
              <span className="text-xs font-label text-outline uppercase tracking-widest">
                Purchase Price
              </span>
              <span className="text-2xl font-headline font-bold text-on-surface">
                {formatCurrency(item.purchasePrice)} <span className="text-xs font-label text-outline">USD</span>
              </span>
            </div>
          </div>

          {/* Tags */}
          {item.tags && (item.tags as string[]).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(item.tags as string[]).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-label font-bold bg-tertiary/10 text-tertiary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* The Grail Narrative */}
          {item.notes && (
            <div className="rounded-3xl bg-surface-container p-5">
              <h2 className="text-sm font-label font-medium text-outline uppercase tracking-widest mb-3">
                The Grail Narrative
              </h2>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {item.notes}
              </p>
            </div>
          )}

          {/* Metadata list */}
          <div className="rounded-3xl bg-surface-container p-5">
            <h2 className="text-sm font-label font-medium text-outline uppercase tracking-widest mb-4">
              Details
            </h2>
            <dl className="space-y-3">
              {item.gradingService && (
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-outline">Grading Service</dt>
                  <dd className="text-sm text-on-surface font-medium">
                    {item.gradingService}
                  </dd>
                </div>
              )}
              {item.certNumber && (
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-outline">Cert Number</dt>
                  <dd className="text-sm text-on-surface font-medium">
                    #{item.certNumber}
                  </dd>
                </div>
              )}
              {item.purchaseDate && (
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-outline">Purchase Date</dt>
                  <dd className="text-sm text-on-surface font-medium">
                    {formatDate(item.purchaseDate)}
                  </dd>
                </div>
              )}
              {product?.category && (
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-outline">Category</dt>
                  <dd className="text-sm text-on-surface font-medium capitalize">
                    {product.category}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Edit form + Actions */}
          <ItemEditForm
            itemId={item.id}
            initialData={{
              name: item.name,
              variant: item.variant,
              grade: item.grade,
              gradingService: item.gradingService,
              certNumber: item.certNumber,
              purchasePrice: item.purchasePrice,
              purchaseDate: item.purchaseDate,
              notes: item.notes,
              tags: item.tags as string[] | null,
              quantity: item.quantity,
              askingPrice: item.askingPrice,
            }}
          />

          <div className="flex flex-wrap items-center gap-4">
            <MoveCollectionSelect
              itemId={item.id}
              currentCollectionId={item.collectionId}
              collections={collections}
            />
            <DeleteItemButton itemId={item.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
