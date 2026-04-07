"use client";

import { useState, useTransition } from "react";
import { updatePreferencesAction } from "@/lib/actions/preferences";

export function ProfileEditor({
  initialName,
  initialAvatar,
}: {
  initialName: string;
  initialAvatar: string;
}) {
  const [name, setName] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatar);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await updatePreferencesAction({
        displayName: name || undefined,
        avatarUrl: avatarUrl || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="rounded-2xl bg-surface-container p-5 space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full bg-surface-container-highest overflow-hidden shrink-0 flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="material-symbols-outlined text-3xl text-outline">
              person
            </span>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-[10px] font-label text-outline uppercase tracking-widest">
            Avatar URL
          </label>
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="w-full bg-surface-container-high border-none rounded-xl px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-label text-outline uppercase tracking-widest">
          Display Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your collector name"
          className="w-full bg-surface-container-high border-none rounded-xl px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50"
        />
      </div>
      <button
        onClick={handleSave}
        disabled={isPending}
        className="px-5 py-2 rounded-lg text-xs font-headline font-bold bg-primary text-on-primary hover:brightness-110 transition-all disabled:opacity-50"
      >
        {isPending ? "Saving..." : saved ? "Saved!" : "Save Profile"}
      </button>
    </div>
  );
}
