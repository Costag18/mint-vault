import Link from "next/link";

const externalTools = [
  {
    label: "PriceCharting",
    description: "Market prices for video games, cards, and comics.",
    href: "https://www.pricecharting.com",
  },
  {
    label: "PSA Cert Verification",
    description: "Verify PSA graded card authenticity by cert number.",
    href: "https://www.psacard.com/cert",
  },
  {
    label: "CGC Comics Lookup",
    description: "Verify CGC graded comic books and check census data.",
    href: "https://www.cgccomics.com/certlookup",
  },
  {
    label: "BGS Card Verification",
    description: "Look up Beckett graded cards by certification number.",
    href: "https://www.beckett.com/grading/card-lookup",
  },
  {
    label: "eBay Completed Sales",
    description: "Browse recently sold listings to gauge real market value.",
    href: "https://www.ebay.com/sch/i.html?LH_Complete=1&LH_Sold=1",
  },
  {
    label: "TCGplayer",
    description: "Trading card marketplace with pricing for Pokemon, Magic, and Yu-Gi-Oh.",
    href: "https://www.tcgplayer.com",
  },
  {
    label: "Cardmarket",
    description: "Europe's largest marketplace for trading cards.",
    href: "https://www.cardmarket.com",
  },
  {
    label: "WATA Games",
    description: "Video game grading and authentication service.",
    href: "https://www.watagames.com",
  },
  {
    label: "GoCollect",
    description: "Comic book price guide with sales history and analytics.",
    href: "https://gocollect.com",
  },
  {
    label: "130point",
    description: "Free eBay sold item lookup — fast alternative to eBay search.",
    href: "https://130point.com/sales",
  },
];

export default function MarketInsightPage() {
  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-2">
          External <span className="text-primary italic">Tools</span>
        </h1>
        <p className="text-on-surface-variant text-base">
          Useful resources for pricing, grading verification, and market research.
        </p>
      </header>

      <div className="flex flex-col gap-3">
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
              open_in_new
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
