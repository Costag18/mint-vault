"use client";

import { useTransition } from "react";
import { updatePreferencesAction } from "@/lib/actions/preferences";

export function PrivacyToggle({ initialPublic }: { initialPublic: boolean }) {
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      await updatePreferencesAction({ profilePublic: !initialPublic });
    });
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-bold text-sm">Public Profile</p>
        <p className="text-xs text-on-surface-variant">
          {initialPublic
            ? "Your collection is visible on the leaderboard and via your share link."
            : "Your collection is hidden from public view and the leaderboard."}
        </p>
      </div>
      <button
        onClick={toggle}
        disabled={isPending}
        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors disabled:opacity-50 ${
          initialPublic ? "bg-primary/20" : "bg-surface-variant"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
            initialPublic ? "right-1 bg-primary" : "left-1 bg-outline"
          }`}
        />
      </button>
    </div>
  );
}
