"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export function ShareLinks() {
  const { user } = useUser();
  const [copied, setCopied] = useState<string | null>(null);

  if (!user) return null;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const profileUrl = `${baseUrl}/u/${user.id}`;
  const forSaleUrl = `${baseUrl}/u/${user.id}/for-sale`;

  function copy(url: string, label: string) {
    navigator.clipboard.writeText(url);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-label text-outline uppercase tracking-widest">
        Share Your Collection
      </p>
      <button
        onClick={() => copy(profileUrl, "profile")}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-left"
      >
        <span className="material-symbols-outlined text-primary text-lg">
          link
        </span>
        <span className="text-xs text-on-surface flex-1">Collection Link</span>
        <span className="text-[10px] font-label text-primary font-bold">
          {copied === "profile" ? "Copied!" : "Copy"}
        </span>
      </button>
      <button
        onClick={() => copy(forSaleUrl, "sale")}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-left"
      >
        <span className="material-symbols-outlined text-tertiary text-lg">
          sell
        </span>
        <span className="text-xs text-on-surface flex-1">For Sale Link</span>
        <span className="text-[10px] font-label text-tertiary font-bold">
          {copied === "sale" ? "Copied!" : "Copy"}
        </span>
      </button>
    </div>
  );
}
