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
      <header className="mb-12 relative">
        {/* Blurred primary circle */}
        <div
          className="absolute -top-8 -left-8 w-64 h-64 rounded-full bg-primary opacity-10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative max-w-2xl">
          <h1 className="font-headline text-5xl font-extrabold text-on-surface tracking-tighter mb-4">
            THE HUNT IS ON.
          </h1>
          <p className="font-body text-lg text-on-surface-variant">
            Track prices on items you're hunting. When the market dips below
            your target, you'll know it's time to strike.
          </p>
        </div>
      </header>

      {/* Target Watchlist */}
      <section>
        <h2 className="font-headline text-xl font-bold text-on-surface uppercase tracking-widest mb-6">
          Target Watchlist
        </h2>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline mb-4 block">
              auto_awesome
            </span>
            <h3 className="font-headline text-xl font-bold mb-2 text-on-surface">
              Watchlist is empty
            </h3>
            <p className="text-on-surface-variant mb-6">
              Add items you're hunting to track their market price against your
              target.
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 holographic-gradient text-on-primary-fixed font-headline font-bold py-3 px-6 rounded-lg"
            >
              <span className="material-symbols-outlined">storefront</span>
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {wishlist.map(({ wishlistItem, product }) => (
              <WishlistItem
                key={wishlistItem.id}
                item={{
                  id: wishlistItem.id,
                  name: wishlistItem.name,
                  targetPrice: wishlistItem.targetPrice ?? null,
                  alertsEnabled: wishlistItem.alertsEnabled ?? false,
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
