import { auth } from "@clerk/nextjs/server";
import { getPreferences } from "@/lib/db/queries/preferences";
import { UserProfileWrapper } from "@/components/settings/user-profile-wrapper";
import { PrivacyToggle } from "@/components/settings/privacy-toggle";

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

      {/* Profile section */}
      <section className="mb-12">
        <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-5">
          Profile
        </h2>
        <UserProfileWrapper />
      </section>

      {/* Privacy & Sharing */}
      <section className="mb-12">
        <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-5">
          Privacy & Sharing
        </h2>
        <div className="rounded-2xl bg-surface-container p-5 space-y-4">
          <PrivacyToggle initialPublic={preferences?.profilePublic ?? true} />
          <p className="text-xs text-on-surface-variant">
            When public, your collection appears on the leaderboard and is
            viewable via your share links. Private profiles are hidden from all
            public pages.
          </p>
        </div>
      </section>

      {/* Preferences section */}
      <section>
        <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-5">
          Preferences
        </h2>
        <div className="rounded-2xl bg-surface-container divide-y divide-outline-variant/20 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 gap-4">
            <div>
              <p className="font-headline font-semibold text-on-surface">
                Email Alerts
              </p>
              <p className="text-sm text-on-surface-variant font-body mt-0.5">
                Receive email notifications when watchlist targets are hit.
              </p>
            </div>
            <div
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                preferences?.emailAlertsEnabled
                  ? "bg-primary"
                  : "bg-surface-container-highest"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  preferences?.emailAlertsEnabled
                    ? "translate-x-5"
                    : "translate-x-0.5"
                }`}
              />
            </div>
          </div>
          <div className="flex items-center justify-between px-5 py-4 gap-4">
            <div>
              <p className="font-headline font-semibold text-on-surface">
                Default Collection View
              </p>
              <p className="text-sm text-on-surface-variant font-body mt-0.5">
                Choose how your collection is displayed by default.
              </p>
            </div>
            <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant bg-surface-container-high px-3 py-1.5 rounded-full">
              {preferences?.defaultView ?? "Grid"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
