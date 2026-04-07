import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 max-w-6xl mx-auto w-full">
        <h1 className="font-headline text-3xl font-bold tracking-tighter">
          MINT <span className="text-primary italic">VAULT</span>
        </h1>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center -mt-16">
        <div className="max-w-2xl">
          <h2 className="font-headline text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6">
            Track Your <span className="text-primary italic">Collection</span>
          </h2>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-lg mx-auto mb-10">
            The modern vault for trading cards, comics, retro games, and
            collectibles. Catalog, value, and share your collection.
          </p>
          <Link
            href="/sign-up"
            className="holographic-gradient inline-flex items-center gap-2 px-8 py-4 rounded-xl font-headline text-sm font-bold uppercase tracking-widest text-on-primary-fixed"
          >
            <span className="material-symbols-outlined text-[20px]">
              rocket_launch
            </span>
            Start Your Vault
          </Link>
          <div className="mt-4">
            <Link
              href="/sign-in"
              className="text-sm text-on-surface-variant hover:text-primary transition-colors font-label"
            >
              Already have an account? <span className="font-bold underline">Sign in</span>
            </Link>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-16">
          {[
            { icon: "style", text: "Catalog Items" },
            { icon: "trending_up", text: "Track Value" },
            { icon: "share", text: "Share Collection" },
            { icon: "sell", text: "Open to Offers" },
            { icon: "search", text: "Price Lookup" },
          ].map((f) => (
            <div
              key={f.text}
              className="flex items-center gap-2 bg-surface-container rounded-full px-4 py-2"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">
                {f.icon}
              </span>
              <span className="text-sm font-label font-bold text-on-surface-variant">
                {f.text}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 text-center">
        <p className="text-xs text-outline">
          MINT VAULT &mdash; Your collectibles, organized.
        </p>
      </footer>
    </div>
  );
}
