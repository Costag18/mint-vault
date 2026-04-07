import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getWishlistByUser } from "@/lib/db/queries/wishlist";
import { WishlistItem } from "@/components/wishlist/wishlist-item";

export default async function WishlistPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const wishlist = await getWishlistByUser(userId);

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-2">
          Wish<span className="text-primary italic">list</span>
        </h1>
        <p className="text-on-surface-variant text-base">
          Items you want — bookmark them while searching to track their market price.
        </p>
      </header>

      <section>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline mb-4 block">
              auto_awesome
            </span>
            <h3 className="font-headline text-xl font-bold mb-2 text-on-surface">
              Wishlist is empty
            </h3>
            <p className="text-on-surface-variant max-w-md mx-auto">
              Bookmark items while searching in{" "}
              <Link href="/add-item" className="text-primary font-semibold hover:underline">
                Add New Asset
              </Link>{" "}
              to add them to your wishlist and track their market price.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {wishlist.map(({ wishlistItem, product }) => (
              <WishlistItem
                key={wishlistItem.id}
                item={{
                  id: wishlistItem.id,
                  name: wishlistItem.name,
                }}
                product={
                  product
                    ? {
                        currentPrice: product.currentPrice ?? null,
                        imageUrl: product.imageUrl ?? null,
                      }
                    : null
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
