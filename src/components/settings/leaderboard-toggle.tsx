"use client";

import { useTransition } from "react";
import { updatePreferencesAction } from "@/lib/actions/preferences";

export function LeaderboardToggle({
  initialOptIn,
}: {
  initialOptIn: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      await updatePreferencesAction({ leaderboardOptIn: !initialOptIn });
    });
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-bold text-sm">Show on Leaderboard</p>
        <p className="text-xs text-on-surface-variant">
          {initialOptIn
            ? "Your collection is visible on the public leaderboard."
            : "Your collection is hidden from the leaderboard. Opt in to compete!"}
        </p>
      </div>
      <button
        onClick={toggle}
        disabled={isPending}
        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors disabled:opacity-50 ${
          initialOptIn ? "bg-tertiary/20" : "bg-surface-variant"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
            initialOptIn ? "right-1 bg-tertiary" : "left-1 bg-outline"
          }`}
        />
      </button>
    </div>
  );
}
