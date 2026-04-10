import { auth } from "@clerk/nextjs/server";
import { getPreferences } from "@/lib/db/queries/preferences";
import { UserProfileWrapper } from "@/components/settings/user-profile-wrapper";
import { PrivacyToggle } from "@/components/settings/privacy-toggle";
import { LeaderboardToggle } from "@/components/settings/leaderboard-toggle";
import { ProfileEditor } from "@/components/settings/profile-editor";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const preferences = await getPreferences(userId);

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="font-headline text-5xl font-extrabold text-on-surface tracking-tighter mb-2">
          Settings
        </h1>
        <p className="font-body text-on-surface-variant">
          Manage your profile and notification preferences.
        </p>
      </header>

      {/* Display Name & Avatar */}
      <section className="mb-12">
        <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-5">
          Collector Profile
        </h2>
        <ProfileEditor
          initialName={preferences?.displayName ?? ""}
          initialAvatar={preferences?.avatarUrl ?? ""}
        />
      </section>

      {/* Clerk Account */}
      <section className="mb-12">
        <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-5">
          Account
        </h2>
        <UserProfileWrapper />
      </section>

      {/* Privacy & Sharing */}
      <section className="mb-12">
        <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-5">
          Privacy & Sharing
        </h2>
        <div className="rounded-2xl bg-surface-container p-5 space-y-5">
          <PrivacyToggle initialPublic={preferences?.profilePublic ?? true} />
          <p className="text-xs text-on-surface-variant">
            When public, your collection is viewable via your share links.
            Private profiles are hidden from all public pages.
          </p>
          <div className="border-t border-outline-variant/20 pt-4">
            <LeaderboardToggle
              initialOptIn={preferences?.leaderboardOptIn ?? false}
            />
            <p className="text-xs text-on-surface-variant mt-2">
              Opt in to display your collection on the public leaderboard.
              This is off by default — your collection value and item count
              will only appear if you choose to participate.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
