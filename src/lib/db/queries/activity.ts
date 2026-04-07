import { db } from "@/lib/db";
import { activityLog } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function logActivity(data: {
  userId: string;
  type: string;
  itemId?: string;
  metadata?: Record<string, unknown>;
}) {
  return db.insert(activityLog).values({
    userId: data.userId,
    type: data.type,
    itemId: data.itemId,
    metadata: data.metadata,
  });
}

export async function getRecentActivity(userId: string, limit = 10) {
  return db
    .select()
    .from(activityLog)
    .where(eq(activityLog.userId, userId))
    .orderBy(desc(activityLog.createdAt))
    .limit(limit);
}
