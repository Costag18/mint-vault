import Link from "next/link";

const categories = [
  {
    label: "Trading Card Games",
    icon: "monitoring",
    colorClass: "bg-tertiary-container text-on-tertiary-container",
    iconClass: "text-tertiary",
    description: "PSA slabs, raw cards, sealed product pricing trends.",
  },
  {
    label: "Comics",
    icon: "auto_stories",
    colorClass: "bg-secondary-container text-on-secondary-container",
    iconClass: "text-secondary",
    description: "Key issues, first appearances, CGC census data.",
  },
  {
    label: "Retro Games",
    icon: "sports_esports",
    colorClass: "bg-primary-container text-on-primary-container",
    iconClass: "text-primary",
    description: "WATA & VGA grades, sealed vs. loose market trends.",
  },
];

const externalTools = [
  {
    label: "PriceCharting",
    description: "Market prices for video games, cards, and comics.",
    href: "https://www.pricecharting.com",
    icon: "open_in_new",
  },
  {
    label: "PSA Cert Verification",
    description: "Verify PSA graded card authenticity by cert number.",
    href: "https://www.psacard.com/cert",
    icon: "open_in_new",
  },
  {
    label: "eBay Completed Sales",
    description: "Browse recently sold listings to gauge real market value.",
    href: "https://www.ebay.com/sch/i.html?LH_Complete=1&LH_Sold=1",
    icon: "open_in_new",
  },
];

export default function MarketInsightPage() {
  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <h1 className="font-headline text-5xl font-extrabold text-on-surface tracking-tighter mb-3">
          Market{" "}
          <span className="text-primary italic">Insight</span>
        </h1>
        <p className="font-body text-lg text-on-surface-variant">
          Stay ahead of the market. Track category trends and verify prices
          before you buy or sell.
        </p>
      </header>

      {/* Category cards */}
      <section className="mb-14">
        <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-5">
          Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className={`rounded-2xl p-6 flex flex-col gap-3 ${cat.colorClass}`}
            >
              <span
                className={`material-symbols-outlined text-4xl ${cat.iconClass}`}
              >
                {cat.icon}
              </span>
              <h3 className="font-headline text-lg font-bold leading-tight">
                {cat.label}
              </h3>
              <p className="text-sm opacity-75 font-body leading-snug">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* External Tools */}
      <section>
        <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-5">
          External Tools
        </h2>
        <div className="flex flex-col gap-4">
          {externalTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors px-5 py-4 flex items-center justify-between gap-4 group"
            >
              <div>
                <p className="font-headline font-bold text-on-surface">
                  {tool.label}
                </p>
                <p className="text-sm text-on-surface-variant font-body mt-0.5">
                  {tool.description}
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors flex-shrink-0">
                {tool.icon}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
