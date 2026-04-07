import { formatRelativeTime } from "@/lib/utils/format";

type ActivityType = "item_added" | "item_removed" | "item_sold" | "grade_verified";

interface Activity {
  id: number;
  type: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

interface VaultHistoryProps {
  activities: Activity[];
}

const activityConfig: Record<
  ActivityType,
  { icon: string; colorClass: string; label: string }
> = {
  item_added: {
    icon: "shopping_bag",
    colorClass: "bg-tertiary text-on-tertiary",
    label: "Added",
  },
  item_removed: {
    icon: "delete",
    colorClass: "bg-error text-on-error",
    label: "Removed",
  },
  item_sold: {
    icon: "sell",
    colorClass: "bg-secondary text-on-secondary",
    label: "Sold",
  },
  grade_verified: {
    icon: "verified",
    colorClass: "bg-primary text-on-primary",
    label: "Graded",
  },
};

const defaultConfig = {
  icon: "history",
  colorClass: "bg-surface-container text-on-surface-variant",
  label: "Updated",
};

export function VaultHistory({ activities }: VaultHistoryProps) {
  return (
    <div className="bg-surface-container-low rounded-2xl p-6 ghost-border">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-on-surface-variant">
          history
        </span>
        <h2 className="font-headline font-bold text-xl text-on-surface">
          Vault History
        </h2>
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-40 mb-3">
            inbox
          </span>
          <p className="text-on-surface-variant text-sm">No activity yet</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {activities.map((activity) => {
            const config =
              activityConfig[activity.type as ActivityType] ?? defaultConfig;
            const itemName =
              (activity.metadata?.name as string) ??
              (activity.metadata?.itemName as string) ??
              "Item";

            return (
              <li key={activity.id} className="flex items-center gap-3">
                {/* Icon box */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${config.colorClass}`}
                >
                  <span className="material-symbols-outlined text-base">
                    {config.icon}
                  </span>
                </div>

                {/* Label + name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-label font-semibold text-on-surface leading-tight">
                    {config.label}
                  </p>
                  <p className="text-xs text-on-surface-variant truncate">
                    {itemName}
                  </p>
                </div>

                {/* Relative time */}
                <p className="text-xs text-on-surface-variant flex-shrink-0">
                  {formatRelativeTime(activity.createdAt)}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
