"use client";

import { useState, useTransition } from "react";
import { updatePreferencesAction } from "@/lib/actions/preferences";
import { checkProfanity, validateAvatarUrl } from "@/lib/utils/moderation";

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
  const [error, setError] = useState<string | null>(null);

  // Client-side validation for instant feedback
  const nameError = name ? checkProfanity(name) : null;
  const avatarError = avatarUrl ? validateAvatarUrl(avatarUrl) : null;
  const hasClientError = !!nameError || !!avatarError;

  function handleSave() {
    setError(null);

    if (hasClientError) return;

    startTransition(async () => {
      const result = await updatePreferencesAction({
        displayName: name || undefined,
        avatarUrl: avatarUrl || undefined,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="rounded-2xl bg-surface-container p-5 space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full bg-surface-container-highest overflow-hidden shrink-0 flex items-center justify-center">
          {avatarUrl && !avatarError ? (
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
            onChange={(e) => { setAvatarUrl(e.target.value); setError(null); }}
            placeholder="https://example.com/photo.jpg"
            className={`w-full bg-surface-container-high border rounded-xl px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50 ${
              avatarError ? "border-error" : "border-transparent"
            }`}
          />
          {avatarError && (
            <p className="text-xs text-error flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">error</span>
              {avatarError}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-label text-outline uppercase tracking-widest">
          Display Name
        </label>
        <input
          value={name}
          onChange={(e) => { setName(e.target.value); setError(null); }}
          placeholder="Your collector name"
          className={`w-full bg-surface-container-high border rounded-xl px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50 ${
            nameError ? "border-error" : "border-transparent"
          }`}
        />
        {nameError && (
          <p className="text-xs text-error flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">error</span>
            Display name contains inappropriate language.
          </p>
        )}
      </div>

      {/* Server-side error */}
      {error && (
        <div className="flex items-center gap-2 text-error text-xs bg-error/10 rounded-xl px-3 py-2">
          <span className="material-symbols-outlined text-sm">warning</span>
          {error}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={isPending || hasClientError}
        className="px-5 py-2 rounded-lg text-xs font-headline font-bold bg-primary text-on-primary hover:brightness-110 transition-all disabled:opacity-50"
      >
        {isPending ? "Saving..." : saved ? "Saved!" : "Save Profile"}
      </button>
    </div>
  );
}
