"use client";

import { UserProfile } from "@clerk/nextjs";

export function UserProfileWrapper() {
  return (
    <UserProfile
      routing="hash"
      appearance={{
        elements: {
          rootBox: "w-full",
          card: "bg-surface-container shadow-none rounded-2xl border border-outline-variant/20 w-full",
        },
      }}
    />
  );
}
